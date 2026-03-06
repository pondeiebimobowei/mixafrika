import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/data/repositories/sales/sales_repository_abstract.dart';

class SalesRepository implements SalesRepositoryAbstract {
  final AppDatabase _db;

  SalesRepository(this._db);

  @override
  Future<void> createSale(
    Sale sale,
    List<SalesItemData> items,
    List<Payment> payments,
  ) async {
    try {
      await _db.transaction(() async {
        await _db.into(_db.sales).insert(sale);
        for (final item in items) {
          await _db.into(_db.salesItem).insert(item);
        }
        for (final payment in payments) {
          await _db.into(_db.payments).insert(payment);
        }
      });
    } catch (e) {
      print(e);
    }
  }

  @override
  Future<List<SaleWithItems>> getSalesWithItems({String? businessId}) async {
    final query = _db.select(_db.sales).join([
      innerJoin(_db.salesItem, _db.salesItem.saleId.equalsExp(_db.sales.id)),
      leftOuterJoin(
        _db.product,
        _db.product.id.equalsExp(_db.salesItem.productId),
      ),
    ]);

    if (businessId != null) {
      query.where(_db.sales.businessId.equals(businessId));
    }

    query.orderBy([
      OrderingTerm.desc(_db.sales.id),
    ]); // Assuming ID or date is sortable

    final rows = await query.get();
    final Map<String, SaleWithItems> salesMap = {};

    for (final row in rows) {
      final sale = row.readTable(_db.sales);
      final item = row.readTable(_db.salesItem);
      final product = row.readTableOrNull(_db.product);

      if (!salesMap.containsKey(sale.id)) {
        salesMap[sale.id] = SaleWithItems(sale: sale, items: [], payments: []);
      }

      salesMap[sale.id]!.items.add(
        SaleItemWithProduct(item: item, product: product),
      );
    }

    if (salesMap.isNotEmpty) {
      final paymentsQuery = _db.select(_db.payments)
        ..where((p) => p.saleId.isIn(salesMap.keys));
      final payments = await paymentsQuery.get();
      for (final payment in payments) {
        if (salesMap.containsKey(payment.saleId)) {
          salesMap[payment.saleId]!.payments.add(payment);
        }
      }
    }

    return salesMap.values.toList();
  }

  @override
  Future<SaleWithItems?> getSaleById(String id) async {
    final query = _db.select(_db.sales).join([
      innerJoin(_db.salesItem, _db.salesItem.saleId.equalsExp(_db.sales.id)),
      leftOuterJoin(
        _db.product,
        _db.product.id.equalsExp(_db.salesItem.productId),
      ),
    ])..where(_db.sales.id.equals(id));

    final rows = await query.get();
    if (rows.isEmpty) return null;

    final sale = rows.first.readTable(_db.sales);
    final items = rows.map((row) {
      return SaleItemWithProduct(
        item: row.readTable(_db.salesItem),
        product: row.readTableOrNull(_db.product),
      );
    }).toList();

    final payments = await (_db.select(
      _db.payments,
    )..where((p) => p.saleId.equals(id))).get();

    return SaleWithItems(sale: sale, items: items, payments: payments);
  }
}

final salesRepositoryProvider = Provider<SalesRepository>((ref) {
  return SalesRepository(ref.watch(databaseProvider));
});
