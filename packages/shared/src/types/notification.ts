import { NotificationType } from "../enums";
import { BaseModel } from "./base-model-type";

export interface INotification extends BaseModel {
  user_id: string;
  type: NotificationType
  title: string;
  message: string;
  read: boolean;
}
