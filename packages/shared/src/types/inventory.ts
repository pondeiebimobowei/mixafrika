import { BaseModel, SyncableModel } from "./base-model-type";

export interface IInventory extends BaseModel, SyncableModel {
    quantity: number;
    product_id: string;
    branch_id: string;
    batch_id?: string;
}