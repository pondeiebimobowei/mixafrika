import { BaseModel, SyncableModel } from "./base-model-type";

export interface IInventory extends BaseModel, SyncableModel {
    quantity: string;
    product_id: string;
    business_id: string;
    batch_id: string;
}