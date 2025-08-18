import { IAIProvider } from './ai-provider.interface';
import { GroqProvider } from './groq-provider';
import { OpenRouterProvider } from './openrouter-provider';
import { GeminiProvider } from './gemini-provider';
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

    

    
  setProvider(provider: IAIProvider): void {
    Logger.info(`ProviderFactory | Switching to provider: ${provider.getProviderName()}`);
    this.currentProvider = provider;
  }

    
  createProvider(providerName?: string): IAIProvider {
    if (!providerName) {
      return this.createGroqProvider();
    }

    switch (providerName.toLowerCase()) {
      case 'groq':
        return this.createGroqProvider();
      case 'openrouter':
        return this.createOpenRouterProvider();
      case 'gemini':
        return this.createGeminiProvider();
      default:
        Logger.warn(`Unsupported provider: ${providerName}. Defaulting to Groq.`);
        return this.createGroqProvider();
    }
  }

    
  private createGroqProvider(): IAIProvider {
    const provider = new GroqProvider();
    
    if (!provider.validateConfig()) {
      throw new Error('Groq provider configuration is invalid');
    }
    
    Logger.info(`ProviderFactory | Created provider: ${provider.getProviderName()}`);
    return provider;
  }

    
  private createOpenRouterProvider(): IAIProvider {
    const provider = new OpenRouterProvider();
    
    if (!provider.validateConfig()) {
      throw new Error('OpenRouter provider configuration is invalid');
    }
    
    Logger.info(`ProviderFactory | Created provider: ${provider.getProviderName()}`);
    return provider;
  }

    
  private createGeminiProvider(): IAIProvider {
    const provider = new GeminiProvider();
    
    if (!provider.validateConfig()) {
      throw new Error('Gemini provider configuration is invalid');
    }
    
    Logger.info(`ProviderFactory | Created provider: ${provider.getProviderName()}`);
    return provider;
  }

    
  validateCurrentProvider(): boolean {
    const provider = this.createProvider();
    return provider.validateConfig();
  }

    
  getAvailableProviders(): string[] {
    return ['groq', 'openrouter', 'gemini'];
  }
}