import 'package:spine/data/repositories/user_business/user_business_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

class UserBusinessRepository implements UserBusinessRepositoryAbstract {
  UserBusinessRepository({required AppDatabase database})
    : _database = database;

  final AppDatabase _database;

  final userBiz1 = UserBusinessData(
    id: Uuid().v4(),
    userId: '1',
    collectionId: '1',
    name: 'Trader 1',
    type: 'business',
    phone: '08023467856',
    streetAddress: '123 Main St',
    city: 'Gwarimpa',
    state: 'Abuja',
    country: 'Nigeria',
    verification: '',

    syncStatus: '',
    syncDate: DateTime.now(),

    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );

  final userBiz2 = UserBusinessData(
    id: Uuid().v4(),
    userId: '1',
    collectionId: '1',
    name: 'Trader 2',
    type: 'business',
    phone: '08023467856',
    streetAddress: '123 Main St',
    city: 'Gwarimpa',
    state: 'Abuja',
    country: 'Nigeria',
    verification: '',

    syncStatus: '',
    syncDate: DateTime.now(),

    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );

  @override
  Future<ApiResponse<void>> createUserBusiness(
    UserBusinessCompanion business,
  ) async {
    try {
      await _database.into(_database.userBusiness).insert(business);
      return ApiResponse(
        data: null,
        message: 'Business created successfully',
        success: true,
      );
    } catch (e) {
      return ApiResponse(
        data: null,
        message: 'Failed to create business: $e',
        success: false,
      );
    }
  }

  @override
  Future<ApiResponse<void>> updateUserBusiness(UserBusinessData business) async {
    try {
      await _database.update(_database.userBusiness).replace(business);
      return ApiResponse(
        data: null,
        message: 'Business updated successfully',
        success: true,
      );
    } catch (e) {
      return ApiResponse(
        data: null,
        message: 'Failed to update business: $e',
        success: false,
      );
    }
  }

  @override
  Future<UserBusinessData> getUserBusinessById(String id) async {
    final query = _database.select(_database.userBusiness)
      ..where((t) => t.id.equals(id));
    final res = await query.getSingle();

    return res;
  }

  @override
  Future<List<UserBusinessData>> getUserBusiness() async {
    List<UserBusinessData> allItems = await _database
        .select(_database.userBusiness)
        .get();

    return allItems.map((e) => UserBusinessData.fromJson(e.toJson())).toList();
  }

  @override
  Future<void> deleteUserBusiness(String id) async {
    await (_database.delete(
      _database.userBusiness,
    )..where((p) => p.id.equals(id))).go();
  }

  @override
  Future<List<BankDetail>> getBankDetailsByBusinessId(String businessId) async {
    return await (_database.select(_database.bankDetails)
          ..where((t) => t.businessId.equals(businessId)))
        .get();
  }
}

final userBusinessRepositoryProvider = Provider(
  (ref) => UserBusinessRepository(database: ref.watch(databaseProvider)),
);
