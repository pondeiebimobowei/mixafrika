import 'package:spine/data/repositories/business/business_repository_abstract.dart';
import 'package:spine/data/services/api/business/business_api_services.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BusinessRepositoryRemote implements BusinessRepositoryAbstract {
  BusinessRepositoryRemote({
    required AppDatabase database,
    required BusinessApiServices businessApiService,
  }) : _database = database,
       _businessApiService = businessApiService;

  final AppDatabase _database;
  final BusinessApiServices _businessApiService;

  @override
  Future<ApiResponse<BusinessesData>> createBusiness(
    BusinessesData business,
  ) async {

    final res = await _businessApiService.createBusiness(business);

    return ApiResponse(
      data: res.data,
      message: res.message,
      success: res.success,
    );
  }

  @override
  Future<BusinessesData> getBusinessById(String id) async {
    final res = await _database.select(_database.businesses).get();

    return BusinessesData.fromJson(res.first.toJson());
  }

  @override
  Future<List<BusinessesData>> getBusinesses() async {

    final res = await _businessApiService.getBusinesses();

    return res.data;
  }

  @override
  Future<void> deleteBusiness(String id) async {
    await (_database.delete(
      _database.businesses,
    )..where((p) => p.id.equals(id))).go();
  }

  @override
  Future<ApiResponse<void>> updateBusiness(BusinessesData business) async {
    await _database.update(_database.businesses).replace(business);

    return ApiResponse(
      data: null,
      message: 'Business updated successfully',
      success: true,
    );
  }

  @override
  Future<void> saveBusinesses(List<BusinessesData> businesses) async {}

}

final businessRepositoryRemoteProvider = Provider(
  (ref) => BusinessRepositoryRemote(
    database: ref.watch(databaseProvider),
    businessApiService: ref.watch(businessApiServiceProvider),
  ),
);
