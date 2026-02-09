'use client';

import { ModelProvider } from '@/types';
import { geminiModels } from '@/lib/gemini';

interface ModelSelectorProps {
  provider: ModelProvider;
  model: string;
  onProviderChange: (provider: ModelProvider) => void;
  onModelChange: (model: string) => void;
}

export default function ModelSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
}: ModelSelectorProps) {
  const handleProviderChange = (newProvider: ModelProvider) => {
    onProviderChange(newProvider);
    // Set default model for the new provider
    if (newProvider === 'openai') {
      onModelChange('gpt-4o');
    } else {
      onModelChange('gemini-3-pro-preview');
    }
  };

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <label htmlFor="provider-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          AI Provider
        </label>
        <select
          id="provider-select"
          value={provider}
          onChange={(e) => handleProviderChange(e.target.value as ModelProvider)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="openai">OpenAI</option>
          <option value="gemini">Google Gemini</option>
        </select>
      </div>
      
      <div className="flex-1">
        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Model
        </label>
        <select
          id="model-select"
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {provider === 'openai' ? (
            <>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-5.1">GPT-5.1 (Preview)</option>
            </>
          ) : (
            <>
              {Object.entries(geminiModels).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
    </div>
  );
}
