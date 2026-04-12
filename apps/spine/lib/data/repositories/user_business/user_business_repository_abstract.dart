import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

abstract class UserBusinessRepositoryAbstract {
  Future<void> deleteUserBusiness(String id);

  Future<UserBusinessData> getUserBusinessById(String id);

  Future<ApiResponse<void>> createUserBusiness(UserBusinessCompanion business);
  // Future<ApiResponse<void>> updateUserBusiness(UserBusinessData business);
  Future<List<UserBusinessData>> getUserBusiness();
  Future<List<BankDetail>> getBankDetailsByBusinessId(String businessId);
}
