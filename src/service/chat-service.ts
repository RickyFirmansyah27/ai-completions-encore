import Groq from 'groq-sdk';
import { ChatCompletionRequest } from '../model/chat';
import { Logger } from '../utils';

export class ChatService {
  private static getGroqClient(): Groq {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required');
    }
    return new Groq({ apiKey });
  }

  static async createChatCompletion(request: ChatCompletionRequest): Promise<any> {
    try {
      Logger.info(`Chat Service | Creating chat completion with model: ${request.model || 'llama3-8b-8192'}, stream: ${request.stream || false}`);
      
      const groq = this.getGroqClient();
      const completion = await groq.chat.completions.create({
        messages: request.messages,
        model: request.model || 'openai/gpt-oss-120b',
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 4000,
        stream: request.stream || false,
      });

      Logger.info(`Chat Service | Chat completion created successfully`);
      return completion;
    } catch (error) {
      Logger.error(`Chat Service | Error creating chat completion: ${(error as Error).message}`);
      throw error;
    }
  }

  static async createStreamingCompletion(request: ChatCompletionRequest): Promise<string> {
    try {
      Logger.info(`Chat Service | Creating streaming chat completion`);
      
      const groq = this.getGroqClient();
      const stream = await groq.chat.completions.create({
        messages: request.messages,
        model: request.model || 'llama3-8b-8192',
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 4000,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
      }

      Logger.info(`Chat Service | Streaming chat completion finished`);
      return fullResponse;
    } catch (error) {
      Logger.error(`Chat Service | Error creating streaming chat completion: ${(error as Error).message}`);
      throw error;
    }
  }
}