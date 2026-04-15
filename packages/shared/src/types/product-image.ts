import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IProductImage extends BaseModel, SyncableModel {
  
    product_id: string,
    local_path?: string,
    remote_url?: string
}
