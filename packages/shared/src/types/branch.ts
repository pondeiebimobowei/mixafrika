import { type BaseModel } from "./base-model-type";
import { type ICollection } from "./collection";
import { type SyncableModel } from "./base-model-type";

export interface IBranch extends BaseModel, SyncableModel {
  name: string;
  is_head_office: boolean;

  phone: string;
  street_address: string;
  city: string;
  state: string;
  country: string;

  business_id: string;
  collection_id?: string;

}


export interface IBranchWithCollection extends IBranch {
  collection: ICollection[]
}
