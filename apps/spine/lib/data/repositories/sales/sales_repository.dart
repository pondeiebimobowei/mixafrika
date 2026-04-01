import 'dart:math';

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
        if(item.type == 'product'){
          if (item.productId == null) {
            throw Exception('Product item must have productId');
          }

          var remainingToFulfill = item.quantity;

          final batchQuery = _db.select(_db.spineBatch)
            ..where((tbl) => 
              tbl.productId.equals(item.productId!) & 
              tbl.remainingQuantity.isBiggerThanValue(0) & 
              ( tbl.expiryDate.isNull() |
                tbl.expiryDate.isBiggerThanValue(DateTime.now())
              )
            )
            ..orderBy([
              (t) => OrderingTerm(expression: t.expiryDate, mode: OrderingMode.asc),
              (t) => OrderingTerm(expression: t.createdAt, mode: OrderingMode.asc),
            ]);

          final batches = await batchQuery.get();

          for (final batch in batches) {
            if (remainingToFulfill <= 0) break;

            final take = min(batch.remainingQuantity, remainingToFulfill);

            await _db.into(_db.salesItem).insert(item.copyWith(
              quantity: take,
              batchId: Value(batch.id), // Ensure your schema links salesItem to the batch
            ));

            await _db.customUpdate(
              'UPDATE spine_batch SET remaining_quantity = remaining_quantity - ? WHERE id = ?',
              variables: [Variable.withInt(take), Variable.withString(batch.id)],
              updates: {_db.spineBatch}, 
            );
            await _db.customUpdate(
              'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?',
              variables: [Variable.withInt(take), Variable.withString(batch.productId)],
              updates: {_db.inventory}, 
            );

            remainingToFulfill -= take;
          }
          
          if (remainingToFulfill > 0) {
            throw Exception('Insufficient stock for ${item.name}');
          }
        }else{
          await _db.into(_db.salesItem).insert(item);
        }
      }

      for (final payment in payments) {
        await _db.into(_db.payments).insert(payment);
      }
    });
  } catch (e) {
    print(e);
    rethrow; 
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
