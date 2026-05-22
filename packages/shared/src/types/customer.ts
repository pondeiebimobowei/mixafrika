import { SyncableModel, type BaseModel } from "./base-model-type";

export interface ICustomer extends BaseModel, SyncableModel {
  name: string,
  phone?: string,


  branch_id: string,
}
