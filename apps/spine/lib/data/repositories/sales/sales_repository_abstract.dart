import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/data/services/logic/sales_logic.dart';
import 'package:spine/ui/sales/state/state.dart';

abstract class SalesRepositoryAbstract {
  Future<ApiResponse<void>> createSale(
    Sale sale,
    List<SalesItemData> items,
    List<Payment> payments,
  );
  Future<List<SaleWithItems>> getSalesWithItems({String? branchId});
  Future<SaleWithItems?> getSaleById(String id);
  Future<SalesSummary> getTodaySalesSummary(String branchId);
}

class SaleWithItems {
  final Sale sale;
  final List<SaleItemWithProduct> items;
  final List<Payment> payments;
  final CustomerData? customer;

  SaleWithItems({
    required this.sale,
    required this.items,
    required this.payments,
    this.customer,
  });

  int get totalProfit {
    return SalesLogic.calculateTotalProfit(
      items
          .where((item) => item.product != null)
          .map((item) => (
                unitPrice: item.item.unitPrice,
                costPrice: item.product!.costPricePerUnit,
                quantity: item.item.quantity,
              ))
          .toList(),
    );
  }
}

class SaleItemWithProduct {
  final SalesItemData item;
  final ProductData? product;

  SaleItemWithProduct({required this.item, this.product});

  int get profit {
    if (product == null) return 0; // Manual charges have no defined profit yet
    return SalesLogic.calculateItemProfit(
      unitPrice: item.unitPrice,
      costPrice: product!.costPricePerUnit,
      quantity: item.quantity,
    );
  }
}
