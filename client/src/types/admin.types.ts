import { User } from "./user.types";

export interface Admin {
  id?: string;
  email: string;
  password: string;
  token?: string;
}

export interface AdminState {
  admin: Admin | null;
  users: User[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}
