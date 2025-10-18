import { BaseModel } from "./base-model-type";

export interface IClusterStat extends BaseModel {
  cluster_id: string;
  roi: number;
  roiPercent: number;
}
