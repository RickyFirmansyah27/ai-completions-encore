import { api } from "encore.dev/api";
import { ChatController } from "../controller/chat-controller";
import { ChatCompletionRequest } from "../model/chat";
import { ResponseData } from "../utils/base-response";

export const chatCompletion = api(
  {
    expose: true,
    method: "POST",
    path: "/v1/chat/completion"
  },
  async (request: ChatCompletionRequest): Promise<ResponseData> => {
    return await ChatController.createChatCompletion(request);
  }
);