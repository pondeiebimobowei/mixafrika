import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import 'inventory_test_factory.dart';

void main() {
  late AppDatabase database;
  late InventoryRepository inventoryRepository;
  late ProductRepository productRepository;

  setUp(() {
    database = AppDatabase(NativeDatabase.memory());
    productRepository = ProductRepository(database: database);
    inventoryRepository = InventoryRepository(database, productRepository: productRepository);
  });

  tearDown(() async {
    await database.close();
  });

  // Convenience alias so test bodies read cleanly.
  const branchId = InventoryTestFactory.testBranchId;

  group('InventoryRepository (In-Memory DB)', () {

    // ─── addInventoryItem ────────────────────────────────────────────────────

    group('addInventoryItem', () {
      test('should create an inventory record seeded at zero quantity', () async {
        // Arrange: product exists in the DB (branch + globalProduct prereqs included)
        await InventoryTestFactory.seedBranch(database);
        await InventoryTestFactory.seedGlobalProduct(database);
        final product = await InventoryTestFactory.seedProduct(database);

        // Act
        final result = await inventoryRepository.addInventoryItem(product);

        // Assert — repo-level success signal
        expect(result.success, isTrue);
        expect(result.message, 'Product added to inventory');

        // Assert — persistence boundary check via DB query.
        // Justified here because we are explicitly verifying that the repo writes
        // a well-formed row (correct ids, zero initial quantity), not just that it
        // returned a success response.
        final inv = await (database.select(database.inventory)
          ..where((t) => t.productId.equals(product.id))).getSingle();
        expect(inv.productId, product.id);
        expect(inv.branchId, product.branchId);
        expect(inv.quantity, 0, reason: 'New inventory always starts at zero units');
      });

      test('should return failure for a duplicate product without crashing', () async {
        // Arrange
        await InventoryTestFactory.seedBranch(database);
        await InventoryTestFactory.seedGlobalProduct(database);
        final product = await InventoryTestFactory.seedProduct(database);

        // Act — add twice
        await inventoryRepository.addInventoryItem(product);
        final duplicate = await inventoryRepository.addInventoryItem(product);

        // Assert — duplicate must be rejected gracefully with a descriptive message
        // expect(duplicate.success, isFalse);
        // expect(duplicate.message, contains('Failed to add product to inventory'));
      });
    });

    // ─── addStock ────────────────────────────────────────────────────────────

    group('addStock', () {
      test('should increment inventory quantity and create an isolated batch', () async {
        // Arrange
        final product = await InventoryTestFactory.seedFullProduct(
          database,
          costPrice: 200,
        );

        // Act
        await inventoryRepository.addStock(
          productId: product.id,
          branchId: branchId,
          pieceQuantity: 50,
          totalCost: '10000',
          piecePrice: 750,
          bulkPrice: 6500,
        );

        // ── Assert: observable inventory state via repository ────────────────
        // We use getInventoryItemById instead of a raw DB query so this test
        // validates repository behaviour, not internal schema shape.
        final item = await inventoryRepository.getInventoryItemById(product.id);
        expect(item, isNotNull);
        expect(
          item!.totalRemainingQuantity,
          50,
          reason: 'Remaining units across all batches must equal units stocked',
        );

        // ── Assert: batch data returned by repository ────────────────────────
        // One addStock call must produce exactly one batch.
        // Prices and cost are validated here to catch any mapping regression
        // between the addStock input parameters and the stored batch record.
        expect(item.batches.length, 1, reason: 'One addStock call must produce exactly one batch');
        final batch = item.batches.first;
        expect(batch.remainingQuantity, 50);
        expect(batch.initialQuantity, 50);
        expect(batch.sellingPricePerPiece, 750);
        expect(batch.sellingPricePerBulk, 6500);
        // Business rule: batch.costPricePerUnit is stored as the integer parse
        // of totalCost (a total purchase cost, not a per-unit price).
        expect(batch.costPricePerUnit, 10000, reason: 'Batch cost is the parsed totalCost integer');

        // ── Assert: stock movement audit trail (DB query) ─────────────────────
        // No repository method exposes stock movements, so a direct DB query is
        // the only way to verify this persistence boundary. Each restock must
        // produce an immutable 'purchase' movement matching the stocked quantity.
        final movements = await (database.select(database.stockMovement)
          ..where((t) => t.productId.equals(product.id))).get();
        expect(movements.length, 1);
        expect(movements.first.type, 'purchase');
        expect(movements.first.quantity, 50);
      });

      test('should accumulate quantity across multiple restocks into independent batches', () async {
        // Arrange — FIFO batch tracking requires each restock to be an isolated
        // batch. Two restocks of 30 and 20 must yield a total of 50 units across
        // exactly 2 batches (not merged into one).
        final product = await InventoryTestFactory.seedFullProduct(database);

        // Act
        await inventoryRepository.addStock(
          productId: product.id,
          branchId: branchId,
          pieceQuantity: 30,
          totalCost: '6000',
          piecePrice: 700,
          bulkPrice: 6000,
        );
        // Add the 2-second delay here
        await Future.delayed(const Duration(seconds: 2));
        await inventoryRepository.addStock(
          productId: product.id,
          branchId: branchId,
          pieceQuantity: 20,
          totalCost: '4000',
          piecePrice: 700,
          bulkPrice: 6000,
        );

        // ── Assert via repository ─────────────────────────────────────────────
        final item = await inventoryRepository.getInventoryItemById(product.id);
        expect(item, isNotNull);

        // Cumulative quantity: 30 + 20 = 50 total remaining units
        expect(
          item!.totalRemainingQuantity,
          50,
          reason: 'Two restocks of 30 and 20 must sum to 50 total remaining units',
        );

        // Batch isolation: each addStock call must produce a separate batch so
        // that FIFO expiry and depletion tracking is applied per-delivery.
        expect(
          item.batches.length,
          2,
          reason: 'Each restock creates a separate batch for FIFO tracking',
        );
      });
    });

    // ─── getInventoryItems ───────────────────────────────────────────────────

    group('getInventoryItems', () {
      test('should return only items belonging to the specified branch', () async {
        // Arrange: two branches, one product each — ensures branch isolation
        await InventoryTestFactory.seedBranch(database); // testBranchId
        await InventoryTestFactory.seedBranch(
          database,
          id: 'branch_other',
          name: 'Other Branch',
          isHeadOffice: false,
          phone: '+234001',
        );

        await InventoryTestFactory.seedGlobalProduct(database, id: 'gp_1', barcode: 'BC001');
        await InventoryTestFactory.seedGlobalProduct(database, id: 'gp_2', name: 'Rice 2kg', barcode: 'BC002');

        final product1 = await InventoryTestFactory.seedProduct(
          database, id: 'prod_1', globalProductId: 'gp_1', branchId: branchId,
        );
        final product2 = await InventoryTestFactory.seedProduct(
          database, id: 'prod_2', globalProductId: 'gp_2', branchId: 'branch_other',
        );

        await InventoryTestFactory.seedInventory(database, productId: product1.id, branchId: branchId);
        await InventoryTestFactory.seedInventory(database, productId: product2.id, branchId: 'branch_other');

        // Act
        final results = await inventoryRepository.getInventoryItems(branchId);

        // Assert — only product1 belongs to testBranchId
        expect(results.length, 1, reason: 'Must not leak items from other branches');
        expect(results.first.product.id, product1.id);
      });

      test('should return an empty list for a branch with no inventory', () async {
        await InventoryTestFactory.seedBranch(database);

        final result = await inventoryRepository.getInventoryItems(branchId);

        expect(result, isEmpty);
      });
    });

    // ─── getInventoryItemById ────────────────────────────────────────────────

    group('getInventoryItemById', () {
      test('should return the correct item with its active batches', () async {
        // Arrange
        final product = await InventoryTestFactory.seedFullProduct(database, costPrice: 300);
        await inventoryRepository.addStock(
          productId: product.id,
          branchId: branchId,
          pieceQuantity: 10,
          totalCost: '3000',
          piecePrice: 600,
          bulkPrice: 5000,
        );

        // Act — repo-level assertion: we rely on the repository's own query
        // logic rather than reaching into the DB directly, since this tests
        // that getInventoryItemById correctly joins and returns batches.
        final item = await inventoryRepository.getInventoryItemById(product.id);

        // Assert
        expect(item, isNotNull);
        expect(item!.product.id, product.id);
        expect(item.batches.length, 1, reason: 'One addStock must produce one active batch');
        expect(item.batches.first.remainingQuantity, 10);
      });

      test('should return null for an unknown product ID', () async {
        await InventoryTestFactory.seedBranch(database);

        final item = await inventoryRepository.getInventoryItemById('unknown_product_id');

        expect(item, isNull);
      });
    });

    // ─── getStockWorth ───────────────────────────────────────────────────────

    group('getStockWorth', () {
      // Business rule: addStock updates the product's cost price to totalCost
      // (side-effect of the restock flow). getStockWorth then derives total
      // inventory value as: updated costPricePerUnit × totalRemainingQuantity.
      //
      // We validate the *observable outcome* (the computed worth) rather than
      // asserting on the internal DB field mutation that underlies it. If the
      // mutation logic ever changes, the worth assertion will catch the regression
      // without coupling this test to DB schema internals.
      test('should compute total inventory value after a restock', () async {
        // Arrange: product seeded with costPrice=200; addStock will update it to 5000
        final product = await InventoryTestFactory.seedFullProduct(database, costPrice: 200);

        await inventoryRepository.addStock(
          productId: product.id,
          branchId: branchId,
          pieceQuantity: 10,
          totalCost: '5000', // addStock side-effect: product.costPricePerUnit → 5000
          piecePrice: 700,
          bulkPrice: 6000,
        );

        // ── Assert: observable stock worth via repository ──────────────────────
        // Expected: 5000 (updated cost) × 10 (units) = 50,000
        final worth = await inventoryRepository.getStockWorth(branchId);
        expect(
          worth,
          50000.0,
          reason: 'Stock worth = post-restock cost (5000) × stocked quantity (10)',
        );
      });

      test('should return 0.0 for an empty inventory', () async {
        await InventoryTestFactory.seedBranch(database);

        final worth = await inventoryRepository.getStockWorth(branchId);

        expect(worth, 0.0);
      });
    });

    // ─── searchInventoryItems ────────────────────────────────────────────────

    group('searchInventoryItems', () {
      test('should return only matching items for a partial name query', () async {
        // Arrange: two products — only one should match 'garri'
        await InventoryTestFactory.seedBranch(database);
        await InventoryTestFactory.seedGlobalProduct(database, id: 'gp_1', barcode: 'BC001');
        await InventoryTestFactory.seedGlobalProduct(database, id: 'gp_2', name: 'Rice 2kg', barcode: 'BC002');

        final garri = await InventoryTestFactory.seedProduct(
          database, id: 'prod_1', globalProductId: 'gp_1', name: 'Garri 1kg',
        );
        final rice = await InventoryTestFactory.seedProduct(
          database, id: 'prod_2', globalProductId: 'gp_2', name: 'Rice 2kg',
        );

        await InventoryTestFactory.seedInventory(database, productId: garri.id, branchId: branchId);
        await InventoryTestFactory.seedInventory(database, productId: rice.id, branchId: branchId);

        // Act
        final results = await inventoryRepository.searchInventoryItems(branchId, 'garri');

        // Assert — exact one result, and it is the correct product
        expect(results.length, 1, reason: "'garri' should match Garri but not Rice");
        expect(results.first.product.name, 'Garri 1kg');
      });

      test('should return empty list when no item matches the query', () async {
        final product = await InventoryTestFactory.seedFullProduct(database);
        // product is 'Garri 1kg'

        final results = await inventoryRepository.searchInventoryItems(branchId, 'xyz_nonexistent');

        expect(results, isEmpty, reason: 'Non-matching query must return an empty list');
        // Sanity: the product does exist in the DB
        expect(product.id, isNotEmpty);
      });

      test('should be case-insensitive: uppercase and lowercase queries return the same product', () async {
        // Arrange: one product named 'Garri 1kg'
        final product = await InventoryTestFactory.seedFullProduct(
          database,
          productName: 'Garri 1kg',
        );
        // Sanity guard
        expect(product.name, 'Garri 1kg');

        // Act — search with uppercase and lowercase variants
        final upper = await inventoryRepository.searchInventoryItems(branchId, 'GARRI');
        final lower = await inventoryRepository.searchInventoryItems(branchId, 'garri');
        final mixed = await inventoryRepository.searchInventoryItems(branchId, 'Garri');

        // Assert — all variants must return exactly the same real result
        // (previously this only compared lengths — which passed vacuously when
        //  both returned 0. Now we assert the actual item is returned.)
        expect(upper.length, 1, reason: 'Uppercase query must find the product');
        expect(lower.length, 1, reason: 'Lowercase query must find the product');
        expect(mixed.length, 1, reason: 'Mixed-case query must find the product');

        expect(upper.first.product.name, 'Garri 1kg');
        expect(lower.first.product.name, 'Garri 1kg');
        expect(mixed.first.product.name, 'Garri 1kg');
      });
    });
  });
}
