import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IBusiness extends BaseModel, SyncableModel {
  name: string;
  type: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  is_verified: boolean;

  user_id: string,
  
}

