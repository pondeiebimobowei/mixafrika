import { BaseModel, SyncableModel } from "./base-model-type";

export interface IBatch extends BaseModel, SyncableModel {
    expiry_date: string,
    quantity: string,
    batch_number: string,
    product_id: string,
}