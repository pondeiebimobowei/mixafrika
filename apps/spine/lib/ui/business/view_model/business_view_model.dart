import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';

class BranchViewModel
    extends AutoDisposeAsyncNotifier<List<BranchData>> {
  @override
  Future<List<BranchData>> build() async {
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
        .read(branchRepositoryLocalProvider)
        .createBranch(branch);
    return res;
  }

  Future<List<BranchData>> getBranches() async {
    final businessId = await AppPreferences.getActiveBusinessId();
    return await ref.read(branchRepositoryLocalProvider).getBranchesByBusinessId(businessId!);
  }
}

final branchViewModelProvider =
    AutoDisposeAsyncNotifierProvider<
      BranchViewModel,
      List<BranchData>
    >(BranchViewModel.new);
