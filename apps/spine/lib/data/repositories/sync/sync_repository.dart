import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/sync/sync_api_service.dart';
import 'package:spine/data/services/api/sync/sync_models.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/drift/database.dart';

class SyncResult {
  SyncResult({
    required this.pendingBefore,
    required this.appliedCount,
    required this.conflictCount,
    required this.failureCount,
    required this.pulledCount,
    required this.cursor,
    required this.message,
  });

  final int pendingBefore;
  final int appliedCount;
  final int conflictCount;
  final int failureCount;
  final int pulledCount;
  final String cursor;
  final String message;
}

class SyncRepository {
  SyncRepository({
    required AppDatabase database,
    required SyncApiService apiService,
  }) : _db = database,
       _apiService = apiService;

  final AppDatabase _db;
  final SyncApiService _apiService;

  Future<int> getPendingCount() async {
    final mutations = await _collectPendingMutations();
    return mutations.length;
  }

  Future<ApiResponse<SyncResult>> runSync() async {
    final cursor = await AppPreferences.getSyncCursor();
    final mutations = await _collectPendingMutations();

    final response = await _apiService.runSync(
      cursor: cursor,
      mutations: mutations,
    );

    if (!response.success) {
      return ApiResponse(
        success: false,
        message: response.message,
        data: SyncResult(
          pendingBefore: mutations.length,
          appliedCount: 0,
          conflictCount: 0,
          failureCount: mutations.length,
          pulledCount: 0,
          cursor: cursor ?? '',
          message: response.message,
        ),
      );
    }

    final payload = response.data;

    await _db.transaction(() async {
      await _applyPulledChanges(payload.changes);

      for (final ack in payload.applied) {
        await _markRecord(
          ack.entity,
          ack.localId,
          'completed',
          payload.serverTime,
        );
      }

      for (final conflict in payload.conflicts) {
        if (conflict.serverRecord != null) {
          await _upsertServerRecord(conflict.entity, conflict.serverRecord!);
          await _markRecord(
            conflict.entity,
            conflict.localId,
            'completed',
            payload.serverTime,
          );
        } else {
          await _markRecord(conflict.entity, conflict.localId, 'failed', null);
        }
      }

      for (final failure in payload.failures) {
        await _markRecord(failure.entity, failure.localId, 'failed', null);
      }
    });

    await _ensureDefaultTenantSelection();

    if (payload.cursor.isNotEmpty) {
      await AppPreferences.saveSyncCursor(payload.cursor);
    }

    final pulledCount = payload.changes.values.fold<int>(
      0,
      (count, rows) => count + rows.length,
    );

    return ApiResponse(
      success: payload.failures.isEmpty,
      message: response.message,
      data: SyncResult(
        pendingBefore: mutations.length,
        appliedCount: payload.applied.length,
        conflictCount: payload.conflicts.length,
        failureCount: payload.failures.length,
        pulledCount: pulledCount,
        cursor: payload.cursor,
        message: response.message,
      ),
    );
  }

  Future<List<SyncMutation>> _collectPendingMutations() async {
    final mutations = <SyncMutation>[];
    const statuses = ['pending', 'failed'];

    final globalProducts = await (_db.select(
      _db.globalProduct,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      globalProducts.map(
        (row) => SyncMutation(
          entity: 'global_products',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final products = await (_db.select(
      _db.product,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      products.map(
        (row) => SyncMutation(
          entity: 'products',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final customers = await (_db.select(
      _db.customer,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      customers.map(
        (row) => SyncMutation(
          entity: 'customers',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final inventory = await (_db.select(
      _db.inventory,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      inventory.map(
        (row) => SyncMutation(
          entity: 'inventory',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final batches = await (_db.select(
      _db.spineBatch,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      batches.map(
        (row) => SyncMutation(
          entity: 'batches',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final stockMovements = await (_db.select(
      _db.stockMovement,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      stockMovements.map(
        (row) => SyncMutation(
          entity: 'stock_movements',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final sales = await (_db.select(
      _db.sales,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      sales.map(
        (row) =>
            SyncMutation(entity: 'sales', localId: row.id, data: row.toJson()),
      ),
    );

    final salesItems = await (_db.select(
      _db.salesItem,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      salesItems.map(
        (row) => SyncMutation(
          entity: 'sales_items',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final payments = await (_db.select(
      _db.payments,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      payments.map(
        (row) => SyncMutation(
          entity: 'payments',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final transfers = await (_db.select(
      _db.stockTransfer,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      transfers.map(
        (row) => SyncMutation(
          entity: 'stock_transfers',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    final transferItems = await (_db.select(
      _db.stockTransferItem,
    )..where((table) => table.syncStatus.isIn(statuses))).get();
    mutations.addAll(
      transferItems.map(
        (row) => SyncMutation(
          entity: 'stock_transfer_items',
          localId: row.id,
          data: row.toJson(),
        ),
      ),
    );

    return mutations;
  }

  Future<void> _applyPulledChanges(
    Map<String, List<Map<String, dynamic>>> changes,
  ) async {
    const order = [
      'user',
      'businesses',
      'collections',
      'business_users',
      'branches',
      'branch_users',
      'global_products',
      'products',
      'customers',
      'batches',
      'inventory',
      'stock_movements',
      'sales',
      'sales_items',
      'payments',
      'stock_transfers',
      'stock_transfer_items',
    ];

    for (final entity in order) {
      for (final row in changes[entity] ?? const <Map<String, dynamic>>[]) {
        await _upsertServerRecord(entity, row);
      }
    }
  }

  Future<void> _upsertServerRecord(String entity, Map<String, dynamic> row) {
    final normalizedRow = _normalizeServerRecord(row);

    switch (entity) {
      case 'user':
        return _db
            .into(_db.user)
            .insertOnConflictUpdate(UserData.fromJson(normalizedRow));
      case 'businesses':
        return _db
            .into(_db.businesses)
            .insertOnConflictUpdate(BusinessesData.fromJson(normalizedRow));
      case 'collections':
        return _db
            .into(_db.collection)
            .insertOnConflictUpdate(CollectionData.fromJson(normalizedRow));
      case 'business_users':
        return _db
            .into(_db.businessUser)
            .insertOnConflictUpdate(BusinessUserData.fromJson(normalizedRow));
      case 'branches':
        return _db
            .into(_db.branch)
            .insertOnConflictUpdate(BranchData.fromJson(normalizedRow));
      case 'branch_users':
        return _db
            .into(_db.branchUser)
            .insertOnConflictUpdate(BranchUserData.fromJson(normalizedRow));
      case 'global_products':
        return _db
            .into(_db.globalProduct)
            .insertOnConflictUpdate(GlobalProductData.fromJson(normalizedRow));
      case 'products':
        return _db
            .into(_db.product)
            .insertOnConflictUpdate(ProductData.fromJson(normalizedRow));
      case 'customers':
        return _db
            .into(_db.customer)
            .insertOnConflictUpdate(CustomerData.fromJson(normalizedRow));
      case 'batches':
        return _db
            .into(_db.spineBatch)
            .insertOnConflictUpdate(SpineBatchData.fromJson(normalizedRow));
      case 'inventory':
        return _db
            .into(_db.inventory)
            .insertOnConflictUpdate(InventoryData.fromJson(normalizedRow));
      case 'stock_movements':
        return _db
            .into(_db.stockMovement)
            .insertOnConflictUpdate(StockMovementData.fromJson(normalizedRow));
      case 'sales':
        return _db
            .into(_db.sales)
            .insertOnConflictUpdate(Sale.fromJson(normalizedRow));
      case 'sales_items':
        return _db
            .into(_db.salesItem)
            .insertOnConflictUpdate(SalesItemData.fromJson(normalizedRow));
      case 'payments':
        return _db
            .into(_db.payments)
            .insertOnConflictUpdate(Payment.fromJson(normalizedRow));
      case 'stock_transfers':
        return _db
            .into(_db.stockTransfer)
            .insertOnConflictUpdate(StockTransferData.fromJson(normalizedRow));
      case 'stock_transfer_items':
        return _db
            .into(_db.stockTransferItem)
            .insertOnConflictUpdate(
              StockTransferItemData.fromJson(normalizedRow),
            );
      default:
        return Future.value();
    }
  }

  Map<String, dynamic> _normalizeServerRecord(Map<String, dynamic> row) {
    const dateKeys = {
      'assignedAt',
      'createdAt',
      'deletedAt',
      'expiryDate',
      'joinedAt',
      'reviewedAt',
      'syncDate',
      'updatedAt',
    };

    return row.map((key, value) {
      if (!dateKeys.contains(key) || value == null) {
        return MapEntry(key, value);
      }

      if (value is int) {
        return MapEntry(
          key,
          DateTime.fromMillisecondsSinceEpoch(
            value,
            isUtc: true,
          ).toIso8601String(),
        );
      }

      if (value is double) {
        return MapEntry(
          key,
          DateTime.fromMillisecondsSinceEpoch(
            value.toInt(),
            isUtc: true,
          ).toIso8601String(),
        );
      }

      return MapEntry(key, value);
    });
  }

  Future<void> _markRecord(
    String entity,
    String id,
    String status,
    String? serverTime,
  ) async {
    final tableName = _tableNameForEntity(entity);
    if (tableName == null || id.isEmpty) return;
    final syncDate = serverTime == null
        ? DateTime.now()
        : DateTime.parse(serverTime);

    await _db.customUpdate(
      'UPDATE $tableName SET sync_status = ?, sync_date = ? WHERE id = ?',
      variables: [
        Variable.withString(status),
        Variable.withDateTime(syncDate),
        Variable.withString(id),
      ],
    );
  }

  String? _tableNameForEntity(String entity) {
    return const {
      'user': 'user',
      'businesses': 'businesses',
      'collections': 'collection',
      'business_users': 'business_user',
      'branches': 'branch',
      'branch_users': 'branch_user',
      'global_products': 'global_product',
      'products': 'product',
      'inventory': 'inventory',
      'batches': 'spine_batch',
      'stock_movements': 'stock_movement',
      'customers': 'customer',
      'sales': 'sales',
      'sales_items': 'sales_item',
      'payments': 'payments',
      'stock_transfers': 'stock_transfer',
      'stock_transfer_items': 'stock_transfer_item',
    }[entity];
  }

  Future<void> _ensureDefaultTenantSelection() async {
    final activeBusinessId = await AppPreferences.getActiveBusinessId();
    final activeBranchId = await AppPreferences.getActiveBranchId();

    if (activeBusinessId != null &&
        activeBusinessId.isNotEmpty &&
        activeBranchId != null &&
        activeBranchId.isNotEmpty) {
      return;
    }

    final businesses = await _db.select(_db.businesses).get();
    if (businesses.isEmpty) return;

    final selectedBusinessId = activeBusinessId?.isNotEmpty == true
        ? activeBusinessId!
        : businesses.first.id;
    if (activeBusinessId == null || activeBusinessId.isEmpty) {
      await AppPreferences.saveActiveBusinessId(selectedBusinessId);
    }

    if (activeBranchId != null && activeBranchId.isNotEmpty) return;

    final branches = await (_db.select(
      _db.branch,
    )..where((table) => table.businessId.equals(selectedBusinessId))).get();
    if (branches.isEmpty) return;

    final headOffice = branches
        .where((branch) => branch.isHeadOffice)
        .firstOrNull;
    await AppPreferences.saveActiveBranchId((headOffice ?? branches.first).id);
  }
}

final syncRepositoryProvider = Provider(
  (ref) => SyncRepository(
    database: ref.watch(databaseProvider),
    apiService: ref.watch(syncApiServiceProvider),
  ),
);
