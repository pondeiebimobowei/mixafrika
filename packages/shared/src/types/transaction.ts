import { Status, Types } from "../enums";
import { type BaseModel } from "./base-model-type";

export interface ITransaction extends BaseModel {
  user_id: string;
  type: Types;
  status: Status;
  title: string;
  amount: number;
  category: string;
}
