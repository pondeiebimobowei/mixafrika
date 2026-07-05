import { type Duration } from "../enums";
import type { SyncableModel, BaseModel } from "./base-model-type";
import { type ICollection } from "./collection";

export interface ICluster extends BaseModel, SyncableModel {
  name: string;
  status: string;
  about: string;
  duration: Duration;
  roi: number;
  total_funds_raised: number;
  target_fundraising_amount: number;
  is_active: boolean;
  cover_image: string;
  start_date: string;
  end_date: string;
  description: string;
  
  collection_id: string;
}

export interface IClusterWithCollection extends ICluster {
  collection: ICollection;
}
