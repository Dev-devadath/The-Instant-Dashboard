'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { validateJson } from '@/lib/validators';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const EXAMPLE_DATA = {
  report_title: "Monthly Office Spending",
  currency: "USD",
  expenses: [
    { item: "High-speed Internet", amount: 250 },
    { item: "Coffee & Snacks", amount: 400 },
    { item: "Software Subscriptions", amount: 1200 },
    { item: "Office Electricity", amount: 350 }
  ]
};

const DEFAULT_HEIGHT = 200;
const MIN_HEIGHT = 150;
const MAX_HEIGHT = 600;

export default function JsonInput({ value, onChange, onValidationChange }: JsonInputProps) {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Load saved height from localStorage
  useEffect(() => {
    const savedHeight = localStorage.getItem('json-input-height');
    if (savedHeight) {
      setHeight(parseInt(savedHeight, 10));
    }
  }, []);

  // Save height to localStorage
  useEffect(() => {
    localStorage.setItem('json-input-height', height.toString());
  }, [height]);

  useEffect(() => {
    const validation = validateJson(value);
    setIsValid(validation.valid);
    setErrorMessage(validation.error || null);
    onValidationChange(validation.valid);
  }, [value, onValidationChange]);

  const handleLoadExample = () => {
    onChange(JSON.stringify(EXAMPLE_DATA, null, 2));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - containerRect.top;
      
      if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div ref={containerRef} className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="json-input" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          JSON Data
        </label>
        <button
          onClick={handleLoadExample}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Load Example
        </button>
      </div>
      <div 
        className="relative w-full"
        style={{ height: `${height}px`, minHeight: `${MIN_HEIGHT}px` }}
      >
        <textarea
          id="json-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-full p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 ${
            isValid
              ? 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              : 'border-red-500 focus:ring-red-500'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          placeholder="Enter your JSON data here..."
          spellCheck={false}
        />
        {!isValid && errorMessage && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded px-2 py-1">
            <p className="text-xs text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
        )}
        {/* Resize handle */}
        <div
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          className={`absolute bottom-0 left-0 right-0 h-2 cursor-row-resize hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors ${
            isResizing ? 'bg-blue-400 dark:bg-blue-600' : 'bg-transparent'
          }`}
          style={{ cursor: 'row-resize' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-gray-400 dark:bg-gray-500 rounded"></div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {value.length} characters
      </div>
    </div>
  );
}
