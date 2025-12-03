import { Duration } from "../enums";
import { BaseModel } from "./base-model-type";

export interface ICluster extends BaseModel {
  collection_id:string;
  
  name: string;
  cover_image: string;
  roi: number;
  is_active: boolean;
  status: string;
  duration: Duration;
  description: string;
  about:string;
  target_fundraising_amount: number;
  total_funds_raised: number
  start_date: string;
  end_date: string;
}
