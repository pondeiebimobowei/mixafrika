import { CardType } from "../enums";
import { BaseModel } from "./base-model-type";

export interface IBankCard extends BaseModel {
    user_id: string;
    payment_token: string;
    last_four_digits: string;
    card_type: CardType;
    is_active: boolean;
    is_default: boolean;
}