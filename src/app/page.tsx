'use client';

import { useEffect } from 'react';
import { useGenerateDashboard } from '@/hooks/useGenerateDashboard';
import JsonInput from '@/components/JsonInput';
import PromptInput from '@/components/PromptInput';
import GenerateButton from '@/components/GenerateButton';
import PreviewArea from '@/components/PreviewArea';
import ErrorDisplay from '@/components/ErrorDisplay';
import ModelSelector from '@/components/ModelSelector';

export default function Home() {
  const {
    jsonInput,
    promptInput,
    generatedHtml,
    isLoading,
    error,
    isValidJson,
    provider,
    model,
    selectedTags,
    loadingMessage,
    setJsonInput,
    setPromptInput,
    setProvider,
    setModel,
    toggleTag,
    generate,
    clearError,
  } = useGenerateDashboard();

  // Auto-save to localStorage
  useEffect(() => {
    const savedJson = localStorage.getItem('dashboard-json');
    const savedPrompt = localStorage.getItem('dashboard-prompt');
    const savedProvider = localStorage.getItem('dashboard-provider');
    const savedModel = localStorage.getItem('dashboard-model');
    
    if (savedJson) setJsonInput(savedJson);
    if (savedPrompt) setPromptInput(savedPrompt);
    if (savedProvider) setProvider(savedProvider as any);
    if (savedModel) setModel(savedModel);
  }, [setJsonInput, setPromptInput, setProvider, setModel]);

  useEffect(() => {
    if (jsonInput) localStorage.setItem('dashboard-json', jsonInput);
  }, [jsonInput]);

  useEffect(() => {
    if (promptInput) localStorage.setItem('dashboard-prompt', promptInput);
  }, [promptInput]);

  useEffect(() => {
    if (provider) localStorage.setItem('dashboard-provider', provider);
  }, [provider]);

  useEffect(() => {
    if (model) localStorage.setItem('dashboard-model', model);
  }, [model]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Instant Dashboard Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform your JSON data into beautiful dashboards with AI-powered visualization
          </p>
        </header>

        <ErrorDisplay error={error} onDismiss={clearError} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Input Section */}
          <div className="lg:col-span-1 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2">
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
               <ModelSelector 
                provider={provider}
                model={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
               />
            </div>

            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <JsonInput
                value={jsonInput}
                onChange={setJsonInput}
                onValidationChange={() => {}}
              />
            </div>
            
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <PromptInput 
                value={promptInput} 
                onChange={setPromptInput}
                selectedTags={selectedTags}
                onTagToggle={toggleTag}
              />
            </div>

            <div className="flex-shrink-0">
              <GenerateButton
                onClick={generate}
                disabled={!isValidJson || !jsonInput.trim() || !promptInput.trim()}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Preview Section - Takes 2/3 of the width */}
          <div className="lg:col-span-2 min-h-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <PreviewArea 
              html={generatedHtml} 
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
