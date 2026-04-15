import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IStockAdjustmentItem extends BaseModel, SyncableModel {
  adjustment_id: string;
  product_id: string,
  quantity: number,
}
