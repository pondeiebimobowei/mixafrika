import { BaseModel, SyncableModel } from "./base-model-type";

export interface IPayment extends BaseModel, SyncableModel {
    sale_id: string;
    amount: number;
    reference?: string;
    payment_method: string;
    status: string;
}