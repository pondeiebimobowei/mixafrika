import { BaseModel, SyncableModel } from "./base-model-type";

export interface IProduct extends BaseModel, SyncableModel {
    name: string;
    description: string;
    bulk_unit_name: string;
    piece_unit_name: string;
    units_per_bulk: number;
    cost_price_per_unit: number;
    selling_price_per_piece: number;
    selling_price_per_bulk: number;
    category: string;
    image_url: string;
    reviews: string;


    branch_id?: string,
    global_product_id?: string
}