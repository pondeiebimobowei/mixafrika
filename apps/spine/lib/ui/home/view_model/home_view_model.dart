import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/sales/sales_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/ui/products/view_model/products_view_model.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';
import 'package:spine/ui/business/view_model/business_view_model.dart';
import 'package:spine/ui/sales/state/state.dart';

class HomeState {
  final AsyncValue<List<BranchData>> branch;
  final AsyncValue<List<ProductData>> product;
  final AsyncValue<InventoryState> inventory;
  final AsyncValue<SalesSummary> todaySummary;
  final BranchData? activeBranch;

  HomeState({
    required this.branch,
    required this.product,
    required this.inventory,
    required this.todaySummary,
    required this.activeBranch,
  });
}

final todaySummaryProvider = FutureProvider.autoDispose<SalesSummary>((ref) async {
  final activeBranch = ref.watch(activeBranchProvider);
  if (activeBranch == null) return SalesSummary();
  
  return ref.read(salesRepositoryProvider).getTodaySalesSummary(activeBranch.id);
});

final homeViewModelProvider = Provider<AsyncValue<HomeState>>((ref) {
  final branchAsync = ref.watch(branchViewModelProvider);
  final productsAsync = ref.watch(productsViewModelProvider);
  final inventoryAsync = ref.watch(inventoryViewModelProvider);
  final activeBranch = ref.watch(activeBranchProvider);
  final todaySummaryAsync = ref.watch(todaySummaryProvider);

  if (branchAsync.value != null) {
    return AsyncData(
      HomeState(
        branch: branchAsync,
        product: productsAsync,
        inventory: inventoryAsync,
        todaySummary: todaySummaryAsync,
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

  return AsyncData(
    HomeState(
      branch: branchAsync,
      product: productsAsync,
      inventory: inventoryAsync,
      todaySummary: todaySummaryAsync,
      activeBranch: activeBranch,
    ),
  );
});
