import type { BaseModel, SyncableModel } from "./base-model-type";

export interface IBranchUser extends BaseModel, SyncableModel {

    role: string,
    is_active: boolean,
    assigned_at?: string,

    user_id: string,
    branch_id: string
  
}
