import { SalesStatus } from "../enums";
import { BaseModel, SyncableModel } from "./base-model-type";

export interface ISales extends BaseModel, SyncableModel {
    customer_id?: string;
    total_amount: number;
    amount_paid: number;
    balance: number;
    payment_method: string;
    status: SalesStatus;
    note?: string;


    branch_id: string;
    created_by_id?: string;
}