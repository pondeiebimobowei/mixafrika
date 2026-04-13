import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/user_business/user_business_repository.dart';
import 'package:spine/data/repositories/user_business/user_business_repository_remote.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class BusinessesViewModel
    extends AutoDisposeAsyncNotifier<List<BusinessesData>> {
  @override
  Future<List<BusinessesData>> build() async {
    ref.read(businessesRepositoryRemoteProvider).getBusinesses();
    final businesses = await getBusinesses();
    if (businesses.isNotEmpty) {
      ref
          .read(activeBusinessesProvider.notifier)
          .setBusiness(businesses.first);
    }
    return businesses;
  }

  Future<ApiResponse<void>> createBusiness() async {
    final res = await ref
        .read(businessesRepositoryProvider)
        .createBusinesses(BusinessesCompanion(name: Value('userId')));
    return res;
  }

  Future<List<BusinessesData>> getBusinesses() async {
    return await ref.read(businessesRepositoryProvider).getBusinesses();
  }
}

final businessesViewModelProvider =
    AutoDisposeAsyncNotifierProvider<
      BusinessesViewModel,
      List<BusinessesData>
    >(BusinessesViewModel.new);
