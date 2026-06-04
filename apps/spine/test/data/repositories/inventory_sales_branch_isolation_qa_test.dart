import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/data/repositories/sales/sales_repository.dart';
import 'package:spine/drift/database.dart';

import 'qa_seed_factory.dart';

void main() {
  late AppDatabase db;
  late InventoryRepository inventoryRepository;
  late SalesRepository salesRepository;

  setUp(() async {
    db = AppDatabase(NativeDatabase.memory());
    inventoryRepository = InventoryRepository(
      db,
      productRepository: ProductRepository(database: db),
    );
    salesRepository = SalesRepository(db);

    await QaSeedFactory.businessWithBranchesAndUser(db);
    await QaSeedFactory.globalProduct(db);
    await QaSeedFactory.product(
      db,
      id: 'product_shared',
      branchId: 'branch_from',
    );
  });

  tearDown(() async {
    await db.close();
  });

  Future<Map<String, InventoryData>> inventoryByBranch() async {
    final rows = await (db.select(
      db.inventory,
    )..where((tbl) => tbl.productId.equals('product_shared'))).get();
    return {for (final row in rows) row.branchId: row};
  }

  Sale sale({
    String id = 'sale_qa',
    int totalAmount = 4000,
    int amountPaid = 4000,
    int balance = 0,
  }) {
    return Sale(
      id: id,
      customerId: null,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      balance: balance,
      paymentMethod: 'cash',
      status: 'completed',
      note: null,
      branchId: 'branch_from',
      createdById: 'user_qa',
      syncStatus: 'pending',
      createdAt: QaSeedFactory.now,
      updatedAt: QaSeedFactory.now,
    );
  }

  SalesItemData productSaleItem({
    String id = 'item_qa',
    required String saleId,
    int quantity = 1,
  }) {
    return SalesItemData(
      id: id,
      name: 'Rice 5kg',
      quantity: quantity,
      type: 'product',
      unitPrice: 4000,
      costPrice: 3000,
      total: 4000 * quantity,
      saleId: saleId,
      productId: 'product_shared',
      batchId: null,
      description: null,
      syncStatus: 'pending',
      createdAt: QaSeedFactory.now,
      updatedAt: QaSeedFactory.now,
    );
  }

  SalesItemData chargeSaleItem({
    String id = 'charge_qa',
    required String saleId,
    int amount = 250,
  }) {
    return SalesItemData(
      id: id,
      name: 'Delivery',
      quantity: 1,
      type: 'charge',
      unitPrice: amount,
      costPrice: 0,
      total: amount,
      saleId: saleId,
      productId: null,
      batchId: null,
      description: 'Delivery charge',
      syncStatus: 'pending',
      createdAt: QaSeedFactory.now,
      updatedAt: QaSeedFactory.now,
    );
  }

  group('Inventory and sales branch isolation', () {
    test('addStock mutates only the requested branch inventory row', () async {
      await QaSeedFactory.inventory(
        db,
        id: 'inv_from',
        productId: 'product_shared',
        branchId: 'branch_from',
        quantity: 10,
      );
      await QaSeedFactory.inventory(
        db,
        id: 'inv_to',
        productId: 'product_shared',
        branchId: 'branch_to',
        quantity: 5,
      );

      await inventoryRepository.addStock(
        productId: 'product_shared',
        branchId: 'branch_from',
        pieceQuantity: 7,
        totalCost: '21000',
        piecePrice: 4000,
        bulkPrice: 38000,
      );

      final byBranch = await inventoryByBranch();

      expect(byBranch['branch_from']!.quantity, 17);
      expect(
        byBranch['branch_to']!.quantity,
        5,
        reason:
            'Restocking one branch must not change stock in another branch.',
      );
    });

    test(
      'getInventoryItems does not hydrate batches from another branch',
      () async {
        await QaSeedFactory.inventory(
          db,
          id: 'inv_from',
          productId: 'product_shared',
          branchId: 'branch_from',
          quantity: 10,
        );
        await QaSeedFactory.batch(
          db,
          id: 'batch_from',
          productId: 'product_shared',
          branchId: 'branch_from',
          remainingQuantity: 10,
        );
        await QaSeedFactory.batch(
          db,
          id: 'batch_to',
          productId: 'product_shared',
          branchId: 'branch_to',
          remainingQuantity: 99,
        );

        final results = await inventoryRepository.getInventoryItems(
          'branch_from',
        );

        expect(results, hasLength(1));
        expect(
          results.single.batches.map((batch) => batch.branchId),
          everyElement('branch_from'),
          reason: 'Inventory reads must not attach another branch batch.',
        );
      },
    );

    test(
      'soft-deleted inventory is excluded from active inventory reads',
      () async {
        await QaSeedFactory.inventory(
          db,
          id: 'inv_deleted',
          productId: 'product_shared',
          branchId: 'branch_from',
          quantity: 10,
          deletedAt: QaSeedFactory.now,
        );

        final results = await inventoryRepository.getInventoryItems(
          'branch_from',
        );

        expect(
          results,
          isEmpty,
          reason: 'Rows with deletedAt should not appear as active stock.',
        );
      },
    );

    test('product sale deducts only the sale branch inventory row', () async {
      await QaSeedFactory.inventory(
        db,
        id: 'inv_from',
        productId: 'product_shared',
        branchId: 'branch_from',
        quantity: 20,
      );
      await QaSeedFactory.inventory(
        db,
        id: 'inv_to',
        productId: 'product_shared',
        branchId: 'branch_to',
        quantity: 15,
      );
      await QaSeedFactory.batch(
        db,
        id: 'batch_from',
        productId: 'product_shared',
        branchId: 'branch_from',
        remainingQuantity: 20,
      );

      await salesRepository.createSale(
        sale(id: 'sale_product', totalAmount: 8000, amountPaid: 8000),
        [productSaleItem(saleId: 'sale_product', quantity: 2)],
        [],
      );

      final byBranch = await inventoryByBranch();

      expect(byBranch['branch_from']!.quantity, 18);
      expect(
        byBranch['branch_to']!.quantity,
        15,
        reason: 'Selling from one branch must not deduct another branch stock.',
      );
    });

    test(
      'charge-only sale does not deduct product inventory or batch stock',
      () async {
        await QaSeedFactory.inventory(
          db,
          id: 'inv_from',
          productId: 'product_shared',
          branchId: 'branch_from',
          quantity: 20,
        );
        final batch = await QaSeedFactory.batch(
          db,
          id: 'batch_from',
          productId: 'product_shared',
          branchId: 'branch_from',
          remainingQuantity: 20,
        );

        await salesRepository.createSale(
          sale(id: 'sale_charge', totalAmount: 250, amountPaid: 250),
          [chargeSaleItem(saleId: 'sale_charge')],
          [],
        );

        final inventory = await (db.select(
          db.inventory,
        )..where((tbl) => tbl.id.equals('inv_from'))).getSingle();
        final updatedBatch = await (db.select(
          db.spineBatch,
        )..where((tbl) => tbl.id.equals(batch.id))).getSingle();

        expect(inventory.quantity, 20);
        expect(updatedBatch.remainingQuantity, 20);
      },
    );
  });
}
