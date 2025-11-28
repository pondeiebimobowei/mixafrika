import { BaseModel } from "./base-model-type";

export interface IFundingApplication extends BaseModel {
  user_id: string;
  cluster_id: string | null;
  business_type: string;
  business_location: string;
  amount: number;
  duration: string;
  repayment_plan: string;
  purpose: string;
  statement_of_account_doc: string | null;

}