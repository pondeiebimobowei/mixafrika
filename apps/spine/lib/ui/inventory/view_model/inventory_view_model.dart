import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class InventoryViewModel extends AutoDisposeAsyncNotifier<InventoryState> {
  Timer? _debounce;

  @override
  FutureOr<InventoryState> build() async {
    final activeBusiness = ref.watch(activeBusinessesProvider);
    if (activeBusiness == null) return InventoryState();

    final repository = ref.read(inventoryRepositoryProvider);

    final items = await repository.getInventoryItems(activeBusiness.id);
    final stockWorth = await repository.getStockWorth(activeBusiness.id);
    final estProfit = await repository.getEstProfit(activeBusiness.id);

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
    final activeBusiness = ref.read(activeBusinessesProvider);
    if (activeBusiness == null) return;

    final repository = ref.read(inventoryRepositoryProvider);

    try {
      state = const AsyncLoading();

      final items = query.isEmpty
          ? await repository.getInventoryItems(activeBusiness.id)
          : await repository.searchInventoryItems(activeBusiness.id, query);

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
