import { useRef } from "react";

import { useCallback } from "react";

interface BehaviorUrlsSectionProps {
  behaviorUrls: string[];
  behaviorText: string;
  isBehaviorURLs: boolean;
  toggleBehaviorType: () => void;
  onUpdateBehaviorText: (value: string) => void;
  onAddUrl: () => void;
  onRemoveUrl: (index: number) => void;
  onUpdateUrl: (index: number, value: string) => void;
  disabled?: boolean;
}

export function BehaviorUrlsSection({
  behaviorUrls,
  behaviorText,
  isBehaviorURLs,
  toggleBehaviorType,
  onAddUrl,
  onRemoveUrl,
  onUpdateUrl,
  onUpdateBehaviorText,
  disabled,
}: BehaviorUrlsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddUrl = useCallback(() => {
    onAddUrl();
    // Wait for the next render cycle to ensure the new input is added
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  }, [onAddUrl]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 p-1">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">
            Style references (optional)
          </label>
          <div className="flex items-center justify-end">
            <div className="flex items-center">
              <span className="text-xs mr-2 whitespace-nowrap">Use URL</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="behaviorTypeToggle"
                  name="behaviorTypeToggle"
                  className="sr-only"
                  defaultChecked={isBehaviorURLs}
                  onClick={toggleBehaviorType}
                  disabled={disabled}
                />
                <label
                  htmlFor="behaviorTypeToggle"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full ${
                      isBehaviorURLs ? "bg-blue-500" : "bg-gray-500"
                    } transform transition-all duration-200 ease-in-out ${
                      disabled ? "opacity-50" : ""
                    }`}
                    style={{
                      transform: isBehaviorURLs
                        ? "translateX(16px)"
                        : "translateX(0)",
                    }}
                  ></span>
                </label>
              </div>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline truncate">
                Toggle between URL and text input modes
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {isBehaviorURLs
            ? "Enter URLs of content whose style/format you want to replicate"
            : "Enter text content whose style/format you want to replicate"}
        </p>
      </div>

      {isBehaviorURLs ? (
        <div
          ref={containerRef}
          className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1"
        >
          {behaviorUrls.map((url, index) => (
            <div
              key={`behavior-${index}`}
              className="flex gap-1 items-center w-full"
            >
              <input
                type="url"
                value={url}
                onChange={(e) => onUpdateUrl(index, e.target.value)}
                placeholder="https://example.com/behavior-template"
                className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={disabled}
              />
              {behaviorUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveUrl(index)}
                  className={`px-2 text-red-500 hover:text-red-700 ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  aria-label="Remove behavior URL"
                  disabled={disabled}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-1">
          <textarea
            value={behaviorText}
            onChange={(e) => onUpdateBehaviorText(e.target.value)}
            placeholder="Enter style reference content here..."
            className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white min-h-[150px] ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={disabled}
            maxLength={5000}
          />
          <div className="text-xs text-gray-500 flex justify-between">
            <p className="ml-auto">{behaviorText.length} / 5000 characters</p>
          </div>
        </div>
      )}

      {isBehaviorURLs && (
        <button
          type="button"
          onClick={handleAddUrl}
          className={`text-sm text-blue-600 dark:text-blue-400 hover:underline mx-auto block ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={disabled}
        >
          + Add another reference
        </button>
      )}
    </div>
  );
}
