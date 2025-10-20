
import { Roles } from "../enums/index";
import { BaseModel } from "./base-model-type";

export interface IUser extends BaseModel {
  image: string | null;
  user_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
  is_verified: boolean;
  is_email_verified: boolean;
  credit_score: number;
  credit_score_status: string;
}
