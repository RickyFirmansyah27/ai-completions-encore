import { ChatCompletionRequest, ChatCompletionResponse, MessageContent } from '../model/chat';

export interface IAIProvider {
  createCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: MessageContent[] }): Promise<ChatCompletionResponse>;
  createStreamingCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: MessageContent[] }): Promise<string>;
  createStreamingResponse(
    request: Omit<ChatCompletionRequest, 'prompt'> & { messages: MessageContent[] },
    onChunk: (chunk: string) => void
  ): Promise<void>;
  validateConfig(): boolean;
  getProviderName(): string;
}