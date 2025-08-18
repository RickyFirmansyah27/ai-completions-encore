import { ChatCompletionRequest, ChatCompletionResponse } from '../model/chat';
import { ProviderFactory } from '../providers/provider-factory';
import { Logger } from '../utils/logger';
import { AppConfig } from '../config/app-config';

 
export class ChatService {
  private static providerFactory = ProviderFactory.getInstance();

  static async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      Logger.info(`ChatService | Creating chat completion with model: ${request.model || AppConfig.API.DEFAULT_MODEL}`);
      
      // Normalize messages to handle string inputs
      const normalizedRequest = this.normalizeMessages(request);
      
      const provider = this.providerFactory.createProvider(request.provider);
      const completion = await provider.createCompletion(normalizedRequest);

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
      
      // Normalize messages to handle string inputs
      const normalizedRequest = this.normalizeMessages(request);
      
      const provider = this.providerFactory.createProvider(request.provider);
      const response = await provider.createStreamingCompletion(normalizedRequest);

      Logger.info(`ChatService | Streaming chat completion finished`);
      return response;
    } catch (error) {
      Logger.error(`ChatService | Error creating streaming chat completion: ${(error as Error).message}`);
      throw error;
    }
  }

  private static normalizeMessages(request: ChatCompletionRequest): ChatCompletionRequest {
    return {
      ...request,
      messages: request.messages.map(message =>
        typeof message === 'string'
          ? { role: AppConfig.API.DEFAULT_ROLE, content: message }
          : message
      )
    };
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