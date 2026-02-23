import { BaseModel, SyncableModel } from "./base-model-type";

export interface ISalesItem extends BaseModel, SyncableModel {
    quantity: string;
    unit_price: string;
    total: string;
    sale_id: string;
    product_id: string;
}