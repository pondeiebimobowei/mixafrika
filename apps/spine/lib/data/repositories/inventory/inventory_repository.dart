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
        _db.spineBatch.productId.equalsExp(_db.product.id) &
            _db.spineBatch.branchId.equalsExp(_db.inventory.branchId) &
            _db.spineBatch.deletedAt.isNull(),
      ),
    ])
      ..where(
        _db.inventory.branchId.equals(branchId) &
            _db.inventory.deletedAt.isNull() &
            _db.product.deletedAt.isNull(),
      );

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
      ..where((p) => p.id.equals(productId) & p.deletedAt.isNull());
    final product = await productQuery.getSingleOrNull();

    if (product == null) return null;

    final inventoryQuery = _db.select(_db.inventory)
      ..where(
        (i) =>
            i.productId.equals(productId) &
            i.branchId.equals(product.branchId) &
            i.deletedAt.isNull(),
      );
    final inventoryRecords = await inventoryQuery.getSingleOrNull();

    final batchQuery = _db.select(_db.spineBatch)
      ..where(
        (b) =>
            b.productId.equals(productId) &
            b.branchId.equals(product.branchId) &
            b.remainingQuantity.isBiggerThanValue(0),
      )
      ..where((b) => b.deletedAt.isNull())
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
        data: null,
      );
    } catch (e) {
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
    final totalCostInt = int.tryParse(totalCost) ?? 0;

    // Calculate cost per piece for accurate tracking
    final costPerPiece = pieceQuantity > 0
        ? (totalCostInt / pieceQuantity).round()
        : 0;

    // 1. Create Batch
    final newBatch = SpineBatchData(
      id: Uuid().v4(),
      productId: productId,
      expiryDate: expiryDate,
      costPricePerUnit: costPerPiece, // Storing cost per piece
      sellingPricePerBulk: bulkPrice,
      sellingPricePerPiece: piecePrice,
      remainingQuantity: pieceQuantity,
      initialQuantity: pieceQuantity,
      branchId: branchId,
      batchNumber: 'BATCH-${Uuid().v4()}',
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
      quantity: pieceQuantity,
    );

    await _db.into(_db.spineBatch).insert(newBatch);
    await _db.into(_db.stockMovement).insert(stockMovement);

    await _db.customUpdate(
      'UPDATE inventory SET quantity = quantity + ? WHERE product_id = ? AND branch_id = ? AND deleted_at IS NULL',
      variables: [
        Variable.withInt(pieceQuantity),
        Variable.withString(productId),
        Variable.withString(branchId),
      ],
      updates: {
        _db.inventory,
      }, // This tells Drift which table changed so watchers/streams update
    );

    await _db.customUpdate(
      'UPDATE product SET cost_price_per_unit = ? WHERE id = ?',
      variables: [
        Variable.withInt(costPerPiece), // Storing cost per piece as fallback
        Variable.withString(productId),
      ],
      updates: {
        _db.product,
      }, // This tells Drift which table changed so watchers/streams update
    );
  }

  @override
  Future<double> getStockWorth(String branchId) async {
    final inventoryItems = await getInventoryItems(branchId);
    double total = 0.0;
    for (final item in inventoryItems) {
      for (final batch in item.batches) {
        total +=
            (batch.costPricePerUnit.toDouble() *
            batch.remainingQuantity.toDouble());
      }
    }
    return total;
  }

  @override
  Future<double> getEstProfit(String branchId) async {
    final inventoryItems = await getInventoryItems(branchId);
    double total = 0.0;
    for (final item in inventoryItems) {
      for (final batch in item.batches) {
        final sellingPrice = batch.sellingPricePerPiece > 0
            ? batch.sellingPricePerPiece.toDouble()
            : item.product.sellingPricePerPiece.toDouble();

        total +=
            ((sellingPrice - batch.costPricePerUnit.toDouble()) *
            batch.remainingQuantity.toDouble());
      }
    }
    return total;
  }

  @override
  Future<List<InventoryItemData>> searchInventoryItems(
    String branchId,
    String query,
  ) async {
    final response = _db.select(_db.inventory).join([
      innerJoin(_db.product, _db.product.id.equalsExp(_db.inventory.productId)),
      leftOuterJoin(
        _db.spineBatch,
        _db.spineBatch.productId.equalsExp(_db.product.id) &
            _db.spineBatch.branchId.equalsExp(_db.inventory.branchId) &
            _db.spineBatch.deletedAt.isNull(),
      ),
    ])
      ..where(
        _db.inventory.branchId.equals(branchId) &
            _db.inventory.deletedAt.isNull() &
            _db.product.deletedAt.isNull(),
      )
      ..where(_db.product.name.lower().contains(query.toLowerCase()));

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
