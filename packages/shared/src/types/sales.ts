import { SalesStatus } from "@shared/enums";
import { BaseModel, SyncableModel } from "./base-model-type";

export interface ISales extends BaseModel, SyncableModel {
    branch_id: string;
    customer_id: string;
    total_amount: string;
    payment_method: string;
    status: SalesStatus;
    created_by_id: string;
}