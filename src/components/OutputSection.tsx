import { useCallback } from "react";
import ReactMarkdown from "react-markdown";

interface OutputSectionProps {
  output: string;
  isLoading: boolean;
  onStop?: () => void;
}

export function OutputSection({
  output,
  onStop,
  isLoading,
}: OutputSectionProps) {
  const copyMarkdown = useCallback(() => {
    navigator.clipboard.writeText(output);
  }, [output]);

  const copyPlainText = useCallback(() => {
    const plainText = output
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");
    navigator.clipboard.writeText(plainText);
  }, [output]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-2">Generated content</h2>
      <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50 whitespace-pre-wrap markdown-content">
        <ReactMarkdown>{output}</ReactMarkdown>
      </div>
      {!isLoading && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={copyMarkdown}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy as markdown
          </button>
          <button
            onClick={copyPlainText}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            Copy as plain Text
          </button>
        </div>
      )}
      {onStop && isLoading && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
          <button
            onClick={onStop}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm flex items-center gap-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
            Stop Generating
          </button>
        </div>
      )}
    </div>
  );
}
