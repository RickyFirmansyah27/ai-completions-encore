import Groq from 'groq-sdk';
import { ChatCompletionRequest, ChatCompletionResponse } from '../model/chat';
import { Logger } from '../utils';

export class ChatService {
  private static getGroqClient(): Groq {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required');
    }
    return new Groq({ apiKey });
  }

  static async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      Logger.info(`Chat Service | Creating chat completion with model: ${request.model || 'llama3-8b-8192'}`);
      
      const groq = this.getGroqClient();
      const completion = await groq.chat.completions.create({
        messages: request.messages,
        model: request.model || 'openai/gpt-oss-120b',
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 4000,
        stream: false,
      });

      Logger.info(`Chat Service | Chat completion created successfully`);
      return completion as ChatCompletionResponse;
    } catch (error) {
      Logger.error(`Chat Service | Error creating chat completion: ${(error as Error).message}`);
      throw error;
    }
  }
}