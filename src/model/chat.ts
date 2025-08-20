export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type MessageContent = string | ChatMessage;

export interface ChatCompletionRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  provider?: 'groq' | 'openrouter' | 'gemini' | 'atlas';
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}