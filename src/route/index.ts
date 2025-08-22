import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { ChatController } from "../controller/chat-controller";
import { ChatCompletionRequest } from "../model/chat";
import { ResponseData } from "../utils/base-response";
import { Logger } from "../utils/logger";
import { AppConfig } from "../config/app-config";

const GROQ = secret("GROQ_API_KEY");
const OPENROUTER = secret("OPENROUTER_API_KEY");
const GEMINI = secret("GEMINI_API_KEY");
const ATLASCLOUD = secret("ATLASCLOUD_API_KEY");
const CHUTES = secret("CHUTES_API_KEY");

// Set API keys in AppConfig after loading secrets
AppConfig.setApiKeys({
  GROQ_API_KEY: GROQ(),
  OPENROUTER_API_KEY: OPENROUTER(),
  GEMINI_API_KEY: GEMINI(),
  CHUTES_API_KEY: CHUTES(),
  ATLASCLOUD_API_KEY: ATLASCLOUD(),
});

export const chatCompletion = api(
  {
    expose: true,
    method: "POST",
    path: "/v1/chat/completion"
  },
  async (request: ChatCompletionRequest): Promise<ResponseData> => {
    // For now, handle only non-streaming requests
    // Streaming support will be added in a future update
    Logger.info(`Route | GROQ API Key: ${GROQ() ? "Configured" : "Not Configured"}`);
    Logger.info(`Route | OpenRouter API Key: ${OPENROUTER() ? "Configured" : "Not Configured"}`);
    Logger.info(`Route | Gemini API Key: ${GEMINI() ? "Configured" : "Not Configured"}`);
    Logger.info(`Route | AtlasCloud API Key: ${ATLASCLOUD() ? "Configured" : "Not Configured"}`);
    Logger.info(`Route | Chutes API Key: ${CHUTES() ? "Configured" : "Not Configured"}`);
    Logger.info(`Route | Creating standard chat completion`);
    return await ChatController.createChatCompletion(request);
  }
);