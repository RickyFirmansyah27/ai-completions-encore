import { api } from "encore.dev/api";
import { GreetingController } from "../controller/greeting-controller";
import { Greeting } from "../model/greeting";
import { ResponseData } from "../utils/base-response";

export const getGreeting = api(
  { 
    expose: true, 
    method: "GET", 
    path: "/hello/:name" 
  },
  async ({ name }: { name: string }): Promise<Greeting> => {
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