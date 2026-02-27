import 'package:spine/drift/database.dart';

abstract class SalesRepositoryAbstract {
  Future<void> createSale(Sale sale, List<SalesItemData> items);
  Future<List<SaleWithItems>> getSalesWithItems({String? businessId});
  Future<SaleWithItems?> getSaleById(String id);
}

class SaleWithItems {
  final Sale sale;
  final List<SaleItemWithProduct> items;

  SaleWithItems({required this.sale, required this.items});

  int get totalProfit {
    return items.fold(0, (sum, item) => sum + item.profit);
  }
}

class SaleItemWithProduct {
  final SalesItemData item;
  final ProductData product;

  SaleItemWithProduct({required this.item, required this.product});

  int get profit {
    return (item.unitPrice - product.costPrice) * item.quantity;
  }
}
