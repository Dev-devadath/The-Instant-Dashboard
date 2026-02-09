'use client';

import { useState, useCallback, useEffect } from 'react';
import { validateJson, validatePrompt } from '@/lib/validators';
import { ModelProvider } from '@/types';

interface UseGenerateDashboardReturn {
  jsonInput: string;
  promptInput: string;
  generatedHtml: string | null;
  isLoading: boolean;
  error: string | null;
  isValidJson: boolean;
  provider: ModelProvider;
  model: string;
  selectedTags: string[];
  loadingMessage: string;
  setJsonInput: (value: string) => void;
  setPromptInput: (value: string) => void;
  setProvider: (value: ModelProvider) => void;
  setModel: (value: string) => void;
  toggleTag: (tag: string) => void;
  generate: () => Promise<void>;
  clearError: () => void;
  clearPreview: () => void;
}

export function useGenerateDashboard(): UseGenerateDashboardReturn {
  const [jsonInput, setJsonInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState(true);
  const [provider, setProvider] = useState<ModelProvider>('gemini');
  const [model, setModel] = useState('gemini-3-pro-preview');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  // Rotating loading messages
  const loadingMessages = [
    'Thinking...',
    'Analyzing your data...',
    'Getting contents...',
    'Designing layout...',
    'Creating components...',
    'Applying styles...',
    'Optimizing design...',
    'Finalizing dashboard...',
  ];

  // Update validation state when JSON changes
  useEffect(() => {
    if (jsonInput.trim() === '') {
      setIsValidJson(true); // Empty is valid (user hasn't entered anything yet)
      return;
    }
    const validation = validateJson(jsonInput);
    setIsValidJson(validation.valid);
  }, [jsonInput]);

  const generate = useCallback(async () => {
    // Clear previous error
    setError(null);

    // Validate JSON
    const jsonValidation = validateJson(jsonInput);
    if (!jsonValidation.valid) {
      setError(jsonValidation.error || 'Invalid JSON');
      return;
    }

    // Validate prompt
    const promptValidation = validatePrompt(promptInput);
    if (!promptValidation.valid) {
      setError(promptValidation.error || 'Invalid prompt');
      return;
    }

    setIsLoading(true);
    setLoadingMessage(loadingMessages[0]);

    // Combine prompt with selected tags
    const tagsText = selectedTags.length > 0 ? `\n\nAdditional requirements: ${selectedTags.join(', ')}` : '';
    const fullPrompt = promptInput + tagsText;

    // Start rotating loading messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2000); // Change message every 2 seconds

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonData: jsonValidation.data,
          userPrompt: fullPrompt,
          provider,
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate dashboard');
      }
      
      if (data.html) {
        clearInterval(messageInterval);
        setLoadingMessage('Finalizing dashboard...');
        setGeneratedHtml(data.html);
        setLoadingMessage('');
      } else {
        throw new Error('No HTML generated');
      }
    } catch (err) {
      clearInterval(messageInterval);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setGeneratedHtml(null);
      setLoadingMessage('');
    } finally {
      clearInterval(messageInterval);
      setIsLoading(false);
    }
  }, [jsonInput, promptInput, provider, model, selectedTags]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPreview = useCallback(() => {
    setGeneratedHtml(null);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  return {
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
    clearPreview,
  };
}
