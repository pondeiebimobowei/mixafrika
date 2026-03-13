import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class InventoryViewModel extends AutoDisposeAsyncNotifier<InventoryState> {
  @override
  FutureOr<InventoryState> build() async {
    final activeBusiness = ref.watch(activeUserBusinessProvider);
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
    if (state.hasValue) {
      state = AsyncData(state.value!.copyWith(searchQuery: query));
    }
  }
}

final inventoryViewModelProvider =
    AsyncNotifierProvider.autoDispose<InventoryViewModel, InventoryState>(() {
      return InventoryViewModel();
    });
