import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/data/services/api/config/api_response.dart';


abstract class InventoryRepositoryAbstract {
  Future<List<InventoryItemData>> getInventoryItems(String businessId);
  Future<InventoryItemData?> getInventoryItemById(String productId);
  Future<ApiResponse<void>> addInventoryItem(ProductData product);
  Future<void> addStock({
    required String productId,
    required String businessId,
    // required int bulkQuantity,
    required int pieceQuantity,
    required String totalCost,
    required int bulkPrice,
    required int piecePrice,
    DateTime? expiryDate,
  });
  Future<double> getStockWorth(String businessId);
  Future<double> getEstProfit(String businessId);
  Future<List<InventoryItemData>> searchInventoryItems(
    String businessId,
    String query,
  );
}
