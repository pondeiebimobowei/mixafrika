import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:spine/data/repositories/sync/sync_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/sync/sync_api_service.dart';
import 'package:spine/data/services/api/sync/sync_models.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/drift/database.dart';

import '../constants.dart';
import '../inventory/inventory_test_factory.dart';

class FakeSyncApiService extends SyncApiService {
  FakeSyncApiService(this.handler);

  final Future<ApiResponse<SyncPayload>> Function({
    String? cursor,
    required List<SyncMutation> mutations,
  })
  handler;

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

    final globalProduct = await (database.select(
      database.globalProduct,
    )..where((row) => row.id.equals(Constants.globalProductId))).getSingle();
    final product = await (database.select(
      database.product,
    )..where((row) => row.id.equals(Constants.productId))).getSingle();

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
            'batches': [
              {
                'id': 'batch-1',
                'syncStatus': 'completed',
                'syncDate': '2026-06-03T09:00:00.000Z',
                'createdAt': '2026-06-03T08:00:00.000Z',
                'updatedAt': '2026-06-03T08:00:00.000Z',
                'deletedAt': null,
                'expiryDate': 1782777600000,
                'batchNumber': 'BATCH-1',
                'costPricePerUnit': 500,
                'sellingPricePerPiece': Constants.sellingPricePerPiece,
                'sellingPricePerBulk': Constants.sellingPricePerBulk,
                'initialQuantity': 20,
                'remainingQuantity': 10,
                'productId': Constants.productId,
                'branchId': Constants.testBranchId,
              },
            ],
          },
        ),
      );
    });
    final repository = SyncRepository(database: database, apiService: api);

    final result = await repository.runSync();

    expect(result.success, isTrue);
    final product = await (database.select(
      database.product,
    )..where((row) => row.id.equals(Constants.productId))).getSingle();

    expect(product.name, Constants.productName);
    expect(product.syncStatus, 'completed');
    final batch = await (database.select(
      database.spineBatch,
    )..where((row) => row.id.equals('batch-1'))).getSingle();
    expect(batch.expiryDate, DateTime.utc(2026, 6, 30));
  });

  test(
    'persists first-login tenant bootstrap rows and selects defaults',
    () async {
      final api = FakeSyncApiService(({cursor, required mutations}) async {
        return ApiResponse(
          success: true,
          message: 'Sync completed',
          data: SyncPayload(
            cursor: '2026-06-04T10:06:02.825Z',
            serverTime: '2026-06-04T10:06:02.825Z',
            applied: [],
            conflicts: [],
            failures: [],
            changes: {
              'user': [
                {
                  'id': 'user-1',
                  'syncStatus': 'pending',
                  'syncDate': null,
                  'createdAt': '2025-11-12T16:13:42.425Z',
                  'updatedAt': '2025-11-12T16:13:42.425Z',
                  'deletedAt': null,
                  'userName': 'beastTrader',
                  'firstName': 'Emeka',
                  'lastName': 'Johnson',
                  'email': 'trader@mixafrika.com',
                  'password': '',
                  'role': 'trader',
                  'isEmailVerified': true,
                  'isVerified': true,
                  'avatar': null,
                  'creditScore': 10,
                  'creditScoreStatus': 'Good',
                },
              ],
              'businesses': [
                {
                  'id': 'business-1',
                  'syncStatus': 'pending',
                  'syncDate': '2025-11-20T23:05:31.906Z',
                  'createdAt': '2025-11-20T23:05:31.906Z',
                  'updatedAt': '2025-11-20T23:05:31.906Z',
                  'deletedAt': null,
                  'name': 'Trader Business1',
                  'type': 'business',
                  'phone': '08023467856',
                  'streetAddress': '123 Main St',
                  'city': 'Gwarimpa',
                  'state': 'Abuja',
                  'country': 'Nigeria',
                  'isVerified': true,
                },
              ],
              'collections': [
                {
                  'id': 'collection-1',
                  'syncStatus': 'pending',
                  'syncDate': '2025-11-19T14:10:12.425Z',
                  'createdAt': '2025-11-19T14:10:12.425Z',
                  'updatedAt': '2025-11-19T14:10:12.425Z',
                  'deletedAt': null,
                  'name': 'Computer Village Hub',
                  'description': 'Wholesale import and distribution',
                  'totalTraders': 302,
                  'about': 'We specialize in computer parts',
                  'coverImage': 'https://picsum.photos/seed/tech1/400/200',
                  'roi': 15,
                  'minInvestment': 5000,
                  'city': 'Ikeja',
                  'state': 'Lagos',
                  'country': 'Nigeria',
                },
              ],
              'business_users': [
                {
                  'id': 'business-user-1',
                  'syncStatus': 'pending',
                  'syncDate': '2025-11-12T16:13:42.425Z',
                  'createdAt': '2025-11-12T16:13:42.425Z',
                  'updatedAt': '2025-11-12T16:13:42.425Z',
                  'deletedAt': null,
                  'role': 'trader',
                  'isActive': true,
                  'hasFullAccess': true,
                  'joinedAt': null,
                  'userId': 'user-1',
                  'businessId': 'business-1',
                },
              ],
              'branches': [
                {
                  'id': 'branch-1',
                  'syncStatus': 'pending',
                  'syncDate': '2025-11-12T16:13:42.425Z',
                  'createdAt': '2025-11-12T16:13:42.425Z',
                  'updatedAt': '2025-11-12T16:13:42.425Z',
                  'deletedAt': null,
                  'name': 'Branch 1',
                  'isHeadOffice': true,
                  'phone': '1234567890',
                  'streetAddress': '123 Main St',
                  'city': 'City',
                  'state': 'State',
                  'country': 'Country',
                  'businessId': 'business-1',
                  'collectionId': 'collection-1',
                },
              ],
              'branch_users': [
                {
                  'id': 'branch-user-1',
                  'syncStatus': 'pending',
                  'syncDate': '2025-11-12T16:13:42.425Z',
                  'createdAt': '2025-11-12T16:13:42.425Z',
                  'updatedAt': '2025-11-12T16:13:42.425Z',
                  'deletedAt': null,
                  'role': 'staff',
                  'isActive': true,
                  'assignedAt': '2025-11-12T16:13:42.425Z',
                  'userId': 'user-1',
                  'branchId': 'branch-1',
                },
              ],
            },
          ),
        );
      });
      final repository = SyncRepository(database: database, apiService: api);

      final result = await repository.runSync();

      expect(result.success, isTrue);
      expect(await database.select(database.user).get(), hasLength(1));
      expect(await database.select(database.businesses).get(), hasLength(1));
      expect(await database.select(database.collection).get(), hasLength(1));
      expect(await database.select(database.businessUser).get(), hasLength(1));
      expect(await database.select(database.branch).get(), hasLength(1));
      expect(await database.select(database.branchUser).get(), hasLength(1));
      expect(await AppPreferences.getActiveBusinessId(), 'business-1');
      expect(await AppPreferences.getActiveBranchId(), 'branch-1');
    },
  );
}
