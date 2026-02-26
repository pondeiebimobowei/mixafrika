import { type BaseModel } from "./base-model-type";
import { type ICluster } from "./cluster";

export interface ICollection extends BaseModel {
  name: string;
  description: string;
  total_traders: number;
  about: string;
  cover_image: string;
  roi:number;
  min_investment:number;
  city: string;
  state: string;
  country: string;
}

export interface ICollectionWithCluster extends ICollection {
  cluster: ICluster[]
}