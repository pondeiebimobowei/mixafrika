import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository_abstract.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:uuid/uuid.dart';
import 'package:spine/data/services/api/config/api_response.dart';


class InventoryRepository implements InventoryRepositoryAbstract {
  final AppDatabase _db;
  final ProductRepository productRepository;

  InventoryRepository(this._db, {required this.productRepository});

  @override
  Future<List<InventoryItemData>> getInventoryItems(String branchId) async {
    final query = _db.select(_db.inventory).join([
      innerJoin(_db.product, _db.product.id.equalsExp(_db.inventory.productId)),
      leftOuterJoin(
        _db.spineBatch,
        _db.spineBatch.productId.equalsExp(_db.product.id),
      ),
    ])..where(_db.inventory.branchId.equals(branchId));

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
          stockEntries: inv,
          batches: batch != null ? [batch] : [],
        );
      } else {
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
    final inventoryRecords = await inventoryQuery.getSingleOrNull();

    final batchQuery = _db.select(_db.spineBatch)
    ..where((b) =>
        b.productId.equals(productId) &
        b.remainingQuantity.isBiggerThanValue(0))
    ..orderBy([
      (b) => OrderingTerm(expression: b.expiryDate, mode: OrderingMode.asc),
      (b) => OrderingTerm(expression: b.createdAt, mode: OrderingMode.asc),
    ]);
    final batches = await batchQuery.get();

    return InventoryItemData(
      product: product,
      stockEntries: inventoryRecords,
      batches: batches,
    );
  }

  @override
  Future<ApiResponse<void>> addInventoryItem(ProductData product) async {
    try {
      final InventoryData newInventoryRecord = InventoryData(
      id: const Uuid().v4(),
      productId: product.id,
      branchId: product.branchId,
      quantity: 0,

      syncStatus: 'pending',

      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    await _db.into(_db.inventory).insert(newInventoryRecord);
    return ApiResponse(
      success: true, 
      message: 'Product added to inventory', 
      data: null);
    }catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to add product to inventory',
        data: null,
      );
    }
  }

  @override
  Future<void> addStock({
    required String productId,
    required String branchId,
    required int pieceQuantity,
    required String totalCost,
    required int piecePrice,
    required int bulkPrice,
    DateTime? expiryDate,
  }) async {
    final now = DateTime.now();

    // 1. Create Batch
    final newBatch = SpineBatchData(
      id: Uuid().v4(),
      productId: productId,
      expiryDate: expiryDate?.toUtc() ?? DateTime.now().toUtc(),
      costPricePerUnit: int.tryParse(totalCost) ?? 0,
      sellingPricePerBulk: bulkPrice,
      sellingPricePerPiece: piecePrice,
      remainingQuantity: pieceQuantity,
      initialQuantity: pieceQuantity,
      branchId: branchId,
      batchNumber: 'BATCH-${now.millisecondsSinceEpoch}',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: 'pending',
      syncDate: now,
    );

    final stockMovement = StockMovementData(
      id: Uuid().v4(), 
      syncStatus: 'pending', 
      createdAt: now, 
      updatedAt: now, 
      productId: productId, 
      branchId: branchId, 

      type: 'purchase', 
      quantity: pieceQuantity
    );
    
    await _db.into(_db.spineBatch).insert(newBatch);
    await _db.into(_db.stockMovement).insert(stockMovement);

    await _db.customUpdate(
      'UPDATE inventory SET quantity = quantity + ? WHERE product_id = ?',
      variables: [Variable.withInt(pieceQuantity), Variable.withString(productId)],
      updates: {_db.inventory}, // This tells Drift which table changed so watchers/streams update
    );

    await _db.customUpdate(
      'UPDATE product SET cost_price_per_unit = ? WHERE id = ?',
      variables: [Variable.withInt(int.tryParse(totalCost) ?? 0), Variable.withString(productId)],
      updates: {_db.product}, // This tells Drift which table changed so watchers/streams update
    );
  }

  @override
  Future<double> getStockWorth(String branchId) async {
    final products = await getInventoryItems(branchId);
    double total = 0.0;
    for (final item in products) {
      final costPrice = item.product.costPricePerUnit.toDouble();
      total += (costPrice * item.totalRemainingQuantity.toDouble());
    }
    return total;
  }

  @override
  Future<double> getEstProfit(String branchId) async {
    final products = await getInventoryItems(branchId);
    double total = 0.0;
    for (final item in products) {
      final costPrice = item.product.costPricePerUnit.toDouble();
      final sellingPrice = item.product.sellingPricePerPiece.toDouble();
      total += ((sellingPrice - costPrice) * item.totalRemainingQuantity.toDouble());
    }
    return total;
  }

  @override
  Future<List<InventoryItemData>> searchInventoryItems(
    String branchId,
    String query,
  ) async {
    final response = await _db.select(_db.inventory).join([
      innerJoin(_db.product, _db.product.id.equalsExp(_db.inventory.productId)),
      leftOuterJoin(
        _db.spineBatch,
        _db.spineBatch.productId.equalsExp(_db.product.id),
      ),
    ])
    ..where(_db.inventory.branchId.equals(branchId))
    ..where(
      _db.product.name.like('%$query%') 
      // |
      // _db.product.sku.like('%$query%') |
      // _db.product.description.like('%$query%'),
    );

    final rows = await response.get();

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
          stockEntries: inv,
          batches: batch != null ? [batch] : [],
        );
      } else {
        if (batch != null && !groupedItems[prod.id]!.batches.contains(batch)) {
          groupedItems[prod.id]!.batches.add(batch);
        }
      }
    }

    return groupedItems.values.toList();
  }
}

final inventoryRepositoryProvider = Provider<InventoryRepository>((ref) {
  return InventoryRepository(
    ref.watch(databaseProvider),
    productRepository: ref.watch(productRepositoryProvider),
  );
});
