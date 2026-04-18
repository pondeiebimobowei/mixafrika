import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/business_model.dart';
import 'package:spine/drift/database.dart';

abstract class BusinessRepositoryAbstract {
  Future<ApiResponse<BusinessWithBranch>> createBusiness(BusinessesData business);
  Future<BusinessesData> getBusinessById(String id);
  Future<List<BusinessesData>> getBusinesses();
  Future<ApiResponse<void>> updateBusiness(BusinessesData business);
  Future<void> deleteBusiness(String id);
  Future<void> saveBusinesses(List<BusinessesData> businesses);
  Future<void> saveBranches (List<BranchData> branches);
}
