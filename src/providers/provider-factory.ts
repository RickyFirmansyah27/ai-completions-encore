import { IAIProvider } from './ai-provider.interface';
import { GroqProvider } from './groq-provider';
import { Logger } from '../utils/logger';

 
export class ProviderFactory {
  private static instance: ProviderFactory;
  private currentProvider: IAIProvider | null = null;

  private constructor() {}

   
  static getInstance(): ProviderFactory {
    if (!ProviderFactory.instance) {
      ProviderFactory.instance = new ProviderFactory();
    }
    return ProviderFactory.instance;
  }

   
  getProvider(): IAIProvider {
    if (!this.currentProvider) {
      this.currentProvider = this.createGroqProvider();
    }
    return this.currentProvider;
  }

   
  setProvider(provider: IAIProvider): void {
    Logger.info(`ProviderFactory | Switching to provider: ${provider.getProviderName()}`);
    this.currentProvider = provider;
  }

   
  private createGroqProvider(): IAIProvider {
    const provider = new GroqProvider();
    
    if (!provider.validateConfig()) {
      throw new Error('Groq provider configuration is invalid');
    }
    
    Logger.info(`ProviderFactory | Created provider: ${provider.getProviderName()}`);
    return provider;
  }

   
  validateCurrentProvider(): boolean {
    const provider = this.getProvider();
    return provider.validateConfig();
  }
}