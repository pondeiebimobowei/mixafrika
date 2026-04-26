import { SyncableModel, type BaseModel } from "./base-model-type";

export interface IInvites extends BaseModel, SyncableModel {
  email: string;
  role: string;
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  branch_id?: string;
  business_id: string;
  invited_by: string;
  expires_at: string;
}
