import { LoanStatus } from "../enums";
import type { BaseModel } from "./base-model-type";

export interface ILoanAccount extends BaseModel {
  user_id: string;
  received_amount: number;
  status: LoanStatus;
  repaid_amount: number;
  repayment_amount: number;
  interest_rate: number;
  duration: number;
  approvedAt: string;
}
