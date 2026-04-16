import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

abstract class BranchRepositoryAbstract {
  Future<void> deleteBranch(String id);

  Future<BranchData> getBranchById(String id);

  Future<ApiResponse<void>> createBranch(BranchData branch);
  Future<ApiResponse<void>> updateBranch(BranchData branch);
  Future<List<BranchData>> getBranchesByBusinessId(String businessId);
  Future<List<BankDetail>> getBankDetailsByBranchId(String branchId);
}
