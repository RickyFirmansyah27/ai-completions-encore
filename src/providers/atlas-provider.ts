import { IAIProvider } from './ai-provider.interface';
import { ChatCompletionRequest, ChatCompletionResponse, ChatMessage } from '../model/chat';
import { AppConfig } from '../config/app-config';
import { Logger } from '../utils/logger';
import { EnvLoader } from '../config/env-loader';

interface AtlasRequestBody {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  systemPrompt?: string;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  repetition_penalty?: number;
}

interface AtlasResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  object: string;
  created: number;
  id: string;
}

export class AtlasProvider implements IAIProvider {
  private readonly apiUrl = 'https://api.atlascloud.ai/v1/chat/completions';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = EnvLoader.get('ATLASCLOUD_API_KEY', '');
  }

  async createCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: ChatMessage[] }): Promise<ChatCompletionResponse> {
    try {
      Logger.info(`${this.getProviderName()} | Creating completion with model: ${request.model || 'openai/gpt-oss-20b'}`);
      
      const body: AtlasRequestBody = {
        model: request.model || 'openai/gpt-oss-20b',
        messages: this.formatMessages(request.messages),
        temperature: request.temperature || 1,
        max_tokens: request.max_tokens || 81920,
        top_p: 0.9,
        top_k: 50,
        repetition_penalty: 1.1,
        systemPrompt: ''
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json() as AtlasResponse;
      
      Logger.info(`${this.getProviderName()} | Completion created successfully`);
      
      return {
        choices: data.choices.map(choice => ({
          message: {
            role: choice.message.role as 'assistant' | 'system' | 'user',
            content: choice.message.content
          },
          finish_reason: choice.finish_reason,
          index: choice.index
        })),
        usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        model: data.model,
        object: data.object,
        created: data.created,
        id: data.id
      };
    } catch (error) {
      Logger.error(`${this.getProviderName()} | Error creating completion: ${(error as Error).message}`);
      throw this.handleError(error);
    }
  }

  async createStreamingCompletion(request: Omit<ChatCompletionRequest, 'prompt'> & { messages: ChatMessage[] }): Promise<string> {
    try {
      Logger.info(`${this.getProviderName()} | Creating streaming completion`);
      
      const body: AtlasRequestBody = {
        model: request.model || 'openai/gpt-oss-20b',
        messages: this.formatMessages(request.messages),
        temperature: request.temperature || 1,
        max_tokens: request.max_tokens || 81920,
        top_p: 0.9,
        top_k: 50,
        repetition_penalty: 1.1,
        systemPrompt: ''
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response body found');
      }

      let fullResponse = '';
      const decoder = new TextDecoder();
      let buffer = '';

      // Process the response body as a stream
      for await (const chunk of response.body) {
        buffer += decoder.decode(chunk, { stream: true });
        
        // Split by newlines to handle SSE events
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6);
            
            if (data === '[DONE]') {
              Logger.info(`${this.getProviderName()} | Received [DONE] signal`);
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              // Extract content from choices[0].delta.content
              if (parsed.choices && Array.isArray(parsed.choices) && parsed.choices.length > 0) {
                const choice = parsed.choices[0];
                if (choice.delta && choice.delta.content) {
                  const content = choice.delta.content;
                  fullResponse += content;
                }
              }
            } catch (e) {
              Logger.warn(`${this.getProviderName()} | Failed to parse JSON from SSE data: ${data}`);
              // Skip invalid JSON but continue processing
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim().startsWith('data: ')) {
        const data = buffer.trim().slice(6);
        if (data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && Array.isArray(parsed.choices) && parsed.choices.length > 0) {
              const choice = parsed.choices[0];
              if (choice.delta && choice.delta.content) {
                fullResponse += choice.delta.content;
              }
            }
          } catch (e) {
            Logger.warn(`${this.getProviderName()} | Failed to parse final JSON from SSE data`);
          }
        }
      }

      Logger.info(`${this.getProviderName()} | Streaming completion finished, response length: ${fullResponse.length}`);
      return fullResponse;
    } catch (error) {
      Logger.error(`${this.getProviderName()} | Error creating streaming completion: ${(error as Error).message}`);
      throw this.handleError(error);
    }
  }

  validateConfig(): boolean {
    return !!this.apiKey;
  }

  getProviderName(): string {
    return 'AtlasProvider';
  }

  private formatMessages(messages: ChatMessage[]): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    return messages.map(message => {
      if (typeof message === 'string') {
        return { role: 'user' as const, content: message };
      }
      return {
        role: message.role || 'user',
        content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content)
      };
    });
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
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