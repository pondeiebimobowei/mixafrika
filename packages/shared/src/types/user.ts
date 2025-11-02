
import { type Roles } from "../enums/index";
import { type BaseModel } from "./base-model-type";
import { type ITrader } from "./trader";
import { type ITransaction } from "./transaction";
import { type IUserBusiness } from "./user-business";

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
  
  trader?: ITrader,
}

export interface IuserWithBusiness extends IUser {
  business: IUserBusiness
}

export interface IuserWithBusinessWithTransactions extends IUser {
  business: IUserBusiness,
  transactions: ITransaction[]
}

export interface IuserWithTransactions extends Partial<IUser> {
  transactions: ITransaction[]
}


