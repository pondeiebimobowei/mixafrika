import type { BaseModel } from "./base-model-type";

export interface IWallet extends BaseModel {
  user_id: string;
  available_balance: number;
  active_investment_principal: number;
  total_portfolio: number;
}
