import type { BaseModel, SyncableModel } from "./base-model-type";

export interface IBusinessUser extends BaseModel, SyncableModel {
  
    role: string,
    is_active: boolean,
    has_full_access: boolean,
    joined_at?: string,

    user_id: string,
    business_id: string
}
