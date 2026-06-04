export type SyncEntity =
  | 'global_products'
  | 'products'
  | 'inventory'
  | 'batches'
  | 'stock_movements'
  | 'customers'
  | 'sales'
  | 'sales_items'
  | 'payments'
  | 'stock_transfers'
  | 'stock_transfer_items';

export type SyncAction = 'upsert' | 'delete';

export interface SyncMutation {
  entity: SyncEntity;
  action?: SyncAction;
  localId?: string;
  local_id?: string;
  data: Record<string, unknown>;
}

export interface SyncRequest {
  cursor?: string;
  mutations?: SyncMutation[];
}

export interface SyncAck {
  entity: SyncEntity;
  localId: string;
  serverId: string;
  status: 'completed';
  serverUpdatedAt?: string;
}

export interface SyncConflict {
  entity: SyncEntity;
  localId: string;
  reason: string;
  serverRecord?: Record<string, unknown>;
}

export interface SyncFailure {
  entity: SyncEntity;
  localId: string;
  reason: string;
}

export type SyncChanges = Record<SyncEntity, Record<string, unknown>[]>;
