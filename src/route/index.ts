import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { ChatController } from "../controller/chat-controller";
import { ChatCompletionRequest } from "../model/chat";
import { ResponseData } from "../utils/base-response";
import { Logger } from "../utils/logger";

export const GROQ = secret("GROQ_API_KEY");
export const OPENROUTER = secret("OPENROUTER_API_KEY");
export const GEMINI = secret("GEMINI_API_KEY");
export const ATLASCLOUD = secret("ATLASCLOUD_API_KEY");
export const CHUTES = secret("CHUTES_API_KEY");


export const chatCompletion = api(
  {
    expose: true,
    method: "POST",
    path: "/v1/chat/completion"
  },
  async (request: ChatCompletionRequest): Promise<ResponseData> => {
    // For now, handle only non-streaming requests
    // Streaming support will be added in a future update
    Logger.info(`Route | Creating standard chat completion`);
    return await ChatController.createChatCompletion(request);
  }
);