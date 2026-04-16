import { type VerificationStatus } from "../enums";
import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IBusinessVerification extends BaseModel, SyncableModel {
  
  type: string,
  doc_number?: string,
  doc_url: string,
  status: VerificationStatus;
  rejection_reason: string;
  reviewed_at: string;
  
  
  business_id: string;
  submitted_by: string
  reviewed_by: string;
}