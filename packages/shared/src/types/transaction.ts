import { Types } from "../enums";
import { BaseModel } from "./base-model-type";

export interface ITransaction extends BaseModel {
  user_id: string;
  type: Types;
  title: string;
  amount: number;
  category: string;
}
