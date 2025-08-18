import { api } from "encore.dev/api";
import { GreetingController } from "../controller/greeting-controller";
import { ChatController } from "../controller/chat-controller";
import { Greeting } from "../model/greeting";
import { ChatCompletionRequest } from "../model/chat";
import { ResponseData } from "../utils/base-response";

export const getGreeting = api(
  { 
    expose: true, 
    method: "GET", 
    path: "/hello/:name" 
  },
  async ({ name }: { name: string }) : Promise<ResponseData> => {
    return await GreetingController.getGreeting(name);
  }
);


export const getUser = api(
  { 
    expose: true, 
    method: "GET", 
    path: "/users" 
  },
  async (): Promise<ResponseData> => {
    return await GreetingController.getUsersHandler();
  }
);

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