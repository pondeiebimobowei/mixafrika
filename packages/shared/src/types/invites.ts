import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IInvites extends BaseModel, SyncableModel {
  email: string,
  role: string,
  token: string,
  accepted: boolean,


  branch_id: string,
  business_id: string,
}
