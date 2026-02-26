import { CardType } from "../enums";
import { BaseModel, SyncableModel } from "./base-model-type";

export interface IProduct extends BaseModel, SyncableModel {
    name: string;
    description: string;
    bulk_unit_name: string;
    piece_unit_name: string;
    units_per_bulk: string;
    cost_price: string;
    selling_price_per_piece: string;
    selling_price_per_bulk: string;
    category: string;
    serial_number: string;
    image_url: string;
    reviews: string;
}