import { GreetingService } from "../service/greeting-service";
import { Greeting } from "../model/greeting";
import { BaseResponse, Logger } from "../utils";
import userService from "../service/user-service";

export class GreetingController {
  static async getGreeting(name: string) {
    const message = GreetingService.generateGreeting(name);
    Logger.info(`Greeting generated for ${name}: ${message}`);
    const result = {
      greeting: message,
      for: name,
    }
    return BaseResponse('Greeting fetched successfully', 'success',  result );
  }

  static async getUsersHandler() {
    try {
      const users = await userService.getAllUsers();
      Logger.info(`Get User Controller | users: ${JSON.stringify(users)}`);
      return BaseResponse('User fetched successfully', 'success', { users: users });
    } catch (error) {
      Logger.error(`Get User Controller | getUser | error: ${(error as Error).message}`);
      return BaseResponse('Failed to fetch users', 'internalServerError');
    }
  }
}
