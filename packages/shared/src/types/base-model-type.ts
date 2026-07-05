import type { SyncStatus } from "../enums";

export interface BaseModel {
    id?: string,
    
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}


export interface SyncableModel {
    sync_status: SyncStatus;
    sync_date?: string;
}
