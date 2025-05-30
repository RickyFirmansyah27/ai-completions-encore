import { GreetingService } from "../service/greeting-service";
import { Greeting } from "../model/greeting";
import { User, UserList } from "../model/user";
import { BaseResponse, Logger } from "../utils";

export class GreetingController {
  static async getGreeting(name: string): Promise<Greeting> {
    const message = GreetingService.generateGreeting(name);
    return { message };
  }

  static async getUsersHandler() {
    try {
        const users = [
        { id: 1, name: "Alice", email: "alice@email.com" },
        { id: 2, name: "Bob", email: "bob@email.com" },
        { id: 3, name: "Charlie", email: "charlie@email.com" },
        { id: 4, name: "Diana", email: "diana@email.com" },
        { id: 5, name: "Eve", email: "eve@email.com" },
      ];
      Logger.info(`Get User Controller | users: ${JSON.stringify(users)}`);
      return BaseResponse('User fetched successfully', 'success', { users: users });
    } catch (error) {
      Logger.error(`Get User Controller | getUser | error: ${(error as Error).message}`);
      return BaseResponse('Failed to fetch users', 'internalServerError');
    }
  }
}
