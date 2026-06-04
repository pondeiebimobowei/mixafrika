import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IStockTransfer extends BaseModel, SyncableModel {
  
    reason: string,
    status: string,
    created_by_id: string
    
    from_branch_id: string,
    to_branch_id: string,
}
