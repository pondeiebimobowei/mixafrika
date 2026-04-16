import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';

class InventoryViewModel extends AutoDisposeAsyncNotifier<InventoryState> {
  Timer? _debounce;

  @override
  FutureOr<InventoryState> build() async {
    final activeBranch = ref.watch(activeBranchProvider);
    if (activeBranch == null) return InventoryState();

    final repository = ref.read(inventoryRepositoryProvider);

    final items = await repository.getInventoryItems(activeBranch.id);
    final stockWorth = await repository.getStockWorth(activeBranch.id);
    final estProfit = await repository.getEstProfit(activeBranch.id);

    return InventoryState(
      items: items,
      stockWorth: stockWorth,
      estProfit: estProfit,
    );
  }

  void setFilter(InventoryFilter filter) {
    if (state.hasValue) {
      state = AsyncData(state.value!.copyWith(currentFilter: filter));
    }
  }

  void setSearchQuery(String query) {
    if (!state.hasValue) return;

    // update query immediately (for UI)
    state = AsyncData(state.value!.copyWith(searchQuery: query));

    // cancel previous timer
    if (_debounce?.isActive ?? false) _debounce!.cancel();

    _debounce = Timer(const Duration(milliseconds: 400), () {
      _performSearch(query);
    });
  }

  Future<void> _performSearch(String query) async {
    final activeBranch = ref.read(activeBranchProvider);
    if (activeBranch == null) return;

    final repository = ref.read(inventoryRepositoryProvider);

    try {
      state = const AsyncLoading();

      final items = query.isEmpty
          ? await repository.getInventoryItems(activeBranch.id)
          : await repository.searchInventoryItems(activeBranch.id, query);

      final current = state.value;

      state = AsyncData((current ?? InventoryState()).copyWith(items: items));
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }
}

final inventoryViewModelProvider =
    AsyncNotifierProvider.autoDispose<InventoryViewModel, InventoryState>(() {
      return InventoryViewModel();
    });
