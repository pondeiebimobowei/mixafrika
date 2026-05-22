import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/repositories/inventory/stock_transfer_repository.dart';
import 'package:spine/drift/database.dart';

import 'qa_seed_factory.dart';

void main() {
  late AppDatabase db;
  late StockTransferRepository repository;

  setUp(() async {
    db = AppDatabase(NativeDatabase.memory());
    repository = StockTransferRepository(db);

    await QaSeedFactory.businessWithBranchesAndUser(db);
    await QaSeedFactory.globalProduct(db);
    await QaSeedFactory.product(
      db,
      id: 'product_transfer',
      branchId: 'branch_from',
    );
    await QaSeedFactory.inventory(
      db,
      id: 'inv_from',
      productId: 'product_transfer',
      branchId: 'branch_from',
      quantity: 20,
    );
    await QaSeedFactory.batch(
      db,
      id: 'batch_from',
      productId: 'product_transfer',
      branchId: 'branch_from',
      initialQuantity: 20,
      remainingQuantity: 20,
      expiryDate: DateTime(2026, 12, 31),
    );
  });

  tearDown(() async {
    await db.close();
  });

  group('StockTransferRepository', () {
    test(
      'completed transfer moves stock, batches, transfer item, and movements atomically',
      () async {
        await repository.executeTransfer(
          productId: 'product_transfer',
          fromBranchId: 'branch_from',
          toBranchId: 'branch_to',
          quantity: 7,
          reason: 'Move to second stall',
          userId: 'user_qa',
        );

        final sourceInventory = await (db.select(
          db.inventory,
        )..where((tbl) => tbl.id.equals('inv_from'))).getSingle();
        final destProduct = await (db.select(
          db.product,
        )..where((tbl) => tbl.branchId.equals('branch_to'))).getSingle();
        final destInventory = await (db.select(
          db.inventory,
        )..where((tbl) => tbl.productId.equals(destProduct.id))).getSingle();
        final sourceBatch = await (db.select(
          db.spineBatch,
        )..where((tbl) => tbl.id.equals('batch_from'))).getSingle();
        final destBatch = await (db.select(
          db.spineBatch,
        )..where((tbl) => tbl.productId.equals(destProduct.id))).getSingle();
        final transfers = await db.select(db.stockTransfer).get();
        final transferItems = await db.select(db.stockTransferItem).get();
        final movements = await db.select(db.stockMovement).get();

        expect(sourceInventory.quantity, 13);
        expect(destInventory.quantity, 7);
        expect(sourceBatch.remainingQuantity, 13);
        expect(destBatch.remainingQuantity, 7);
        expect(transfers.single.status, 'completed');
        expect(transferItems.single.quantity, 7);
        expect(
          movements.map((movement) => movement.type),
          containsAll(['transfer_out', 'transfer_in']),
        );
        expect(
          movements.map((movement) => movement.referenceId).toSet(),
          {transfers.single.id},
          reason:
              'Transfer movements should be traceable to the transfer record.',
        );
      },
    );

    test('same branch transfer is rejected before stock mutation', () async {
      await expectLater(
        repository.executeTransfer(
          productId: 'product_transfer',
          fromBranchId: 'branch_from',
          toBranchId: 'branch_from',
          quantity: 3,
          reason: 'Invalid self transfer',
          userId: 'user_qa',
        ),
        throwsA(isA<Exception>()),
      );

      final sourceInventory = await (db.select(
        db.inventory,
      )..where((tbl) => tbl.id.equals('inv_from'))).getSingle();
      expect(sourceInventory.quantity, 20);
      expect(await db.select(db.stockTransfer).get(), isEmpty);
    });

    test(
      'insufficient source stock rolls back the transfer operation',
      () async {
        await expectLater(
          repository.executeTransfer(
            productId: 'product_transfer',
            fromBranchId: 'branch_from',
            toBranchId: 'branch_to',
            quantity: 25,
            reason: 'Too much stock',
            userId: 'user_qa',
          ),
          throwsA(isA<Exception>()),
        );

        final sourceInventory = await (db.select(
          db.inventory,
        )..where((tbl) => tbl.id.equals('inv_from'))).getSingle();
        final sourceBatch = await (db.select(
          db.spineBatch,
        )..where((tbl) => tbl.id.equals('batch_from'))).getSingle();

        expect(sourceInventory.quantity, 20);
        expect(sourceBatch.remainingQuantity, 20);
        expect(await db.select(db.stockTransfer).get(), isEmpty);
        expect(await db.select(db.stockMovement).get(), isEmpty);
      },
    );
  });
}
