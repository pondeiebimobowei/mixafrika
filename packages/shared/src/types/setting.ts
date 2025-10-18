import { BaseModel } from "./base-model-type";

export interface ISetting extends BaseModel {
  user_id: string;
  enable_dark_mode: boolean;
  enable_email_notification: boolean;
  enable_push_notification: boolean;
}
