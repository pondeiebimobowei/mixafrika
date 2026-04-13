import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/ui/products/view_model/products_view_model.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';
import 'package:spine/ui/user_business/view_model/user_business_view_model.dart';

class HomeState {
  final AsyncValue<List<BusinessesData>> businesses;
  final AsyncValue<List<ProductData>> product;
  final AsyncValue<InventoryState> inventory;
  final BusinessesData? activeBusinesses;

  HomeState({
    required this.businesses,
    required this.product,
    required this.inventory,
    required this.activeBusinesses,
  });
}

// class HomeViewModel extends AutoDisposeAsyncNotifier<HomeState> {
//   @override
//   Future<HomeState> build() async {
//     // await ref.read(businessesRepositoryRemoteProvider).getBusinesses();
//     // await ref
//     //     .read(businessesViewModelProvider.notifier)
//     //     .createBusiness();
//     final businesses = ref.watch(businessesViewModelProvider);
//     final product = await ref.watch(productRepositoryProvider).getProducts();
//     return HomeState(
//       businesses: businesses.value?.businesses ?? [],
//       product: product,
//       activeBusinesses: businesses.value?.act,
//     );
//   }
// }

final homeViewModelProvider = Provider<AsyncValue<HomeState>>((ref) {
  final businessesAsync = ref.watch(businessesViewModelProvider);
  final productsAsync = ref.watch(productsViewModelProvider);
  final inventoryAsync = ref.watch(inventoryViewModelProvider);
  final activeBusiness = ref.watch(activeBusinessesProvider);

  // If we have businesses and an active business, we can show the UI.
  // We only show a full loading state if we have absolutely no business data yet.
  if (businessesAsync.value != null) {
    return AsyncData(
      HomeState(
        businesses: businessesAsync,
        product: productsAsync,
        inventory: inventoryAsync,
        activeBusinesses: activeBusiness,
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
      businesses: businessesAsync,
      product: productsAsync,
      inventory: inventoryAsync,
      activeBusinesses: activeBusiness,
    ),
  );
});
