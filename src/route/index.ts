import { api } from "encore.dev/api";
import { GreetingController } from "../controller/greeting-controller";
import { Greeting } from "../model/greeting";

export const get = api(
  { expose: true, method: "GET", path: "/hello/:name" },
  async ({ name }: { name: string }): Promise<Greeting> => {
    return await GreetingController.getGreeting(name);
  }
);