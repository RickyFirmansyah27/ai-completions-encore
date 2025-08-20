import { ChatService } from '../service/chat-service';
import { ChatCompletionRequest } from '../model/chat';
import { BaseResponse, Logger } from '../utils';
import { ChatValidator } from '../validators/chat-validator';
import { AppConfig } from '../config/app-config';

 
export class ChatController {
   
  static async createChatCompletion(request: ChatCompletionRequest) {
    try {
      Logger.info(`ChatController | Processing chat completion request`);
      
      // Validate request
      const validation = ChatValidator.validate(request);
      if (!validation.isValid) {
        Logger.warn(`ChatController | Validation failed: ${validation.error}`);
        return BaseResponse(validation.error!, 'badRequest');
      }

      // Handle streaming request
      if (request.stream) {
        Logger.info('ChatController | Processing streaming request');
        const streamResponse = await ChatService.createStreamingCompletion(request);
        
        Logger.info(`ChatController | Streaming completion successful. Response length: ${streamResponse.length}`);
        Logger.debug(`ChatController | Streaming completion response: "${streamResponse}"`);
        return BaseResponse(AppConfig.SUCCESS.STREAMING_COMPLETION, 'success', { content: streamResponse });
      }

      // Handle regular request
      const completion = await ChatService.createChatCompletion(request);
      
      Logger.info(`ChatController | Chat completion successful`);
      return BaseResponse(AppConfig.SUCCESS.CHAT_COMPLETION, 'success', completion);
      
    } catch (error) {
      return this.handleError(error);
    }
  }

   
  private static handleError(error: unknown) {
    const errorMessage = (error as Error).message;
    Logger.error(`ChatController | Error: ${errorMessage}`);
    
    // Handle specific errors based on message content
    if (errorMessage.includes('API key') || errorMessage === AppConfig.ERRORS.UNAUTHORIZED) {
      return BaseResponse(AppConfig.ERRORS.UNAUTHORIZED, 'unauthorized');
    }
    
    if (errorMessage.includes('rate limit') || errorMessage === AppConfig.ERRORS.RATE_LIMIT) {
      return BaseResponse(AppConfig.ERRORS.RATE_LIMIT, 'tooManyRequests');
    }
    
    if (errorMessage.includes('quota') || errorMessage === AppConfig.ERRORS.QUOTA_EXCEEDED) {
      return BaseResponse(AppConfig.ERRORS.QUOTA_EXCEEDED, 'paymentRequired');
    }
    
    // Default error response
    return BaseResponse(AppConfig.ERRORS.INTERNAL_ERROR, 'internalServerError');
  }
}