import { ChatCompletionRequest, ChatCompletionResponse, MessageContent } from '../model/chat';
import { ProviderFactory } from '../providers/provider-factory';
import { Logger } from '../utils/logger';
import { AppConfig } from '../config/app-config';

 
export class ChatService {
  private static providerFactory = ProviderFactory.getInstance();

  static async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      Logger.info(`ChatService | Creating chat completion with model: ${request.model}`);
      
      const messages: MessageContent[] = [{ role: 'user', content: request.prompt }];
      
      const provider = this.providerFactory.createProvider(request.provider);
      const { prompt, ...rest } = request;
      const completion = await provider.createCompletion({ ...rest, messages });

      Logger.info(`ChatService | Chat completion created successfully`);
      return completion;
    } catch (error) {
      Logger.error(`ChatService | Error creating chat completion: ${(error as Error).message}`);
      throw error;
    }
  }

   
  static async createStreamingCompletion(request: ChatCompletionRequest): Promise<string> {
    try {
      Logger.info(`ChatService | Creating streaming chat completion`);
      
      const messages: MessageContent[] = [{ role: 'user', content: request.prompt }];
      
      const provider = this.providerFactory.createProvider(request.provider);
      const { prompt: streamPrompt, ...streamRest } = request;
      const response = await provider.createStreamingCompletion({ ...streamRest, messages });

      Logger.info(`ChatService | Streaming chat completion finished. Response length: ${response.length}`);
      Logger.debug(`ChatService | Streaming chat completion response: "${response}"`);
      return response;
    } catch (error) {
      Logger.error(`ChatService | Error creating streaming chat completion: ${(error as Error).message}`);
      throw error;
    }
  }

  static async createStreamingResponse(
    request: ChatCompletionRequest,
    controller: any
  ): Promise<void> {
    try {
      Logger.info(`ChatService | Creating streaming response`);
      
      const messages: MessageContent[] = [{ role: 'user', content: request.prompt }];
      
      const provider = this.providerFactory.createProvider(request.provider);
      const { prompt: streamPrompt, ...streamRest } = request;
      
      await provider.createStreamingResponse({ ...streamRest, messages }, (chunk: string) => {
        const data = {
          content: chunk,
          finish_reason: null,
          usage: null
        };
        
        const encoder = new TextEncoder();
        const formattedChunk = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(formattedChunk));
      });

      // Send final chunk with finish_reason
      const finalData = {
        content: '',
        finish_reason: 'stop',
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
      
      const encoder = new TextEncoder();
      const finalChunk = `data: ${JSON.stringify(finalData)}\n\ndata: [DONE]\n\n`;
      controller.enqueue(encoder.encode(finalChunk));
      
      Logger.info(`ChatService | Streaming response finished`);
    } catch (error) {
      Logger.error(`ChatService | Error creating streaming response: ${(error as Error).message}`);
      
      // Send error to client
      const errorData = {
        content: '',
        finish_reason: 'error',
        usage: null
      };
      
      const encoder = new TextEncoder();
      const errorChunk = `data: ${JSON.stringify(errorData)}\n\ndata: [DONE]\n\n`;
      controller.enqueue(encoder.encode(errorChunk));
      
      throw error;
    }
  }

  static validateConfiguration(): boolean {
    try {
      // Validate that at least one API key is configured
      const hasApiKeys = !!(AppConfig.API.GROQ_API_KEY ||
                           AppConfig.API.OPENROUTER_API_KEY ||
                           AppConfig.API.GEMINI_API_KEY ||
                           AppConfig.API.CHUTES_API_TOKEN);
      
      if (!hasApiKeys) {
        Logger.error('ChatService | No API keys configured');
        return false;
      }

      // Validate that provider factory can create a valid provider
      const provider = this.providerFactory.createProvider();
      if (!provider) {
        Logger.error('ChatService | No valid provider available');
        return false;
      }

      // Validate provider configuration
      const isProviderValid = this.providerFactory.validateCurrentProvider();
      if (!isProviderValid) {
        Logger.error('ChatService | Provider configuration is invalid');
        return false;
      }

      Logger.info('ChatService | Configuration validation passed');
      return true;
    } catch (error) {
      Logger.error(`ChatService | Configuration validation failed: ${(error as Error).message}`);
      return false;
    }
  }
}