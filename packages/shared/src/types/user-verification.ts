import { VerificationStatus } from "../enums";
import { BaseModel } from "./base-model-type";

export interface IUserVerification extends BaseModel {
  user_id: string;

  status: VerificationStatus;

  id_type: string;
  id_number: string;
  id_image_front: string;
  id_image_back?: string;

  rejection_reason: string;

  reviewed_by_id: string;
  reviewed_at: string;
}
