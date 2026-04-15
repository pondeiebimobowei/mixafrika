import 'package:spine/data/repositories/branch/branch_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BranchRepository implements BranchRepositoryAbstract {
  BranchRepository({required AppDatabase database}) : _database = database;

  final AppDatabase _database;

  @override
  Future<ApiResponse<void>> createBranch(
    BranchCompanion branch,
  ) async {
    try {
      await _database.into(_database.branch).insert(branch);
      return ApiResponse(
        data: null,
        message: 'branch created successfully',
        success: true,
      );
    } catch (e) {
      return ApiResponse(
        data: null,
        message: 'Failed to create branch: $e',
        success: false,
      );
    }
  }

  @override
  Future<ApiResponse<void>> updateBranch(BranchData branch) async {
    try {
      await _database.update(_database.branch).replace(branch);
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
  Future<List<BranchData>> getBranches() async {
    List<BranchData> allItems = await _database
        .select(_database.branch)
        .get();

    return allItems.map((e) => BranchData.fromJson(e.toJson())).toList();
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

final branchRepositoryProvider = Provider(
  (ref) => BranchRepository(database: ref.watch(databaseProvider)),
);
