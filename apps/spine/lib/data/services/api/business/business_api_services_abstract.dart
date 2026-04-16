import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

abstract class BusinessApiServicesAbstract {
  Future<ApiResponse<List<BusinessesData>>> getBusinesses();

  Future<ApiResponse<BusinessesData>> createBusiness(BusinessesData business);
}