import { GreetingService } from "../service/greeting-service";
import { Greeting } from "../model/greeting";

export class GreetingController {
  static async getGreeting(name: string): Promise<Greeting> {
    const message = GreetingService.generateGreeting(name);
    return { message };
  }
}