import { api } from "encore.dev/api";
import { ChatController } from "../controller/chat-controller";
import { ChatService } from "../service/chat-service";
import { ChatCompletionRequest } from "../model/chat";
import { ResponseData } from "../utils/base-response";
import { Logger } from "../utils/logger";

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