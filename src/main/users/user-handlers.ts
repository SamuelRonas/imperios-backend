import { createUserSchema } from "./types";
import { userService } from "./user-service";


export const createUser = async (event: any) => {
  const body = JSON.parse(event.body);

  const input = createUserSchema.parse(body);

  const user = await userService.createUser(input);
  return {
    statusCode: 201,
    body: JSON.stringify(user),
  };
};

export const listUsers = async () => {
  const users = await userService.listUsers();
  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
};
