import { LoanStatus } from "../enums";
import type { BaseModel } from "./base-model-type";

export interface ILoanAccount extends BaseModel {
  user_id: string;
  application_id: string;
  cluster_id:string;

  disbursed_amount: number,
  status: LoanStatus;
  repaid_amount: number;
  daily_repayment_amount: number;
  total_repayment_amount: number;
  approved_at: string;
}
