import { LoanStatus } from "../enums";
import type { BaseModel } from "./base-model-type";
import { type ICluster } from "./cluster";
import { type IFundingApplication } from "./funding-application";

export interface ILoanAccount extends BaseModel {
  user_id: string;
  application_id: string;
  cluster_id:string;

  transaction_id: string;

  disbursed_amount: number,
  status: LoanStatus;
  repaid_amount: number;
  daily_repayment_amount: number;
  total_repayment_amount: number;
  approved_at: string;
}

export interface ILoanAccountWithCluster extends ILoanAccount {
  cluster: ICluster
}

export interface ILoanAccountWithClusterAndApplication extends ILoanAccountWithCluster {
  application: IFundingApplication
}
