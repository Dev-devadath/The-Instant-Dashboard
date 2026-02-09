import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  // We don't throw here to allow the app to build/start even if only OpenAI is configured,
  // but the API route should check for the key before using it.
  console.warn('GEMINI_API_KEY is not set in environment variables');
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const geminiModels = {
  'gemini-2.5-flash': 'Gemini 2.5 Flash (Fastest)',
  'gemini-2.5-pro': 'Gemini 2.5 Pro (Balanced)',
  'gemini-3-pro-preview': 'Gemini 3 Pro (Smartest)',
};
