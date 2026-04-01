import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:uuid/uuid.dart';

class StockTransferRepository {
  final AppDatabase _db;

  StockTransferRepository(this._db);

  Future<List<UserBusinessData>> getOtherBranches(String currentBusinessId) async {
    return (await _db.select(_db.userBusiness).get())
        .where((b) => b.id != currentBusinessId)
        .toList();
  }

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

      // 1️⃣ Create Transfer Record
      await _db.into(_db.stockTransfer).insert(
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

      // 2️⃣ Create Transfer Item
      await _db.into(_db.stockTransferItem).insert(
            StockTransferItemCompanion.insert(
              id: const Uuid().v4(),
              syncStatus: 'pending',
              transferId: transferId,
              productId: productId,
              quantity: quantity,
            ),
          );

      // 3️⃣ Fetch Source Batches (FEFO: expiry → createdAt)
      final sourceBatches = await (_db.select(_db.spineBatch)
            ..where((t) => t.businessId.equals(fromBranchId))
            ..where((t) => t.productId.equals(productId))
            ..where((t) => t.remainingQuantity.isBiggerThanValue(0))
            ..orderBy([
              (t) => OrderingTerm.asc(t.expiryDate),
              (t) => OrderingTerm.asc(t.createdAt),
            ]))
          .get();

      int remainingToTransfer = quantity;

      // 4️⃣ Process Each Batch
      for (final batch in sourceBatches) {
        if (remainingToTransfer <= 0) break;

        final take = remainingToTransfer < batch.remainingQuantity
            ? remainingToTransfer
            : batch.remainingQuantity;

        // 🔹 Deduct from source batch
        await (_db.update(_db.spineBatch)
              ..where((t) => t.id.equals(batch.id)))
            .write(
          SpineBatchCompanion(
            remainingQuantity: Value(batch.remainingQuantity - take),
            updatedAt: Value(now),
          ),
        );

        // 🔹 Create transfer_out movement (PER BATCH)
      await _db.into(_db.stockMovement).insert(
            StockMovementCompanion.insert(
              id: const Uuid().v4(),
              syncStatus: 'pending',
              productId: productId,
              businessId: fromBranchId,
              type: 'transfer_out',
              quantity: take,
              
              // batchId: Value(batch.id),
              referenceId: Value(transferId),
              notes: Value(reason),
              createdBy: Value(userId),
            ),
          );

      // 🔹 Try to MERGE into existing destination batch
      final existingDestBatch = await (_db.select(_db.spineBatch)
        ..where((t) => t.businessId.equals(toBranchId))
        ..where((t) => t.productId.equals(productId))
        ..where((t) => t.costPricePerUnit.equals(batch.costPricePerUnit))
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
        // ✅ Merge into existing batch
        await (_db.update(_db.spineBatch)
              ..where((t) => t.id.equals(existingDestBatch.id)))
            .write(
          SpineBatchCompanion(
            remainingQuantity:
                Value(existingDestBatch.remainingQuantity + take),
            initialQuantity:
                Value(existingDestBatch.initialQuantity + take),
            updatedAt: Value(now),
          ),
        );

        destinationBatchId = existingDestBatch.id;
      } else {
        // ✅ Create new batch
        destinationBatchId = const Uuid().v4();

        await _db.into(_db.spineBatch).insert(
              SpineBatchCompanion.insert(
                id: destinationBatchId,
                productId: productId,
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

      // 🔹 Create transfer_in movement (PER BATCH)
      await _db.into(_db.stockMovement).insert(
            StockMovementCompanion.insert(
              id: const Uuid().v4(),
              syncStatus: 'pending',
              productId: productId,
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

    // 5️⃣ Final Validation
    if (remainingToTransfer > 0) {
      throw Exception('Insufficient stock for transfer');
    }
    });
  }
}

final stockTransferRepositoryProvider = Provider<StockTransferRepository>((ref) {
  return StockTransferRepository(ref.watch(databaseProvider));
});
