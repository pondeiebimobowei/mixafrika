import { LoanStatus } from "../enums";
import { BaseModel } from "./base-model-type";

export interface ILoanHistory extends BaseModel {
  user_id: string;
  amount: number;
  status: LoanStatus
  cluster: string;
}
