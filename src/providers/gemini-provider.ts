import OpenAI from 'openai';
import { IAIProvider } from './ai-provider.interface';
import { ChatCompletionRequest, ChatCompletionResponse, MessageContent } from '../model/chat';
import { AppConfig } from '../config/app-config';
import { Logger } from '../utils/logger';

export class GeminiProvider implements IAIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: AppConfig.API.GEMINI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      defaultHeaders: {
        'HTTP-Referer': 'https://imaginary.site', // Replace with your actual app URL
        'X-Title': 'Imaginary AI', // Replace with your actual app name
      },
    });
  }

  async createCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: MessageContent[] }): Promise<ChatCompletionResponse> {
    try {
      Logger.info(`${this.getProviderName()} | Creating completion with model: ${request.model || 'gemini-2.5-pro'}`);
      
      const completion = await this.client.chat.completions.create({
        messages: this.formatMessages(request.messages),
        model: request.model || 'gemini-2.5-pro',
        temperature: request.temperature || AppConfig.API.DEFAULT_TEMPERATURE,
        max_tokens: request.max_tokens || AppConfig.API.DEFAULT_MAX_TOKENS,
        stream: request.stream,
      });

      Logger.info(`${this.getProviderName()} | Completion created successfully`);
      return completion as ChatCompletionResponse;
    } catch (error) {
      Logger.error(`${this.getProviderName()} | Error creating completion: ${(error as Error).message}`);
      throw this.handleError(error);
    }
  }

  async createStreamingCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: MessageContent[] }): Promise<string> {
    try {
      Logger.info(`${this.getProviderName()} | Creating streaming completion`);
      
      const stream = await this.client.chat.completions.create({
        messages: this.formatMessages(request.messages),
        model: request.model || 'gemini-2.5-pro',
        temperature: request.temperature || AppConfig.API.DEFAULT_TEMPERATURE,
        max_tokens: request.max_tokens || AppConfig.API.DEFAULT_MAX_TOKENS,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
      }

      Logger.info(`${this.getProviderName()} | Streaming completion finished`);
      return fullResponse;
    } catch (error) {
      Logger.error(`${this.getProviderName()} | Error creating streaming completion: ${(error as Error).message}`);
      throw this.handleError(error);
    }
  }

  async createStreamingResponse(
    request: Omit<ChatCompletionRequest, 'prompt'> & { messages: MessageContent[] },
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      Logger.info(`${this.getProviderName()} | Creating streaming response`);
      
      const stream = await this.client.chat.completions.create({
        messages: this.formatMessages(request.messages),
        model: request.model || 'gemini-2.5-pro',
        temperature: request.temperature || AppConfig.API.DEFAULT_TEMPERATURE,
        max_tokens: request.max_tokens || AppConfig.API.DEFAULT_MAX_TOKENS,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          onChunk(content);
        }
      }

      Logger.info(`${this.getProviderName()} | Streaming response finished`);
    } catch (error) {
      Logger.error(`${this.getProviderName()} | Error creating streaming response: ${(error as Error).message}`);
      throw this.handleError(error);
    }
  }

  validateConfig(): boolean {
    return !!AppConfig.API.GEMINI_API_KEY;
  }

  getProviderName(): string {
    return 'GeminiProvider';
  }

  private formatMessages(messages: MessageContent[]): { role: 'system' | 'user' | 'assistant'; content: string }[] {
    return messages.map(message => {
      if (typeof message === 'string') {
        return { role: 'user' as const, content: message };
      }
      return message;
    });
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return new Error(AppConfig.ERRORS.UNAUTHORIZED);
      }
      if (error.message.includes('rate limit')) {
        return new Error(AppConfig.ERRORS.RATE_LIMIT);
      }
      if (error.message.includes('quota')) {
        return new Error(AppConfig.ERRORS.QUOTA_EXCEEDED);
      }
    }
    return error as Error;
  }
}