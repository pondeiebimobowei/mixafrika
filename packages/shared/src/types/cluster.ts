import { BaseModel } from "./base-model-type";

export interface ICluster extends BaseModel {
  name: string;
  category: string;
  cover_image: string;
  roi: number;
  repayment: string;
  is_active: boolean;
  description: string;
}
