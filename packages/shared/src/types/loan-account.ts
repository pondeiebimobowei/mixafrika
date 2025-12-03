import { LoanStatus } from "../enums";
import type { BaseModel } from "./base-model-type";

export interface ILoanAccount extends BaseModel {
  user_id: string;
  application_id: string;
  cluster_id:string;

  disbursed_amount: number,
  status: LoanStatus;
  repaid_amount: number;
  repayment_amount: number;
  approvedAt: string;
}
