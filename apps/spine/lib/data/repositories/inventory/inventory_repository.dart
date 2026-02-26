import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository_abstract.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:uuid/uuid.dart';

class InventoryRepository implements InventoryRepositoryAbstract {
  final AppDatabase _db;
  final ProductRepository productRepository;

  InventoryRepository(this._db, {required this.productRepository});

  @override
  Future<List<InventoryItemData>> getInventoryItems(String businessId) async {
    final query = _db.select(_db.inventory).join([
      innerJoin(_db.product, _db.product.id.equalsExp(_db.inventory.productId)),
      leftOuterJoin(
        _db.spineBatch,
        _db.spineBatch.productId.equalsExp(_db.product.id),
      ),
    ])..where(_db.inventory.businessId.equals(businessId));

    final rows = await query.get();

    // 2. Group the rows by Product ID
    // This handles the "1 Product -> Many Batches/Inventory Rows" relationship
    final Map<String, InventoryItemData> groupedItems = {};

    for (final row in rows) {
      final prod = row.readTable(_db.product);
      final inv = row.readTable(_db.inventory);
      final batch = row.readTableOrNull(_db.spineBatch);

      if (!groupedItems.containsKey(prod.id)) {
        groupedItems[prod.id] = InventoryItemData(
          product: prod,
          stockEntries: [inv],
          batches: batch != null ? [batch] : [],
        );
      } else {
        // Add unique inventory/batch entries to the existing product object
        if (!groupedItems[prod.id]!.stockEntries.contains(inv)) {
          groupedItems[prod.id]!.stockEntries.add(inv);
        }
        if (batch != null && !groupedItems[prod.id]!.batches.contains(batch)) {
          groupedItems[prod.id]!.batches.add(batch);
        }
      }
    }

    return groupedItems.values.toList();
  }

  @override
  Future<void> addInventoryItem(ProductData product) async {
    final InventoryData newInventoryRecord = InventoryData(
      id: const Uuid().v4(),
      productId: product.id,
      businessId: product.businessId,
      quantity: '0',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      deletedAt: DateTime.now(),
      syncStatus: 'pending',
      syncDate: DateTime.now(),
    );
    await _db.into(_db.inventory).insert(newInventoryRecord);
  }

  @override
  Future<void> addStock({
    required String productId,
    required String businessId,
    required String bulkQuantity,
    required String pieceQuantity,
    required String totalCost,
    DateTime? expiryDate,
  }) async {
    final batchId = const Uuid().v4();
    final now = DateTime.now();

    // 1. Create Batch
    final newBatch = SpineBatchData(
      id: batchId,
      productId: productId,
      expiryDate: expiryDate?.toIso8601String() ?? '',
      quantity: bulkQuantity.isEmpty ? '0' : bulkQuantity,
      batchNumber: 'BATCH-${now.millisecondsSinceEpoch}',
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
      syncStatus: 'pending',
      syncDate: now,
    );

    await _db.into(_db.spineBatch).insert(newBatch);

    // 2. Create Inventory Record
    // We calculate the total units in terms of "pieces"
    // Fetch product to get unitsPerBulk
    final prodQuery = _db.select(_db.product)
      ..where((p) => p.id.equals(productId));
    final product = await prodQuery.getSingle();

    final bulk = double.tryParse(bulkQuantity) ?? 0.0;
    final pieces = double.tryParse(pieceQuantity) ?? 0.0;
    final unitsPerBulk = double.tryParse(product.unitsPerBulk) ?? 1.0;
    final totalUnits = (bulk * unitsPerBulk) + pieces;

    final newInventory = InventoryData(
      id: const Uuid().v4(),
      productId: productId,
      businessId: businessId,
      batchId: batchId,
      quantity: totalUnits.toString(),
      createdAt: now,
      updatedAt: now,
      deletedAt: now,
      syncStatus: 'pending',
      syncDate: now,
    );

    await _db.into(_db.inventory).insert(newInventory);
  }

  @override
  Future<double> getStockWorth(String businessId) async {
    final products = await getInventoryItems(businessId);
    double total = 0.0;
    for (final item in products) {
      final costPrice = double.tryParse(item.product.costPrice) ?? 0.0;
      total += (costPrice * item.totalQuantity);
    }
    return total;
  }

  @override
  Future<double> getEstProfit(String businessId) async {
    final products = await getInventoryItems(businessId);
    double total = 0.0;
    for (final item in products) {
      final costPrice = double.tryParse(item.product.costPrice) ?? 0.0;
      final sellingPrice =
          double.tryParse(item.product.sellingPricePerPiece) ?? 0.0;
      total += ((sellingPrice - costPrice) * item.totalQuantity);
    }
    return total;
  }
}

final inventoryRepositoryProvider = Provider<InventoryRepository>((ref) {
  return InventoryRepository(
    ref.watch(databaseProvider),
    productRepository: ref.watch(productRepositoryProvider),
  );
});
