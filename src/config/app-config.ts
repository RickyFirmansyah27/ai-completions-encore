import { EnvLoader } from './env-loader';

 
export class AppConfig {
  // API Configuration
  static readonly API = {
    GROQ_API_KEY: EnvLoader.get('GROQ_API_KEY'),
    DEFAULT_MODEL: EnvLoader.get('DEFAULT_MODEL', 'llama3-8b-8192'),
    DEFAULT_TEMPERATURE: parseFloat(EnvLoader.get('DEFAULT_TEMPERATURE', '0.7')),
    DEFAULT_MAX_TOKENS: parseInt(EnvLoader.get('DEFAULT_MAX_TOKENS', '4000'), 10),
  } as const;

  // Validation Rules
  static readonly VALIDATION = {
    ALLOWED_ROLES: ['system', 'user', 'assistant'] as const,
    MIN_MESSAGES: 1,
    MAX_MESSAGES: 100,
    MIN_TEMPERATURE: 0,
    MAX_TEMPERATURE: 2,
    MIN_MAX_TOKENS: 1,
    MAX_MAX_TOKENS: 8000,
  } as const;

  // Error Messages
  static readonly ERRORS = {
    MISSING_API_KEY: 'GROQ_API_KEY environment variable is required',
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
    if (!this.API.GROQ_API_KEY) {
      throw new Error(this.ERRORS.MISSING_API_KEY);
    }
  }
}