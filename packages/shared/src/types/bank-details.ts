import type { BaseModel, SyncableModel } from "./base-model-type";

export interface IBankDetails extends BaseModel, SyncableModel {
  branchId: string,
  bank_name: string,
  account_name: string,
  account_number: string,
}
