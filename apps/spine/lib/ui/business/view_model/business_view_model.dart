import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/repositories/branch/branch_repository_remote.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';

class BranchViewModel
    extends AutoDisposeAsyncNotifier<List<BranchData>> {
  @override
  Future<List<BranchData>> build() async {
    final businessId = await AppPreferences.getActiveBusinessId();

    ref.read(branchRepositoryRemoteProvider).getBranchesByBusinessId(businessId!);
    final branch = await getBranches();
    if (branch.isNotEmpty) {
      ref
          .read(activeBranchProvider.notifier)
          .setBranch(branch.first);
    }
    return branch;
  }

  Future<ApiResponse<void>> createBranch(BranchData branch) async {
    final res = await ref
        .read(branchRepositoryProvider)
        .createBranch(branch);
    return res;
  }

  Future<List<BranchData>> getBranches() async {
    final businessId = await AppPreferences.getActiveBusinessId();
    return await ref.read(branchRepositoryProvider).getBranchesByBusinessId(businessId!);
  }
}

final branchViewModelProvider =
    AutoDisposeAsyncNotifierProvider<
      BranchViewModel,
      List<BranchData>
    >(BranchViewModel.new);
