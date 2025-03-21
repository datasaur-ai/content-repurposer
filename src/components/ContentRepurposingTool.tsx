"use client";

import { useFormHandler } from "@/hooks/useFormHandler";
import { useGeneratePost } from "@/hooks/useGeneratePost";
import { useCallback, useMemo } from "react";
import { BehaviorUrlsSection } from "./BehaviorUrlsSection";
import { OutputSection } from "./OutputSection";
import { ServiceSelector } from "./ServiceSelector";
import { SourceUrlsSection } from "./SourceUrlsSection";

export function ContentRepurposingTool() {
  const {
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
  } = useFormHandler();

  const { output, isLoading, error, handleSubmit, stopGeneration } =
    useGeneratePost();

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      handleSubmit(e, {
        sourceUrls,
        sourceText,
        isSourceURLs,
        behaviorUrls,
        behaviorText,
        isBehaviorURLs,
        service,
        streamEnabled,
      });
    },
    [
      handleSubmit,
      sourceUrls,
      sourceText,
      isSourceURLs,
      behaviorUrls,
      behaviorText,
      isBehaviorURLs,
      service,
      streamEnabled,
    ]
  );

  const isDisabled = useMemo(() => {
    if (isSourceURLs) {
      return isLoading || sourceUrls.every((url) => url.trim() === "");
    }
    return isLoading || sourceText.trim() === "";
  }, [isLoading, isSourceURLs, sourceUrls, sourceText]);

  return (
    <div className="w-full space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <ServiceSelector
          service={service}
          onServiceChange={(value) => setService(value)}
          disabled={isLoading}
        />

        <SourceUrlsSection
          sourceUrls={sourceUrls}
          onAddUrl={addSourceUrl}
          onRemoveUrl={removeSourceUrl}
          onUpdateUrl={updateSourceUrl}
          disabled={isLoading}
          isSourceURLs={isSourceURLs}
          toggleSourceType={toggleSourceType}
          sourceText={sourceText}
          onUpdateSourceText={updateSourceText}
        />

        <BehaviorUrlsSection
          behaviorUrls={behaviorUrls}
          onAddUrl={addBehaviorUrl}
          onRemoveUrl={removeBehaviorUrl}
          onUpdateUrl={updateBehaviorUrl}
          disabled={isLoading}
          isBehaviorURLs={isBehaviorURLs}
          toggleBehaviorType={toggleBehaviorType}
          behaviorText={behaviorText}
          onUpdateBehaviorText={updateBehaviorText}
        />

        <div className="w-full max-w-6xl mx-auto mb-4 p-1">
          <div className="flex items-center">
            <label
              htmlFor="streamToggle"
              className="block text-sm font-medium mr-3"
            >
              Enable streaming
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="streamToggle"
                name="streamToggle"
                className="sr-only"
                defaultChecked={streamEnabled}
                onChange={() => {
                  setStreamEnabled((prev) => !prev);
                }}
                disabled={isLoading}
              />
              <label
                htmlFor="streamToggle"
                className={`block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full ${
                    streamEnabled ? "bg-blue-500" : "bg-gray-500"
                  } transform transition-all duration-200 ease-in-out ${
                    isLoading ? "opacity-50" : ""
                  }`}
                  style={{
                    transform: streamEnabled
                      ? "translateX(16px)"
                      : "translateX(0)",
                  }}
                ></span>
              </label>
            </div>
            <span className="text-xs text-gray-400">
              See content as it&apos;s being generated
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="mx-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Generate Content"}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      {output && (
        <OutputSection
          output={output}
          onStop={stopGeneration}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
