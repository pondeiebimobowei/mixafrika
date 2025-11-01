import { type BaseModel } from "./base-model-type";

export interface IUserBusiness extends BaseModel {
  user_id: string;
  name: string;
  type: string;
  phone: string;
  address: string;
}