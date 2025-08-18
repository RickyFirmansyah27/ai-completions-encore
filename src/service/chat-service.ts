import { ChatCompletionRequest, ChatCompletionResponse, ChatMessage } from '../model/chat';
import { ProviderFactory } from '../providers/provider-factory';
import { Logger } from '../utils/logger';
import { AppConfig } from '../config/app-config';

 
export class ChatService {
  private static providerFactory = ProviderFactory.getInstance();

  static async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      Logger.info(`ChatService | Creating chat completion with model: ${request.model || AppConfig.API.DEFAULT_MODEL}`);
      
      const messages: ChatMessage[] = [{ role: 'user', content: request.prompt }];
      
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
      
      const messages: ChatMessage[] = [{ role: 'user', content: request.prompt }];
      
      const provider = this.providerFactory.createProvider(request.provider);
      const { prompt: streamPrompt, ...streamRest } = request;
      const response = await provider.createStreamingCompletion({ ...streamRest, messages });

      Logger.info(`ChatService | Streaming chat completion finished`);
      return response;
    } catch (error) {
      Logger.error(`ChatService | Error creating streaming chat completion: ${(error as Error).message}`);
      throw error;
    }
  }

  static validateConfiguration(): boolean {
    try {
      // Validate that at least one API key is configured
      const hasApiKeys = !!(AppConfig.API.GROQ_API_KEY ||
                           AppConfig.API.OPENROUTER_API_KEY ||
                           AppConfig.API.GEMINI_API_KEY);
      
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