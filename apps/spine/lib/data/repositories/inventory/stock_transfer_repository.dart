import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/stock_transfer_repository_abstract.dart';
import 'package:spine/drift/database.dart';
import 'package:uuid/uuid.dart';

class StockTransferRepository implements StockTransferRepositoryAbstract {
  final AppDatabase _db;

  StockTransferRepository(this._db);

  @override
  Future<List<BusinessesData>> getOtherBranches(currentBusinessId) async {
    return (await _db.select(_db.businesses).get())
        .where((b) => b.id != currentBusinessId)
        .toList();
  }

  @override
  Future<void> executeTransfer({
    required String productId,
    required String fromBranchId,
    required String toBranchId,
    required int quantity,
    required String reason,
    required String userId,
  }) async {
    if (quantity <= 0) {
      throw Exception("Quantity must be greater than 0");
    }

    if (fromBranchId == toBranchId) {
      throw Exception("Cannot transfer within the same branch");
    }

    await _db.transaction(() async {
      final transferId = const Uuid().v4();
      final now = DateTime.now();

      final productQuery = _db.select(_db.product)
        ..where((t) => t.id.equals(productId));
      final product = await productQuery.getSingleOrNull();

      if (product == null) {
        throw Exception('Product does not exist');
      }

      final globalProductId = product.globalProductId;

      final sourceBatches =
          await (_db.select(_db.spineBatch)
                ..where((t) => t.businessId.equals(fromBranchId))
                ..where((t) => t.productId.equals(productId))
                ..where((t) => t.remainingQuantity.isBiggerThanValue(0))
                ..orderBy([
                  (t) => OrderingTerm.asc(t.expiryDate),
                  (t) => OrderingTerm.asc(t.createdAt),
                ]))
              .get();

      final totalAvailable = sourceBatches.fold<int>(
        0,
        (sum, b) => sum + b.remainingQuantity,
      );

      if (totalAvailable < quantity) {
        throw Exception('Insufficient stock');
      }

      final updatedRows = await _db.customUpdate(
        'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND business_id = ? AND quantity >= ?',
        variables: [
          Variable.withInt(quantity),
          Variable.withString(productId),
          Variable.withString(fromBranchId),
          Variable.withInt(quantity),
        ],
        updates: {
          _db.inventory,
        }, // This tells Drift which table changed so watchers/streams update
      );

      if (updatedRows == 0) {
        throw Exception('Insufficient inventory or inventory record missing!');
      }

      final destProductQuery = _db.select(_db.product)
        ..where((t) => t.globalProductId.equals(globalProductId))
        ..where((t) => t.businessId.equals(toBranchId));
      final destProduct = await destProductQuery.getSingleOrNull();

      final newProductId;

      if (destProduct == null) {
        newProductId = const Uuid().v4();

        await _db
            .into(_db.product)
            .insert(
              ProductCompanion.insert(
                id: newProductId,
                bulkUnitName: product.bulkUnitName,
                businessId: toBranchId,
                globalProductId: globalProductId,
                name: product.name,
                pieceUnitName: product.pieceUnitName,
                sellingPricePerBulk: product.sellingPricePerBulk,
                sellingPricePerPiece: product.sellingPricePerPiece,
                unitsPerBulk: Value(product.unitsPerBulk),
                syncStatus: 'pending',
                createdAt: Value(now),
                updatedAt: Value(now),
                costPricePerUnit: product.costPricePerUnit,
                category: product.category,
                description: product.description,
                imageUrl: product.imageUrl,
                reviews: product.reviews,
              ),
            );

        await _db
            .into(_db.inventory)
            .insert(
              InventoryCompanion.insert(
                id: const Uuid().v4(),
                productId: newProductId,
                businessId: toBranchId,
                quantity: quantity,
                syncStatus: 'pending',
                createdAt: Value(now),
                updatedAt: Value(now),
              ),
            );
      } else {
        newProductId = destProduct.id;

        final rows = await _db.customUpdate(
          'UPDATE inventory SET quantity = quantity + ? WHERE product_id = ? AND business_id = ?',
          variables: [
            Variable.withInt(quantity),
            Variable.withString(destProduct.id),
            Variable.withString(toBranchId),
          ],
          updates: {
            _db.inventory,
          }, // This tells Drift which table changed so watchers/streams update
        );

        if (rows == 0) {
          // fallback insert (safety)
          await _db
              .into(_db.inventory)
              .insert(
                InventoryCompanion.insert(
                  id: const Uuid().v4(),
                  productId: newProductId,
                  businessId: toBranchId,
                  quantity: quantity,
                  syncStatus: 'pending',
                  createdAt: Value(now),
                  updatedAt: Value(now),
                ),
              );
        }
      }

      await _db
          .into(_db.stockTransfer)
          .insert(
            StockTransferCompanion.insert(
              id: transferId,
              syncStatus: 'pending',
              fromBranchId: fromBranchId,
              toBranchId: toBranchId,
              reason: reason,
              status: 'completed',
              createdBy: userId,
            ),
          );

      await _db
          .into(_db.stockTransferItem)
          .insert(
            StockTransferItemCompanion.insert(
              id: const Uuid().v4(),
              syncStatus: 'pending',
              transferId: transferId,
              productId: productId,
              quantity: quantity,
            ),
          );

      int remainingToTransfer = quantity;

      for (final batch in sourceBatches) {
        if (remainingToTransfer <= 0) break;

        final take = remainingToTransfer < batch.remainingQuantity
            ? remainingToTransfer
            : batch.remainingQuantity;

        // Deduct from source batch
        await (_db.update(
          _db.spineBatch,
        )..where((t) => t.id.equals(batch.id))).write(
          SpineBatchCompanion(
            remainingQuantity: Value(batch.remainingQuantity - take),
            updatedAt: Value(now),
          ),
        );

        // Track movement OUT
        await _db
            .into(_db.stockMovement)
            .insert(
              StockMovementCompanion.insert(
                id: const Uuid().v4(),
                syncStatus: 'pending',
                productId: productId,
                businessId: fromBranchId,
                type: 'transfer_out',
                quantity: take,
                batchId: Value(batch.id),
                referenceId: Value(transferId),
                notes: Value(reason),
                createdBy: Value(userId),
              ),
            );

        final existingDestBatch =
            await (_db.select(_db.spineBatch)
                  ..where((t) => t.businessId.equals(toBranchId))
                  ..where(
                    (t) => t.productId.equals(destProduct?.id ?? newProductId),
                  )
                  ..where(
                    (t) => t.costPricePerUnit.equals(batch.costPricePerUnit),
                  )
                  ..where((t) {
                    if (batch.expiryDate != null) {
                      return t.expiryDate.equals(batch.expiryDate!);
                    } else {
                      return t.expiryDate.isNull();
                    }
                  }))
                .getSingleOrNull();

        String destinationBatchId;

        if (existingDestBatch != null) {
          // ✅ Merge
          await (_db.update(
            _db.spineBatch,
          )..where((t) => t.id.equals(existingDestBatch.id))).write(
            SpineBatchCompanion(
              remainingQuantity: Value(
                existingDestBatch.remainingQuantity + take,
              ),
              updatedAt: Value(now),
            ),
          );

          destinationBatchId = existingDestBatch.id;
        } else {
          // ✅ Create new batch
          destinationBatchId = const Uuid().v4();

          await _db
              .into(_db.spineBatch)
              .insert(
                SpineBatchCompanion.insert(
                  id: destinationBatchId,
                  productId: newProductId,
                  businessId: toBranchId,
                  batchNumber: 'TRF-$transferId-${batch.id}',
                  expiryDate: Value(batch.expiryDate),
                  costPricePerUnit: batch.costPricePerUnit,
                  sellingPricePerPiece: batch.sellingPricePerPiece,
                  sellingPricePerBulk: batch.sellingPricePerBulk,
                  initialQuantity: take,
                  remainingQuantity: take,
                  syncStatus: 'pending',
                  createdAt: Value(now),
                  updatedAt: Value(now),
                ),
              );
        }

        //  Track movement IN
        await _db
            .into(_db.stockMovement)
            .insert(
              StockMovementCompanion.insert(
                id: const Uuid().v4(),
                syncStatus: 'pending',
                productId: destProduct?.id ?? newProductId,
                businessId: toBranchId,
                type: 'transfer_in',
                quantity: take,
                batchId: Value(destinationBatchId),
                referenceId: Value(transferId),
                notes: Value(reason),
                createdBy: Value(userId),
              ),
            );

        remainingToTransfer -= take;
      }
    });
  }
}

final stockTransferRepositoryProvider = Provider<StockTransferRepository>((
  ref,
) {
  return StockTransferRepository(ref.watch(databaseProvider));
});
