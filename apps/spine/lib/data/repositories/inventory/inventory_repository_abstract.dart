import 'package:spine/drift/database.dart';

abstract class InventoryRepositoryAbstract {
  Future<List<InventoryItemData>> getInventoryItems(String businessId);
  Future<double> getStockWorth(String businessId);
  Future<double> getEstProfit(String businessId);
}

class InventoryItemData {
  final ProductData product;
  final List<InventoryData> stockEntries;
  final List<SpineBatchData> batches;

  InventoryItemData({
    required this.product,
    required this.stockEntries,
    required this.batches,
  });

  double get totalQuantity {
    return stockEntries.fold(
      0.0,
      (sum, item) => sum + (double.tryParse(item.quantity) ?? 0.0),
    );
  }

  // Add more helper getters if needed
}
