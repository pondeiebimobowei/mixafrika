import 'package:spine/data/repositories/inventory/inventory_repository_abstract.dart';

enum InventoryFilter { all, lowStock, expiring }

class InventoryState {
  final double stockWorth;
  final double estProfit;
  final List<InventoryItemData> items;
  final InventoryFilter currentFilter;
  final String searchQuery;

  InventoryState({
    this.stockWorth = 0.0,
    this.estProfit = 0.0,
    this.items = const [],
    this.currentFilter = InventoryFilter.all,
    this.searchQuery = '',
  });

  InventoryState copyWith({
    double? stockWorth,
    double? estProfit,
    List<InventoryItemData>? items,
    InventoryFilter? currentFilter,
    String? searchQuery,
  }) {
    return InventoryState(
      stockWorth: stockWorth ?? this.stockWorth,
      estProfit: estProfit ?? this.estProfit,
      items: items ?? this.items,
      currentFilter: currentFilter ?? this.currentFilter,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }

  List<InventoryItemData> get filteredItems {
    var filtered = items;

    if (searchQuery.isNotEmpty) {
      filtered = filtered
          .where(
            (item) => item.product.name.toLowerCase().contains(
              searchQuery.toLowerCase(),
            ),
          )
          .toList();
    }

    switch (currentFilter) {
      case InventoryFilter.lowStock:
        // Logic for low stock, e.g., totalQuantity < 5
        filtered = filtered.where((item) => item.totalQuantity < 5).toList();
        break;
      case InventoryFilter.expiring:
        // Logic for expiring, e.g., some batch expires soon
        filtered = filtered
            .where(
              (item) => item.batches.any((batch) {
                final expiry = DateTime.tryParse(batch.expiryDate);
                if (expiry == null) return false;
                return expiry.isBefore(
                  DateTime.now().add(const Duration(days: 30)),
                );
              }),
            )
            .toList();
        break;
      case InventoryFilter.all:
        break;
    }

    return filtered;
  }
}
