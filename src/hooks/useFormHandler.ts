import { Service } from "@/interfaces/service";
import { useCallback, useState } from "react";

export function useFormHandler() {
  const [isSourceURLs, setIsSourceURLs] = useState(false);
  const [sourceUrls, setSourceUrls] = useState<string[]>([""]);
  const [sourceText, setSourceText] = useState("");
  const [isBehaviorURLs, setIsBehaviorURLs] = useState(false);
  const [behaviorUrls, setBehaviorUrls] = useState<string[]>([""]);
  const [behaviorText, setBehaviorText] = useState("");
  const [service, setService] = useState<Service>(Service.TWITTER);
  const [streamEnabled, setStreamEnabled] = useState(true);

  const toggleSourceType = useCallback(() => {
    setIsSourceURLs((prev) => !prev);
  }, []);

  const toggleBehaviorType = useCallback(() => {
    setIsBehaviorURLs((prev) => !prev);
  }, []);

  const updateSourceText = useCallback((value: string) => {
    setSourceText(value);
  }, []);

  const updateBehaviorText = useCallback((value: string) => {
    setBehaviorText(value);
  }, []);

  const addSourceUrl = useCallback(() => {
    setSourceUrls([...sourceUrls, ""]);
  }, [sourceUrls]);

  const removeSourceUrl = useCallback(
    (index: number) => {
      if (sourceUrls.length > 1) {
        const newUrls = [...sourceUrls];
        newUrls.splice(index, 1);
        setSourceUrls(newUrls);
      }
    },
    [sourceUrls]
  );

  const updateSourceUrl = useCallback(
    (index: number, value: string) => {
      const newUrls = [...sourceUrls];
      newUrls[index] = value;
      setSourceUrls(newUrls);
    },
    [sourceUrls]
  );

  const addBehaviorUrl = useCallback(() => {
    setBehaviorUrls([...behaviorUrls, ""]);
  }, [behaviorUrls]);

  const removeBehaviorUrl = useCallback(
    (index: number) => {
      if (behaviorUrls.length > 1) {
        const newUrls = [...behaviorUrls];
        newUrls.splice(index, 1);
        setBehaviorUrls(newUrls);
      } else {
        setBehaviorUrls([""]);
      }
    },
    [behaviorUrls]
  );

  const updateBehaviorUrl = useCallback(
    (index: number, value: string) => {
      const newUrls = [...behaviorUrls];
      newUrls[index] = value;
      setBehaviorUrls(newUrls);
    },
    [behaviorUrls]
  );

  return {
    sourceUrls,
    behaviorUrls,
    service,
    addSourceUrl,
    removeSourceUrl,
    updateSourceUrl,
    addBehaviorUrl,
    removeBehaviorUrl,
    updateBehaviorUrl,
    setService,
    streamEnabled,
    setStreamEnabled,
    isSourceURLs,
    toggleSourceType,
    sourceText,
    updateSourceText,
    isBehaviorURLs,
    toggleBehaviorType,
    behaviorText,
    updateBehaviorText,
  };
}
