import 'package:spine/data/repositories/branch/branch_repository_abstract.dart';
import 'package:spine/data/services/api/branch/branch_api_services.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BranchRepository implements BranchRepositoryAbstract {
  BranchRepository({required AppDatabase database, required BranchApiServices branchApiServices }) 
  : _database = database,
    _branchApiServices = branchApiServices;

  final AppDatabase _database;
  final BranchApiServices _branchApiServices;

  @override
  Future<ApiResponse<void>> createBranch(
    BranchData branch,
  ) async {
    await _database.into(_database.branch).insertReturning(branch);

    final res = await _branchApiServices.createBranch(branch);
    return ApiResponse(
      data: null,
      message: res.message,
      success: res.success,
    );
  }

  @override
  Future<ApiResponse<void>> updateBranch(BranchData branch) async {
    try {
      final updated = await _database.update(_database.branch).replace(branch);
      if (!updated) {
        return ApiResponse(
          data: null,
          message: 'Branch not found or no changes made',
          success: false,
        );
      }
      return ApiResponse(
        data: null,
        message: 'branch updated successfully',
        success: true,
      );
    } catch (e) {
      return ApiResponse(
        data: null,
        message: 'Failed to update branch: $e',
        success: false,
      );
    }
  }

  @override
  Future<BranchData> getBranchById(String id) async {
    final query = _database.select(_database.branch)
      ..where((t) => t.id.equals(id));
    final res = await query.getSingle();

    return res;
  }

  @override
  Future<List<BranchData>> getBranchesByBusinessId(String businessId) async {
    final query = _database.select(_database.branch)
      ..where((t) => t.businessId.equals(businessId));
    final res = await query.get();
    return res;
  }

  @override
  Future<void> deleteBranch(String id) async {
    await (_database.delete(
      _database.branch,
    )..where((p) => p.id.equals(id))).go();
  }

  @override
  Future<List<BankDetail>> getBankDetailsByBranchId(String branchId) async {
    return await (_database.select(
      _database.bankDetails,
    )..where((t) => t.branchId.equals(branchId))).get();
  }
}

final branchRepositoryLocalProvider = Provider(
  (ref) => BranchRepository(branchApiServices: ref.read(branchApiServiceProvider), database: ref.watch(databaseProvider)),
);
