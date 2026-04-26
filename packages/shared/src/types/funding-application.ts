import { type BaseModel } from "./base-model-type";

export interface IFundingApplication extends BaseModel {
  user_id: string;
  business_id: string;
  cluster_id: string | null;
  amount: number;
  allocated_amount: number;
  duration: number;
  repayment_plan: string;
  approved_at: string | null;
  purpose: string;
  statement_of_account_doc: string | null;
}