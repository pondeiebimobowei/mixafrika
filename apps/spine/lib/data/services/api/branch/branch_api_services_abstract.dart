import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

abstract class BranchApiServicesAbstract {
  Future<ApiResponse<List<BranchData>>> getBranchesByBusinessId(String businessId);
  Future<ApiResponse<List<BranchData>>> getBranches();
  Future<ApiResponse<BranchData>> getBranchById(String id);
  Future<ApiResponse<BranchData>> createBranch(BranchData branch);
}