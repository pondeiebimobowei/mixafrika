
import { type Roles } from "../enums/index";
import { type BaseModel } from "./base-model-type";
import { type IBusinessVerification } from "./business-verification";
import { type ITrader } from "./trader";
import { type ITransaction } from "./transaction";
import { type IBusiness } from "./business";
import { type IUserVerification } from "./user-verification";

export interface IUser extends BaseModel {
  user_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Roles;
  is_email_verified: boolean;
  is_verified: boolean;
  avatar?: string;
  
  credit_score: number;
  credit_score_status: string;

}

export interface IuserWithBusiness extends IUser {
  business: IBusiness[]
}

export interface IuserWithBusinessWithTransactions extends IUser {
  business: IBusiness[],
  transactions: ITransaction[]
}

export interface IuserWithTransactions extends Partial<IUser> {
  transactions: ITransaction[]
}


