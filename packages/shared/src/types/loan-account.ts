import { BaseModel } from "./base-model-type";

export interface ILoanAccount extends BaseModel {
  user_id: string;
  recieved_amount: number;
  repaid_amount: number;
  repayment_amount: number;
  interest_rate: number;
  duration: number;
}
