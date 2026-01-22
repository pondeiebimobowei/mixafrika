import { VerificationStatus } from "../enums";
import { BaseModel } from "./base-model-type";

export interface IBusinessVerification extends BaseModel {
  business_id: string;

  status: VerificationStatus;
  rejection_reason: string;
  
  cac_document: string;

  reviewed_by_id: string;
  reviewed_at: string;
}