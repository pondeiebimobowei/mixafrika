import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/ui/products/view_model/products_view_model.dart';
import 'package:spine/ui/user_business/active_user_business_provider.dart';
import 'package:spine/ui/user_business/view_model/user_business_view_model.dart';

class HomeState {
  final AsyncValue<List<UserBusinessData>> userBusiness;
  final AsyncValue<List<ProductData>> product;
  final AsyncValue<InventoryState> inventory;
  final UserBusinessData? activeUserBusiness;

  HomeState({
    required this.userBusiness,
    required this.product,
    required this.inventory,
    required this.activeUserBusiness,
  });
}

// class HomeViewModel extends AutoDisposeAsyncNotifier<HomeState> {
//   @override
//   Future<HomeState> build() async {
//     // await ref.read(userBusinessRepositoryRemoteProvider).getUserBusinesses();
//     // await ref
//     //     .read(userBusinessViewModelProvider.notifier)
//     //     .createBusiness();
//     final userBusiness = ref.watch(userBusinessViewModelProvider);
//     final product = await ref.watch(productRepositoryProvider).getProducts();
//     return HomeState(
//       userBusiness: userBusiness.value?.userBusiness ?? [],
//       product: product,
//       activeUserBusiness: userBusiness.value?.act,
//     );
//   }
// }

final homeViewModelProvider = Provider<AsyncValue<HomeState>>((ref) {
  final businessesAsync = ref.watch(userBusinessViewModelProvider);
  final productsAsync = ref.watch(productsViewModelProvider);
  final inventoryAsync = ref.watch(inventoryViewModelProvider);
  final activeBusiness = ref.watch(activeUserBusinessProvider);

  // If we have businesses and an active business, we can show the UI.
  // We only show a full loading state if we have absolutely no business data yet.
  if (businessesAsync.value != null) {
    return AsyncData(
      HomeState(
        userBusiness: businessesAsync,
        product: productsAsync,
        inventory: inventoryAsync,
        activeUserBusiness: activeBusiness,
      ),
    );
  }

  if (businessesAsync.isLoading || productsAsync.isLoading) {
    return const AsyncLoading();
  }

  if (businessesAsync.hasError) {
    return AsyncError(businessesAsync.error!, StackTrace.current);
  }

  if (productsAsync.hasError) {
    return AsyncError(productsAsync.error!, StackTrace.current);
  }

  return AsyncData(
    HomeState(
      userBusiness: businessesAsync,
      product: productsAsync,
      inventory: inventoryAsync,
      activeUserBusiness: activeBusiness,
    ),
  );
});
