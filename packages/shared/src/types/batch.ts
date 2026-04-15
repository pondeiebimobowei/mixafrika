import { BaseModel, SyncableModel } from "./base-model-type";

export interface IBatch extends BaseModel, SyncableModel {
    expiry_date: string,
    batch_number: string,
    cost_price_per_unit: number,
    selling_price_per_piece: number,
    selling_price_per_bulk: number,
    initial_quantity: number,
    remaining_quantity: number,

    product_id: string,
    branch_id: string
}