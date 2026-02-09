export type ModelProvider = 'openai' | 'gemini';

export interface GenerateRequest {
  jsonData: unknown;
  userPrompt: string;
  provider: ModelProvider;
  model: string;
}

export interface GenerateResponse {
  html: string;
  error?: string;
}

export interface DashboardState {
  jsonInput: string;
  promptInput: string;
  generatedHtml: string | null;
  isLoading: boolean;
  error: string | null;
  provider: ModelProvider;
  model: string;
}
