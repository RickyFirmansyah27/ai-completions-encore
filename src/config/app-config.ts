import { EnvLoader } from './env-loader';

export class AppConfig {
  // API Configuration
  private static _apiKeys = {
    GROQ_API_KEY: '',
    OPENROUTER_API_KEY: '',
    GEMINI_API_KEY: '',
    CHUTES_API_KEY: '',
    ATLASCLOUD_API_KEY: '',
  };

  static readonly API = {
    get GROQ_API_KEY() { return AppConfig._apiKeys.GROQ_API_KEY || EnvLoader.get('GROQ_API_KEY'); },
    get OPENROUTER_API_KEY() { return AppConfig._apiKeys.OPENROUTER_API_KEY || EnvLoader.get('OPENROUTER_API_KEY'); },
    get GEMINI_API_KEY() { return AppConfig._apiKeys.GEMINI_API_KEY || EnvLoader.get('GEMINI_API_KEY'); },
    get CHUTES_API_KEY() { return AppConfig._apiKeys.CHUTES_API_KEY || EnvLoader.get('CHUTES_API_KEY'); },
    get ATLASCLOUD_API_KEY() { return AppConfig._apiKeys.ATLASCLOUD_API_KEY || EnvLoader.get('ATLASCLOUD_API_KEY'); },
    
    DEFAULT_TEMPERATURE: parseFloat(EnvLoader.get('DEFAULT_TEMPERATURE', '0.7')),
    DEFAULT_MAX_TOKENS: parseInt(EnvLoader.get('DEFAULT_MAX_TOKENS', '4000'), 10),
    DEFAULT_ROLE: 'user' as 'user' | 'assistant' | 'system',
  } as const;

  static setApiKeys(keys: {
    GROQ_API_KEY?: string;
    OPENROUTER_API_KEY?: string;
    GEMINI_API_KEY?: string;
    CHUTES_API_KEY?: string;
    ATLASCLOUD_API_KEY?: string;
  }) {
    if (keys.GROQ_API_KEY) AppConfig._apiKeys.GROQ_API_KEY = keys.GROQ_API_KEY;
    if (keys.OPENROUTER_API_KEY) AppConfig._apiKeys.OPENROUTER_API_KEY = keys.OPENROUTER_API_KEY;
    if (keys.GEMINI_API_KEY) AppConfig._apiKeys.GEMINI_API_KEY = keys.GEMINI_API_KEY;
    if (keys.CHUTES_API_KEY) AppConfig._apiKeys.CHUTES_API_KEY = keys.CHUTES_API_KEY;
    if (keys.ATLASCLOUD_API_KEY) AppConfig._apiKeys.ATLASCLOUD_API_KEY = keys.ATLASCLOUD_API_KEY;
  }

  // Validation Rules
  static readonly VALIDATION = {
    ALLOWED_ROLES: ['user', 'system', 'assistant'] as const,
    MIN_MESSAGES: 1,
    MAX_MESSAGES: 20,
    MIN_TEMPERATURE: 0,
    MAX_TEMPERATURE: 2,
    MIN_MAX_TOKENS: 1,
    MAX_MAX_TOKENS: 8000,
  } as const;

  // Error Messages
  static readonly ERRORS = {
    MISSING_API_KEY: 'Environment variable is required',
    INVALID_MESSAGES: 'Messages are required and must be an array',
    INVALID_MESSAGE_FORMAT: 'Each message must have role and content',
    INVALID_ROLE: 'Invalid message role. Must be system, user, or assistant',
    RATE_LIMIT: 'Rate limit exceeded',
    QUOTA_EXCEEDED: 'API quota exceeded',
    UNAUTHORIZED: 'Invalid or missing API key',
    INTERNAL_ERROR: 'Internal server error occurred',
  } as const;

  // Success Messages
  static readonly SUCCESS = {
    CHAT_COMPLETION: 'Chat completion created successfully',
    STREAMING_COMPLETION: 'Streaming chat completion created successfully',
  } as const;

   
  static validate(): void {
   if (!this.API.GROQ_API_KEY && !this.API.OPENROUTER_API_KEY && !this.API.GEMINI_API_KEY && !this.API.CHUTES_API_KEY && !this.API.ATLASCLOUD_API_KEY) {
     throw new Error(this.ERRORS.MISSING_API_KEY);
   }
 }
}