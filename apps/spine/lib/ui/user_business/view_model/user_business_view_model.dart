import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/repositories/branch/branch_repository_remote.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class BranchViewModel
    extends AutoDisposeAsyncNotifier<List<BranchData>> {
  @override
  Future<List<BranchData>> build() async {
    ref.read(branchRepositoryRemoteProvider).getBranches();
    final branch = await getBranches();
    if (branch.isNotEmpty) {
      ref
          .read(activeBranchProvider.notifier)
          .setBranch(branch.first);
    }
    return branch;
  }

  Future<ApiResponse<void>> createBranch() async {
    final res = await ref
        .read(branchRepositoryProvider)
        .createBranch(BranchCompanion(name: Value('userId')));
    return res;
  }

  Future<List<BranchData>> getBranches() async {
    return await ref.read(branchRepositoryProvider).getBranches();
  }
}

final branchViewModelProvider =
    AutoDisposeAsyncNotifierProvider<
      BranchViewModel,
      List<BranchData>
    >(BranchViewModel.new);
