import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';

abstract class InventoryRepositoryAbstract {
  Future<List<InventoryItemData>> getInventoryItems(String businessId);
  Future<void> addInventoryItem(ProductData product);
  Future<void> addStock({
    required String productId,
    required String businessId,
    required String bulkQuantity,
    required String pieceQuantity,
    required String totalCost,
    DateTime? expiryDate,
  });
  Future<double> getStockWorth(String businessId);
  Future<double> getEstProfit(String businessId);
}