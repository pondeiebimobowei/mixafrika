import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/business/business_repository.dart';
import 'package:spine/data/repositories/business/business_repository_remote.dart';
import 'package:spine/ui/user_business/state/select_business_state.dart';

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

  // Future<void> selectBusiness(String businessId) async {
  //   final businessRepository = ref.read(businessRepositoryProvider);

  //   // ✅ Save active business context
  //   await businessRepository.setActiveBusiness(businessId);

  //   // ✅ Trigger full sync for selected business (important)
  //   // DO NOT block navigation
  //   ref.read(syncServiceProvider).syncBusiness(businessId);
  // }
}

final selectBusinessViewModelProvider =
    AsyncNotifierProvider.autoDispose<SelectBusinessViewModel, SelectBusinessState>(
  SelectBusinessViewModel.new,
);