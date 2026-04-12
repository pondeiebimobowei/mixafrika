import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/user_business/user_business_repository.dart';
import 'package:spine/data/repositories/user_business/user_business_repository_remote.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class UserBusinessViewModel
    extends AutoDisposeAsyncNotifier<List<UserBusinessData>> {
  @override
  Future<List<UserBusinessData>> build() async {
    ref.read(userBusinessRepositoryRemoteProvider).getUserBusiness();
    final userBusiness = await getUserBusinesses();
    if (userBusiness.isNotEmpty) {
      ref
          .read(activeUserBusinessProvider.notifier)
          .setBusiness(userBusiness.first);
    }
    return userBusiness;
  }

  Future<ApiResponse<void>> createBusiness() async {
    final res = await ref
        .read(userBusinessRepositoryProvider)
        .createUserBusiness(UserBusinessCompanion(name: Value('userId')));
    return res;
  }

  Future<List<UserBusinessData>> getUserBusinesses() async {
    return await ref.read(userBusinessRepositoryProvider).getUserBusiness();
  }
}

final userBusinessViewModelProvider =
    AutoDisposeAsyncNotifierProvider<
      UserBusinessViewModel,
      List<UserBusinessData>
    >(UserBusinessViewModel.new);
