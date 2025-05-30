import { config } from "../config/database";

export class GreetingService {
  static generateGreeting(name: string): string {
    return `${config.defaultGreeting} ${name}!`;
  }
}