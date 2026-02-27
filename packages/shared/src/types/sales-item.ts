import { BaseModel, SyncableModel } from "./base-model-type";

export interface ISalesItem extends BaseModel, SyncableModel {
    quantity: number;
    unit_price: number;
    total: number;
    sale_id: string;
    product_id: string;
}