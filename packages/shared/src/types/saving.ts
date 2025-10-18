import { BaseModel } from "./base-model-type";

export interface ISaving extends BaseModel {
  user_id: string;
  total_amount: number;
  maturity_date: Date;
  auto_save: boolean;
  daily_auto_save: boolean;
  source: string;
}
