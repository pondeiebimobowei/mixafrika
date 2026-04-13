import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

abstract class BusinessesRepositoryAbstract {
  Future<void> deleteBusinesses(String id);

  Future<BusinessesData> getBusinessesById(String id);

  Future<ApiResponse<void>> createBusinesses(BusinessesCompanion business);
  // Future<ApiResponse<void>> updateBusinesses(BusinessesData business);
  Future<List<BusinessesData>> getBusinesses();
  Future<List<BankDetail>> getBankDetailsByBusinessId(String businessId);
}
