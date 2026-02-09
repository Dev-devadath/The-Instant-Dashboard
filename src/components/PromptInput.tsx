'use client';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const QUICK_SUGGESTIONS = [
  'Modern design',
  'Dark theme',
  'Chart view',
  'Clean layout',
  'Professional style',
];

export default function PromptInput({ value, onChange, selectedTags, onTagToggle }: PromptInputProps) {

  return (
    <div className="flex flex-col">
      <label htmlFor="prompt-input" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        User Prompt
      </label>
      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        placeholder="e.g., Create a clean business dashboard. Show a total spending summary at the top and a simple table below for the items. Use a professional font and light grey background."
        rows={4}
        maxLength={2000}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-wrap gap-2">
          {QUICK_SUGGESTIONS.map((suggestion) => {
            const isSelected = selectedTags.includes(suggestion);
            return (
              <button
                key={suggestion}
                onClick={() => onTagToggle(suggestion)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {isSelected ? '✓' : '+'} {suggestion}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {value.length}/2000
        </div>
      </div>
    </div>
  );
}
