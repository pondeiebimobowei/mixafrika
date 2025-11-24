import { SavingsType } from "../enums";
import { BaseModel } from "./base-model-type";

export interface ISaving extends BaseModel {
  user_id: string;
  name: string;
  type: SavingsType;
  total_amount: number;
  maturity_date: Date | null;
  auto_save: boolean;
  is_locked: boolean;
  source: string;
  target_amount: number;
  interest_rate: number;
  frequency: string;
}
