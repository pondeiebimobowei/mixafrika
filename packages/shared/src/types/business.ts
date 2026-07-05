import type { SyncableModel, BaseModel } from "./base-model-type";
import type { IBranch } from "./branch";

export interface IBusiness extends BaseModel, SyncableModel {
  name: string;
  type: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  is_verified: boolean;
  collection_id?: string;
  user_id?: string;
}


export interface IBusinessWithBranch extends IBusiness {
  branch: IBranch[];
}
