import { ChatCompletionRequest, ChatCompletionResponse, ChatMessage } from '../model/chat';

export interface IAIProvider {
  createCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: ChatMessage[] }): Promise<ChatCompletionResponse>;
  createStreamingCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: ChatMessage[] }): Promise<string>;
  validateConfig(): boolean;
  getProviderName(): string;
}