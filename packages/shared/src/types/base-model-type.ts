import { syncStatus } from "../enums";

export interface BaseModel {
    id?: string,
    
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}


export interface SyncableModel {
    syncStatus: syncStatus;
    syncDate: string;
}