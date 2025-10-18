
import { Types } from "../enums";
import { BaseModel } from "./base-model-type";

export interface ISavingsHistory extends BaseModel{
  savings_id: string;
  amount: number;
  type: Types
}
