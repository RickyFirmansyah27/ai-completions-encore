import { ChatCompletionRequest, ChatCompletionResponse } from '../model/chat';
import { ProviderFactory } from '../providers/provider-factory';
import { Logger } from '../utils/logger';
import { AppConfig } from '../config/app-config';

 
export class ChatService {
  private static providerFactory = ProviderFactory.getInstance();

  static async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      Logger.info(`ChatService | Creating chat completion with model: ${request.model || AppConfig.API.DEFAULT_MODEL}`);
      
      const provider = this.providerFactory.getProvider();
      const completion = await provider.createCompletion(request);

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
      
      const provider = this.providerFactory.getProvider();
      const response = await provider.createStreamingCompletion(request);

      Logger.info(`ChatService | Streaming chat completion finished`);
      return response;
    } catch (error) {
      Logger.error(`ChatService | Error creating streaming chat completion: ${(error as Error).message}`);
      throw error;
    }
  }


}