import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IStockAdjustment extends BaseModel, SyncableModel {
  reason: string,

  
  branch_id: string,
  created_by: string,
}
