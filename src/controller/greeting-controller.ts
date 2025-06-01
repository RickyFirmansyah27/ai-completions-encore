import { GreetingService } from "../service/greeting-service";
import { Greeting } from "../model/greeting";
import { BaseResponse, Logger } from "../utils";
import userService from "../service/user-service";
import { User, UserList } from "../model/user";

export class GreetingController {
  static async getGreeting(name: string) {
    const message = GreetingService.generateGreeting(name);
    Logger.info(`Greeting generated for ${name}: ${message}`);
    const greeting: Greeting = { message };
    return BaseResponse("Greeting fetched successfully", "success", greeting);
  }

  static async getUsersHandler() {
    try {
      const users: User[] = await userService.getAllUsers();
      Logger.info(`Get User Controller | users: ${JSON.stringify(users)}`);

      if (users.length === 0) {
        Logger.warn("Get User Controller | No users found");
        return BaseResponse("No users found", "notFound", { users: [] });
      }

      return BaseResponse('User fetched successfully', 'success', { users: users });
    } catch (error) {
      Logger.error(`Get User Controller | getUser | error: ${(error as Error).message}`);
      return BaseResponse('Failed to fetch users', 'internalServerError');
    }
  }
}
