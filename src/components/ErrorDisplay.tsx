'use client';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
}

export default function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="font-semibold mb-1">Error</p>
        <p className="text-sm">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-600 hover:text-red-800 transition-colors"
        aria-label="Dismiss error"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
