import { CardType } from "../enums";
import { BaseModel, SyncableModel } from "./base-model-type";

export interface IProduct extends BaseModel, SyncableModel {
    name: string;
    description: string;
    bulk_unit_name: string;
    piece_unit_name: string;
    units_per_bulk: number;
    cost_price: number;
    selling_price_per_piece: number;
    selling_price_per_bulk: number;
    category: string;
    serial_number: string;
    image_url: string;
    reviews: string;
}