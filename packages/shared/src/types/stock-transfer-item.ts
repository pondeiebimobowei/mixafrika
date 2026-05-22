import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IStockTransferItem extends BaseModel, SyncableModel {
  
    quantity: number,

    
    product_id: string,
    transfer_id: string,
}
