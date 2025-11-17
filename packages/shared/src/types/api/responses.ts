import { IUser } from "../user";

export type loginProps = {
  token: string;
  refreshToken: string;
  user: IUser | null;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: IUser | null;
  };
};

export type LoginResponse = AuthResponse;
