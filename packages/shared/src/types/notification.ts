import { BaseModel } from "./base-model-type";

export interface INotification extends BaseModel {
  user_id: string;
  title: string;
  message: string;
  read: boolean;
}
