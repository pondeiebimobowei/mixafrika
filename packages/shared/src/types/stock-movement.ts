import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IStockMovement extends BaseModel, SyncableModel {
  
    type: string,
    quantity: number,
    reference_id?: string,
    note?: string,


    product_id: string,
    branch_id: string,
    batch_id?: string,
    created_by_id?: string
}
