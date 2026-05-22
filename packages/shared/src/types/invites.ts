import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IInvites extends BaseModel, SyncableModel {
  email: string;
  role: string;
  token: string;
  accepted: boolean;
  expires_at: string;
  
  
  business_id: string;
  branch_id?: string;
  invited_by: string;
}
