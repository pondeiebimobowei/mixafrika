import { BaseModel, SyncableModel } from "./base-model-type";

export interface ISalesItem extends BaseModel, SyncableModel {
    name: string,
    quantity: number;
    type: string,
    unit_price: number,
    cost_price: number,
    total: number,
    description: string,

    sale_id: string,
    product_id?: string,
    batch_id?: string,

}