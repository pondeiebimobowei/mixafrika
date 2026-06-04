import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:spine/data/repositories/sync/sync_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/sync/sync_api_service.dart';
import 'package:spine/data/services/api/sync/sync_models.dart';
import 'package:spine/drift/database.dart';

import '../constants.dart';
import '../inventory/inventory_test_factory.dart';

class FakeSyncApiService extends SyncApiService {
  FakeSyncApiService(this.handler);

  final Future<ApiResponse<SyncPayload>> Function({
    String? cursor,
    required List<SyncMutation> mutations,
  }) handler;

  List<SyncMutation> capturedMutations = [];

  @override
  Future<ApiResponse<SyncPayload>> runSync({
    String? cursor,
    required List<SyncMutation> mutations,
  }) async {
    capturedMutations = mutations;
    return handler(cursor: cursor, mutations: mutations);
  }
}

void main() {
  late AppDatabase database;

  setUp(() {
    SharedPreferences.setMockInitialValues({});
    database = AppDatabase(NativeDatabase.memory());
  });

  tearDown(() async {
    await database.close();
  });

  test('pushes pending rows and marks acknowledgements as completed', () async {
    await InventoryTestFactory.seedFullProduct(database);
    late FakeSyncApiService api;
    api = FakeSyncApiService(({cursor, required mutations}) async {
      return ApiResponse(
        success: true,
        message: 'Sync completed',
        data: SyncPayload(
          cursor: '2026-06-03T09:00:00.000Z',
          serverTime: '2026-06-03T09:00:00.000Z',
          applied: mutations
              .map(
                (mutation) => SyncAck(
                  entity: mutation.entity,
                  localId: mutation.localId,
                  serverId: mutation.localId,
                  status: 'completed',
                ),
              )
              .toList(),
          conflicts: [],
          failures: [],
          changes: const {},
        ),
      );
    });
    final repository = SyncRepository(database: database, apiService: api);

    final result = await repository.runSync();

    expect(result.success, isTrue);
    expect(api.capturedMutations.map((mutation) => mutation.entity), [
      'global_products',
      'products',
    ]);

    final globalProduct = await (database.select(database.globalProduct)
          ..where((row) => row.id.equals(Constants.globalProductId)))
        .getSingle();
    final product = await (database.select(database.product)
          ..where((row) => row.id.equals(Constants.productId)))
        .getSingle();

    expect(globalProduct.syncStatus, 'completed');
    expect(product.syncStatus, 'completed');
  });

  test('applies pulled server changes in dependency order', () async {
    await InventoryTestFactory.seedBusiness(database);
    await InventoryTestFactory.seedBranch(database);
    final api = FakeSyncApiService(({cursor, required mutations}) async {
      return ApiResponse(
        success: true,
        message: 'Sync completed',
        data: SyncPayload(
          cursor: '2026-06-03T09:00:00.000Z',
          serverTime: '2026-06-03T09:00:00.000Z',
          applied: [],
          conflicts: [],
          failures: [],
          changes: {
            'global_products': [
              {
                'id': Constants.globalProductId,
                'syncStatus': 'completed',
                'syncDate': '2026-06-03T09:00:00.000Z',
                'createdAt': '2026-06-03T08:00:00.000Z',
                'updatedAt': '2026-06-03T08:00:00.000Z',
                'deletedAt': null,
                'name': Constants.productName,
                'normalizedName': Constants.productName.toLowerCase(),
                'description': 'Server product',
                'barcode': Constants.barCode,
                'imageUrl': '',
                'productCategoryId': null,
              },
            ],
            'products': [
              {
                'id': Constants.productId,
                'syncStatus': 'completed',
                'syncDate': '2026-06-03T09:00:00.000Z',
                'createdAt': '2026-06-03T08:00:00.000Z',
                'updatedAt': '2026-06-03T08:00:00.000Z',
                'deletedAt': null,
                'name': Constants.productName,
                'description': 'Server product',
                'bulkUnitName': 'Bag',
                'pieceUnitName': 'Piece',
                'unitsPerBulk': 10,
                'costPricePerUnit': 500,
                'sellingPricePerPiece': Constants.sellingPricePerPiece,
                'sellingPricePerBulk': Constants.sellingPricePerBulk,
                'category': 'Grains',
                'imageUrl': '',
                'reviews': '',
                'branchId': Constants.testBranchId,
                'globalProductId': Constants.globalProductId,
              },
            ],
          },
        ),
      );
    });
    final repository = SyncRepository(database: database, apiService: api);

    final result = await repository.runSync();

    expect(result.success, isTrue);
    final product = await (database.select(database.product)
          ..where((row) => row.id.equals(Constants.productId)))
        .getSingle();

    expect(product.name, Constants.productName);
    expect(product.syncStatus, 'completed');
  });
}
