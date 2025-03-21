import { GenerateRequestBody } from "@/app/api/generate/route";
import { Service } from "@/interfaces/service";
import { useCallback, useRef, useState } from "react";

interface SubmitParams {
  sourceUrls: string[];
  sourceText: string;
  isSourceURLs: boolean;
  behaviorUrls: string[];
  behaviorText: string;
  isBehaviorURLs: boolean;
  service: Service;
  streamEnabled: boolean;
}

export function useGeneratePost() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setError("");
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent, params: SubmitParams) => {
      e.preventDefault();
      const {
        isSourceURLs,
        sourceText,
        sourceUrls,
        behaviorUrls,
        behaviorText,
        isBehaviorURLs,
        service,
        streamEnabled,
      } = params;

      const filteredSourceUrls = sourceUrls.filter((url) => url.trim() !== "");
      const filteredBehaviorUrls = behaviorUrls.filter(
        (url) => url.trim() !== ""
      );

      if (filteredSourceUrls.length === 0 && isSourceURLs) {
        setError("At least one content URL is required");
        return;
      }

      if (sourceText.length === 0 && !isSourceURLs) {
        setError("content is required");
        return;
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError("");
      setOutput("");

      try {
        const savedApiKey = localStorage.getItem("apiKey");
        const savedEndpoint = localStorage.getItem("endpoint");

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(streamEnabled && { stream: true }),
            isSourceURLs,
            source_text: sourceText,
            source_urls: filteredSourceUrls,
            behaviour_urls: filteredBehaviorUrls,
            behaviour_text: behaviorText,
            isBehaviorURLs,
            service,
            ...(savedApiKey && { api_key: savedApiKey }),
            ...(savedEndpoint && { endpoint: savedEndpoint }),
          } as GenerateRequestBody),
          signal: abortControllerRef.current.signal, // Add abort signal
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        if (streamEnabled) {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response stream available");
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n").filter((line) => line.trim());

            for (const line of lines) {
              const data = JSON.parse(line);

              switch (data.type) {
                case "progress":
                  setOutput((prev) => prev + data.message);
                  // Scroll to bottom after updating output
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 0);
                  break;
                case "complete":
                  setOutput(data.message);
                  // Scroll to bottom after completion
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 0);
                  break;
              }
            }
          }
        } else {
          const data = await response.json();
          setOutput(data.choices[0].message.content);
        }
      } catch (err) {
        // Don't show error if request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          setError("Generation stopped");
          return;
        }
        console.error(err);
        setError(`Failed to generate content - ${err}`);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    []
  );

  return {
    output,
    isLoading,
    error,
    handleSubmit,
    stopGeneration, // Export the stop function
  };
}
