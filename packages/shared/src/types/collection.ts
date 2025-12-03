import { BaseModel } from "./base-model-type";

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
