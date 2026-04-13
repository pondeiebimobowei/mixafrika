import 'package:spine/data/repositories/user_business/user_business_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/user_business_api_services.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

class BusinessesRepositoryRemote implements BusinessesRepositoryAbstract {
  BusinessesRepositoryRemote({
    required AppDatabase database,
    required BusinessesApiServices apiService,
  }) : _database = database,
       _apiService = apiService;

  final AppDatabase _database;
  final BusinessesApiServices _apiService;

  @override
  Future<ApiResponse<BusinessesData>> createBusinesses(
    BusinessesCompanion business,
  ) async {
    BusinessesData businesses = BusinessesData(
      id: Uuid().v4(),
      collectionId: Uuid().v4(),
      name: 'Trader Business',
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

    final res = await _apiService.createBusinesses(businesses);

    return ApiResponse(
      data: res.data,
      message: res.message,
      success: res.success,
    );
  }

  @override
  Future<BusinessesData> getBusinessesById(String id) async {
    final res = await _database.select(_database.businesses).get();

    return BusinessesData.fromJson(res.first.toJson());
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

final businessesRepositoryRemoteProvider = Provider(
  (ref) => BusinessesRepositoryRemote(
    database: ref.watch(databaseProvider),
    apiService: ref.watch(businessesApiServiceProvider),
  ),
);
