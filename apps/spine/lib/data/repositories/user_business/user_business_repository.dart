import 'package:spine/data/repositories/user_business/user_business_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

class BusinessesRepository implements BusinessesRepositoryAbstract {
  BusinessesRepository({required AppDatabase database}) : _database = database;

  final AppDatabase _database;

  final userBiz1 = BusinessesData(
    id: Uuid().v4(),
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

  final userBiz2 = BusinessesData(
    id: Uuid().v4(),
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
  Future<ApiResponse<void>> createBusinesses(
    BusinessesCompanion business,
  ) async {
    try {
      await _database.into(_database.businesses).insert(business);
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
  Future<ApiResponse<void>> updateBusinesses(BusinessesData business) async {
    try {
      await _database.update(_database.businesses).replace(business);
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
  Future<BusinessesData> getBusinessesById(String id) async {
    final query = _database.select(_database.businesses)
      ..where((t) => t.id.equals(id));
    final res = await query.getSingle();

    return res;
  }

  @override
  Future<List<BusinessesData>> getBusinesses() async {
    List<BusinessesData> allItems = await _database
        .select(_database.businesses)
        .get();

    return allItems.map((e) => BusinessesData.fromJson(e.toJson())).toList();
  }

  @override
  Future<void> deleteBusinesses(String id) async {
    await (_database.delete(
      _database.businesses,
    )..where((p) => p.id.equals(id))).go();
  }

  @override
  Future<List<BankDetail>> getBankDetailsByBusinessId(String businessId) async {
    return await (_database.select(
      _database.bankDetails,
    )..where((t) => t.businessId.equals(businessId))).get();
  }
}

final businessesRepositoryProvider = Provider(
  (ref) => BusinessesRepository(database: ref.watch(databaseProvider)),
);
