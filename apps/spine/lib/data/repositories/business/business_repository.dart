import 'package:drift/drift.dart';
import 'package:spine/data/repositories/business/business_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

class BusinessRepository implements BusinessRepositoryAbstract {
  BusinessRepository({required AppDatabase database}) : _database = database;

  final AppDatabase _database;

  @override
  Future<ApiResponse<BusinessesData>> createBusiness(
    BusinessesData business,
  ) async {
    try {
      await _database.into(_database.businesses).insert(business);
      return ApiResponse(
        data: business,
        message: 'business created successfully',
        success: true,
      );
    } catch (e) {
      return ApiResponse(
        data: business,
        message: 'Failed to create business: $e',
        success: false,
      );
    }
  }

  @override
  Future<ApiResponse<void>> updateBusiness(BusinessesData business) async {
    try {
      await _database.update(_database.businesses).replace(business);
      return ApiResponse(
        data: null,
        message: 'business updated successfully',
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
  Future<BusinessesData> getBusinessById(String id) async {
    final query = _database.select(_database.businesses)
      ..where((t) => t.id.equals(id));
    final res = await query.getSingle();

    return res;
  }

  @override
  Future<List<BusinessesData>> getBusinesses() async {
    try {
      final List<BusinessesData> allItems = await _database
          .select(_database.businesses)
          .get();

      return allItems.where((item) => item.syncStatus != 'pending1').toList();
    } catch (e, stack) {
      print('Error in getBusinesses: $e');
      print(stack);
      rethrow;
    }
  }

  @override
  Future<void> deleteBusiness(String id) async {
    await (_database.delete(
      _database.businesses,
    )..where((p) => p.id.equals(id))).go();
  }

  @override
  Future<void> saveBusinesses(List<BusinessesData> businesses) async {
  await _database.batch((batch) {
    batch.insertAllOnConflictUpdate(
      _database.businesses,
      businesses.map((b) => BusinessesCompanion.insert(
        id: Uuid().v4(),
        name: b.name,
        phone: b.phone,
        streetAddress: b.streetAddress,
        city: b.city,
        state: b.state,
        country: b.country,
        type: b.type,
        isVerified: b.isVerified,
        syncStatus: b.syncStatus,
        syncDate: Value(b.syncDate),
        createdAt: Value(b.createdAt),
        updatedAt: Value(b.updatedAt),
      )).toList(),
    );
  });
}

}

final businessRepositoryProvider = Provider(
  (ref) => BusinessRepository(database: ref.watch(databaseProvider)),
);
