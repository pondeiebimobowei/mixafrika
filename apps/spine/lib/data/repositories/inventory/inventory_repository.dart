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
  Future<InventoryItemData?> getInventoryItemById(String productId) async {
    final productQuery = _db.select(_db.product)
      ..where((p) => p.id.equals(productId));
    final product = await productQuery.getSingleOrNull();
    if (product == null) return null;

    final inventoryQuery = _db.select(_db.inventory)
      ..where((i) => i.productId.equals(productId));
    final inventoryRecords = await inventoryQuery.get();

    final batchQuery = _db.select(_db.spineBatch)
      ..where((b) => b.productId.equals(productId));
    final batches = await batchQuery.get();

    return InventoryItemData(
      product: product,
      stockEntries: inventoryRecords,
      batches: batches,
    );
  }

  @override
  Future<void> addInventoryItem(ProductData product) async {
    final InventoryData newInventoryRecord = InventoryData(
      id: const Uuid().v4(),
      productId: product.id,
      businessId: product.businessId,
      quantity: 0,

      syncStatus: 'pending',
      syncDate: DateTime.now(),


      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    await _db.into(_db.inventory).insert(newInventoryRecord);
  }

  @override
  Future<void> addStock({
    required String productId,
    required String businessId,
    required int bulkQuantity,
    required int pieceQuantity,
    required String totalCost,
    required int piecePrice,
    required int bulkPrice,
    DateTime? expiryDate,
  }) async {
    final batchId = const Uuid().v4();
    final now = DateTime.now();

    // 1. Create Batch
    final newBatch = SpineBatchData(
      id: batchId,
      productId: productId,
      expiryDate: expiryDate?.toUtc() ?? DateTime.now().toUtc(),
      costPricePerBulk: bulkPrice,
      costPricePerPiece: piecePrice,
      remainingQuantity: pieceQuantity,
      initialQuantity: pieceQuantity,
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

    final bulk = bulkQuantity;
    final pieces = pieceQuantity;
    final unitsPerBulk = product.unitsPerBulk;
    final totalUnits = (bulk * unitsPerBulk) + pieces;

    final newInventory = InventoryData(
      id: const Uuid().v4(),
      productId: productId,
      businessId: businessId,
      batchId: batchId,
      quantity: totalUnits,
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
      final costPrice = item.product.costPricePerUnit.toDouble();
      total += (costPrice * item.totalQuantity.toDouble());
    }
    return total;
  }

  @override
  Future<double> getEstProfit(String businessId) async {
    final products = await getInventoryItems(businessId);
    double total = 0.0;
    for (final item in products) {
      final costPrice = item.product.costPricePerUnit.toDouble();
      final sellingPrice = item.product.sellingPricePerPiece.toDouble();
      total += ((sellingPrice - costPrice) * item.totalQuantity.toDouble());
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
