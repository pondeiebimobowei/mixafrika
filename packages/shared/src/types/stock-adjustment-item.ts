import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IStockAdjustmentItem extends BaseModel, SyncableModel {
  quantity: number,

  
  adjustment_id: string;
  product_id: string,
}
