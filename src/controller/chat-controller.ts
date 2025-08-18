import { ChatService } from '../service/chat-service';
import { ChatCompletionRequest } from '../model/chat';
import { BaseResponse, Logger } from '../utils';

export class ChatController {
  static async createChatCompletion(request: ChatCompletionRequest) {
    try {
      Logger.info(`Chat Controller | Processing chat completion request`);
      
      // Validasi input
      if (!request.messages || request.messages.length === 0) {
        Logger.warn('Chat Controller | No messages provided');
        return BaseResponse('Messages are required', 'badRequest');
      }

      // Validasi format messages
      for (const message of request.messages) {
        if (!message.role || !message.content) {
          Logger.warn('Chat Controller | Invalid message format');
          return BaseResponse('Each message must have role and content', 'badRequest');
        }
        
        if (!['system', 'user', 'assistant'].includes(message.role)) {
          Logger.warn(`Chat Controller | Invalid role: ${message.role}`);
          return BaseResponse('Invalid message role. Must be system, user, or assistant', 'badRequest');
        }
      }

      if (request.stream) {
        Logger.info('Chat Controller | Processing streaming request');
        const streamResponse = await ChatService.createStreamingCompletion(request);
    
        
        Logger.info(`Chat Controller | Streaming completion successful`);
        return BaseResponse('Streaming chat completion created successfully', 'success', streamResponse);
      }

      const completion = await ChatService.createChatCompletion(request);
      
      Logger.info(`Chat Controller | Chat completion successful`);
      return BaseResponse('Chat completion created successfully', 'success', completion);
      
    } catch (error) {
      Logger.error(`Chat Controller | Error: ${(error as Error).message}`);
      
      // Handle specific Groq API errors
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return BaseResponse('Invalid or missing API key', 'unauthorized');
        }
        if (error.message.includes('rate limit')) {
          return BaseResponse('Rate limit exceeded', 'tooManyRequests');
        }
        if (error.message.includes('quota')) {
          return BaseResponse('API quota exceeded', 'paymentRequired');
        }
      }
      
      return BaseResponse('Failed to create chat completion', 'internalServerError');
    }
  }
}