import type { BaseModel } from "./base-model-type";

export interface IWallet extends BaseModel {
  user_id: string;
  amount: number;
  total_portfolio: number;
}
