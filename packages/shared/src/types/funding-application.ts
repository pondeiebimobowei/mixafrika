import { BaseModel } from "./base-model-type";

export interface IFundingApplication extends BaseModel {
  user_id: string;
  business_type: string;
  business_location: string;
  amount: number;
  duration: string;
  repayment_plan: string;
  purpose: string;
  business_reg_doc: string | null;
  id_doc: string | null;
  address_doc: string | null;
  statement_of_account_doc: string | null;

}