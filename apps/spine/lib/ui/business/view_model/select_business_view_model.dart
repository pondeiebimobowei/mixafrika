import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/repositories/business/business_repository.dart';
import 'package:spine/data/repositories/business/business_repository_remote.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';
import 'package:spine/ui/business/state/select_business_state.dart';

class SelectBusinessViewModel extends AutoDisposeAsyncNotifier<SelectBusinessState> {

  @override
  Future<SelectBusinessState> build() async {
    final businessRepository = ref.watch(businessRepositoryProvider);

    // ✅ 1. Load local immediately
    final localBusinesses = await businessRepository.getBusinesses();

    // ✅ 2. Trigger background refresh (don’t await)
    _refreshBusinesses();

    return SelectBusinessState(
      business: localBusinesses,
    );
  }

  Future<void> _refreshBusinesses() async {
    final businessRepository = ref.read(businessRepositoryProvider);
    final businessRemoteRepository = ref.read(businessRepositoryRemoteProvider);

    try {
      final remoteBusinesses = await businessRemoteRepository.getBusinesses();

      await businessRepository.saveBusinesses(remoteBusinesses);

      final updatedBusinesses = await businessRepository.getBusinesses();

      state = AsyncData(
        SelectBusinessState(business: updatedBusinesses),
      );
    } catch (e) {
      print('Error refreshing businesses: $e');
    }
  }

  Future<void> selectBusiness(String businessId) async {
    final branchRepository = ref.read(branchRepositoryProvider);

    // ✅ 1. Save active business context
    await AppPreferences.saveActiveBusinessId(businessId);

    // ✅ 2. Find branches and select default
    final branches = await branchRepository.getBranchesByBusinessId(businessId);
    if (branches.isNotEmpty) {
      // Prioritize Head Office, else pick first
      final headOffice = branches.where((b) => b.isHeadOffice).firstOrNull ?? branches.first;
      await AppPreferences.saveActiveBranchId(headOffice.id);
      
      // ✅ Update active branch provider for immediate UI feedback
      ref.read(activeBranchProvider.notifier).setBranch(headOffice);
    }

    // ✅ 3. Trigger full sync for selected business (important)
    // TODO: implement syncServiceProvider if needed
    // ref.read(syncServiceProvider).syncBusiness(businessId);
  }
}

final selectBusinessViewModelProvider =
    AsyncNotifierProvider.autoDispose<SelectBusinessViewModel, SelectBusinessState>(
  SelectBusinessViewModel.new,
);