import { VerificationStatus } from "../enums";
import { type BaseModel } from "./base-model-type";

export interface IUserVerification extends BaseModel {
  
  type: string,
  id_number: string;
  id_image_front_url: string;
  id_image_back_url?: string;
  status: VerificationStatus;
  rejection_reason: string;
  submitted_at: string,
  reviewed_at?: string;
  
  
  reviewed_by: string;
  user_id: string;
}
