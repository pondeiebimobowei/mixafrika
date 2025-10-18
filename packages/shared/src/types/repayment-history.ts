import { PaymentStatus } from "../enums";
import { BaseModel } from "./base-model-type";

export interface IRepaymentHistory extends BaseModel {
  loan_account_id: string;
  amount: number;
  status: PaymentStatus
}
