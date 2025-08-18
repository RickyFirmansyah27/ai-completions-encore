import { AppConfig } from './config';
import { ChatService } from './service/chat-service';
import { Logger } from './utils/logger';

 
export class Application {
   
  static async initialize(): Promise<void> {
    try {
      Logger.info('Application | Starting initialization...');
      
      // Validate configuration
      AppConfig.validate();
      Logger.info('Application | Configuration validated successfully');
      
      // Validate chat service
      if (!ChatService.validateConfiguration()) {
        throw new Error('Chat service configuration is invalid');
      }
      Logger.info('Application | Chat service validated successfully');
      
      Logger.info('Application | Initialization completed successfully');
    } catch (error) {
      Logger.error(`Application | Initialization failed: ${(error as Error).message}`);
      throw error;
    }
  }

   
  static getHealthStatus(): { status: string; timestamp: string; services: Record<string, boolean> } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        chatService: ChatService.validateConfiguration(),
      }
    };
  }
}