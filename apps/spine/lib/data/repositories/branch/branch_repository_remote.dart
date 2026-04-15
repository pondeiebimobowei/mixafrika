import 'package:spine/data/repositories/branch/branch_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/branch_api_services.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

class BranchRepositoryRemote implements BranchRepositoryAbstract {
  BranchRepositoryRemote({
    required AppDatabase database,
    required BranchApiServices apiService,
  }) : _database = database,
       _apiService = apiService;

  final AppDatabase _database;
  final BranchApiServices _apiService;

  @override
  Future<ApiResponse<BranchData>> createBranch(
    BranchCompanion branch,
  ) async {
    BranchData branch = BranchData(
      id: Uuid().v4(),
      name: 'Trader Business',
      phone: '08023467856',
      streetAddress: '123 Main St',
      city: 'Gwarimpa',
      state: 'Abuja',
      country: 'Nigeria',
      isHeadOffice: true,
      businessId: '',
      collectionId: '',

      syncStatus: '',
      syncDate: DateTime.now(),

      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    final res = await _apiService.createBranch(branch);

    return ApiResponse(
      data: res.data,
      message: res.message,
      success: res.success,
    );
  }

  @override
  Future<BranchData> getBranchById(String id) async {
    final res = await _database.select(_database.branch).get();

    return BranchData.fromJson(res.first.toJson());
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
  Future<ApiResponse<void>> updateBranch(BranchData branch) async {
    await _database.update(_database.branch).replace(branch);

    return ApiResponse(
      data: null,
      message: 'Branch updated successfully',
      success: true,
    );
  }

  @override
  Future<List<BankDetail>> getBankDetailsByBranchId(String branchId) async {
    return await (_database.select(
      _database.bankDetails,
    )..where((t) => t.branchId.equals(branchId))).get();
  }
}

final branchRepositoryRemoteProvider = Provider(
  (ref) => BranchRepositoryRemote(
    database: ref.watch(databaseProvider),
    apiService: ref.watch(branchApiServiceProvider),
  ),
);
