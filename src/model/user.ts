export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserList {
  users: User[];
}