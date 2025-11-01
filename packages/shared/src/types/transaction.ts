import { RepaymentStatus, Status, Types } from "../enums";
import { type BaseModel } from "./base-model-type";
import { type IUser } from "./user";

export interface ITransaction extends BaseModel {
  user_id: string;
  type: Types;
  status: Status | RepaymentStatus;
  title: string;
  amount: number;
  category: string;
}

export interface ITransactionWithUser extends ITransaction{
  user: Partial<IUser>
}
