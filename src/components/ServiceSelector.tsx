import { Service } from "@/interfaces/service";

interface ServiceSelectorProps {
  service: Service;
  onServiceChange: (service: Service) => void;
  disabled?: boolean;
}

export function ServiceSelector({
  service,
  onServiceChange,
  disabled,
}: ServiceSelectorProps) {
  return (
    <div className="w-full max-w-6xl mx-auto mb-4 p-1">
      <label className="block text-sm font-medium mb-2">Select platform</label>
      <div className="relative">
        <select
          value={service}
          onChange={(e) => onServiceChange(e.target.value as Service)}
          className={`w-full px-2 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white appearance-none pr-8 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
        >
          <option value={Service.TWITTER}>Twitter</option>
          <option value={Service.LINKEDIN}>LinkedIn</option>
          <option value={Service.FACEBOOK}>Facebook</option>
          <option value={Service.BLOG}>Blog</option>
        </select>
        <div
          className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${
            disabled ? "opacity-50" : ""
          }`}
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
