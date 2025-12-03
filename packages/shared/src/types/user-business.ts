import { type BaseModel } from "./base-model-type";

export interface IUserBusiness extends BaseModel {
  user_id: string;
  name: string;
  type: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
}