import { ChatCompletionRequest, ChatMessage } from '../model/chat';
import { AppConfig } from '../config/app-config';
import { Logger } from '../utils/logger';

 
export class ChatValidator {
   
  static validate(request: ChatCompletionRequest): ValidationResult {
    try {
      // Validate messages exist and is array
      if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
        return this.createError(AppConfig.ERRORS.INVALID_MESSAGES);
      }

      // Validate messages count
      if (request.messages.length < AppConfig.VALIDATION.MIN_MESSAGES ||
          request.messages.length > AppConfig.VALIDATION.MAX_MESSAGES) {
        return this.createError(`Messages count must be between ${AppConfig.VALIDATION.MIN_MESSAGES} and ${AppConfig.VALIDATION.MAX_MESSAGES}`);
      }

      // Validate each message
      for (const [index, message] of request.messages.entries()) {
        const messageValidation = this.validateMessage(message as ChatMessage, index);
        if (!messageValidation.isValid) {
          return messageValidation;
        }
      }

      // Validate optional parameters
      if (request.temperature !== undefined) {
        if (request.temperature < AppConfig.VALIDATION.MIN_TEMPERATURE || 
            request.temperature > AppConfig.VALIDATION.MAX_TEMPERATURE) {
          return this.createError(`Temperature must be between ${AppConfig.VALIDATION.MIN_TEMPERATURE} and ${AppConfig.VALIDATION.MAX_TEMPERATURE}`);
        }
      }

      if (request.max_tokens !== undefined) {
        if (request.max_tokens < AppConfig.VALIDATION.MIN_MAX_TOKENS || 
            request.max_tokens > AppConfig.VALIDATION.MAX_MAX_TOKENS) {
          return this.createError(`Max tokens must be between ${AppConfig.VALIDATION.MIN_MAX_TOKENS} and ${AppConfig.VALIDATION.MAX_MAX_TOKENS}`);
        }
      }

      Logger.info('ChatValidator | Request validation passed');
      return this.createSuccess();
    } catch (error) {
      Logger.error(`ChatValidator | Validation error: ${(error as Error).message}`);
      return this.createError('Validation failed due to unexpected error');
    }
  }

   
  private static validateMessage(message: ChatMessage, index: number): ValidationResult {
    // Check if message has required fields
    if (!message.role || !message.content) {
      return this.createError(`Message at index ${index}: ${AppConfig.ERRORS.INVALID_MESSAGE_FORMAT}`);
    }

    // Validate role
    if (!AppConfig.VALIDATION.ALLOWED_ROLES.includes(message.role)) {
      return this.createError(`Message at index ${index}: ${AppConfig.ERRORS.INVALID_ROLE}`);
    }

    // Validate content is not empty
    if (typeof message.content !== 'string' || message.content.trim().length === 0) {
      return this.createError(`Message at index ${index}: Content cannot be empty`);
    }

    return this.createSuccess();
  }

   
  private static createSuccess(): ValidationResult {
    return { isValid: true };
  }

   
  private static createError(message: string): ValidationResult {
    return { isValid: false, error: message };
  }
}

 
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}