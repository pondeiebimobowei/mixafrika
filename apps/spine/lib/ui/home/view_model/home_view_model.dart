import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/ui/products/view_model/products_view_model.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';
import 'package:spine/ui/user_business/view_model/user_business_view_model.dart';

class HomeState {
  final AsyncValue<List<BranchData>> branch;
  final AsyncValue<List<ProductData>> product;
  final AsyncValue<InventoryState> inventory;
  final BranchData? activeBranch;

  HomeState({
    required this.branch,
    required this.product,
    required this.inventory,
    required this.activeBranch,
  });
}

// class HomeViewModel extends AutoDisposeAsyncNotifier<HomeState> {
//   @override
//   Future<HomeState> build() async {
//     // await ref.read(branchRepositoryRemoteProvider).getBranch();
//     // await ref
//     //     .read(branchViewModelProvider.notifier)
//     //     .createBranch();
//     final branch = ref.watch(branchViewModelProvider);
//     final product = await ref.watch(productRepositoryProvider).getProducts();
//     return HomeState(
//       branch: branch.value?.branch ?? [],
//       product: product,
//       activeBranch: branch.value?.act,
//     );
//   }
// }

final homeViewModelProvider = Provider<AsyncValue<HomeState>>((ref) {
  final branchAsync = ref.watch(branchViewModelProvider);
  final productsAsync = ref.watch(productsViewModelProvider);
  final inventoryAsync = ref.watch(inventoryViewModelProvider);
  final activeBranch = ref.watch(activeBranchProvider);

  // If we have branch and an active branch, we can show the UI.
  // We only show a full loading state if we have absolutely no branch data yet.
  if (branchAsync.value != null) {
    return AsyncData(
      HomeState(
        branch: branchAsync,
        product: productsAsync,
        inventory: inventoryAsync,
        activeBranch: activeBranch,
      ),
    );
  }

  if (branchAsync.isLoading || productsAsync.isLoading) {
    return const AsyncLoading();
  }

  if (branchAsync.hasError) {
    return AsyncError(branchAsync.error!, StackTrace.current);
  }

  if (productsAsync.hasError) {
    return AsyncError(productsAsync.error!, StackTrace.current);
  }

  return AsyncData(
    HomeState(
      branch: branchAsync,
      product: productsAsync,
      inventory: inventoryAsync,
      activeBranch: activeBranch,
    ),
  );
});
