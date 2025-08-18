import { ChatCompletionRequest, ChatCompletionResponse } from '../model/chat';

 
export interface IAIProvider {
  createCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  createStreamingCompletion(request: ChatCompletionRequest): Promise<string>;
  validateConfig(): boolean;
  getProviderName(): string;
}