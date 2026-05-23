import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/repositories/sales/sales_repository.dart';
import 'package:spine/drift/database.dart';
import '../business/business_test_factory.dart';
import '../constants.dart';
import 'sales_test_factory.dart';

void main() {
  late AppDatabase database;
  late SalesRepository salesRepository;

  setUp(() {
    database = AppDatabase(NativeDatabase.memory());
    salesRepository = SalesRepository(database);
  });

  tearDown(() async {
    await database.close();
  });

  const branchId = SalesTestFactory.testBranchId;

  group('SalesRepository (In-Memory DB) - Integration Tests', () {

    // ─── createSale ──────────────────────────────────────────────────────────

    group('createSale', () {
      test('should persist sale, deduct one batch, and record payment for a simple sale', () async {
        // Arrange
        final (:product, :batch) = await SalesTestFactory.seedProductReadyForSale(
          database,
          stockQuantity: 50,
          costPrice: 300,
          batchId: 'batch_7',
          productName: 'Rice 12kg',
          barcode: '123456789016',
          sellingPricePerPiece: 500,
        );

        final sale = SalesTestFactory.buildSale(
          id: 'sale_1',
          branchId: branchId,
          totalAmount: 500,
          amountPaid: 500,
        );
        final item = SalesTestFactory.buildProductSaleItem(
          id: 'item_1',
          saleId: sale.id,
          productId: product.id,
          quantity: 5,
          unitPrice: 500,
          costPrice: 300,
        );
        final payment = SalesTestFactory.buildPayment(
          id: 'pay_1',
          saleId: sale.id,
          amount: 500,
        );

        // Act
        await salesRepository.createSale(sale, [item], [payment]);

        // ── Assert: observable behavior via repository ────────────────────────
        final result = await salesRepository.getSaleById(sale.id);
        expect(result, isNotNull);
        expect(result!.sale.id, sale.id);
        expect(result.payments.length, 1);
        expect(result.payments.first.amount, 500);

        // ── Assert: persistence boundaries (unexposed by repo) ───────────────
        // Batch remaining quantity: 50 original - 5 sold = 45
        final updatedBatch = await (database.select(database.spineBatch)
          ..where((b) => b.id.equals(batch.id))).getSingle();
        expect(updatedBatch.remainingQuantity, 45);

        // Inventory total quantity: 50 original - 5 sold = 45
        final inv = await (database.select(database.inventory)
          ..where((t) => t.productId.equals(product.id))).getSingle();
        expect(inv.quantity, 45);
      });

      test('should deplete multiple batches in FIFO order when quantity spans batches', () async {
        // Arrange: two batches — batch_a (older/lower id) has 10 units, batch_b has 20.
        // Selling 15 must deplete all 10 from batch_a first, then 5 from batch_b.
        await SalesTestFactory.seedBranch(database);
        await SalesTestFactory.seedGlobalProduct(database, id: 'gp_1', name: 'Garri 1kg');
        final product = await SalesTestFactory.seedProduct(database, id: 'prod_1', globalProductId: 'gp_1', costPrice: 300);
        await SalesTestFactory.seedInventory(database, productId: product.id, branchId: branchId, quantity: 30);

        final batchA = await SalesTestFactory.seedBatch(
          database,
          id: 'batch_a',
          productId: product.id,
          remainingQuantity: 10,
          initialQuantity: 10,
        );
        final batchB = await SalesTestFactory.seedBatch(
          database,
          id: 'batch_b',
          productId: product.id,
          remainingQuantity: 20,
          initialQuantity: 20,
        );

        final sale = SalesTestFactory.buildSale(id: 'sale_2', totalAmount: 7500);
        final item = SalesTestFactory.buildProductSaleItem(
          id: 'item_20',
          saleId: sale.id,
          productId: product.id,
          quantity: 15,
          unitPrice: 500,
        );

        // Act
        await salesRepository.createSale(sale, [item], []);

        // ── Assert: FIFO deduction ─────────────────────────────────────────
        final updatedA = await (database.select(database.spineBatch)
          ..where((b) => b.id.equals(batchA.id))).getSingle();
        final updatedB = await (database.select(database.spineBatch)
          ..where((b) => b.id.equals(batchB.id))).getSingle();

        expect(updatedA.remainingQuantity, 0,
          reason: 'batch_a (older) must be fully depleted first');
        expect(updatedB.remainingQuantity, 15,
          reason: 'batch_b must supply the remaining 5 units');

        // Total inventory reflects the full 15 sold: 30 original - 15 sold = 15 remaining
        final inv = await (database.select(database.inventory)
          ..where((t) => t.productId.equals(product.id))).getSingle();
        expect(inv.quantity, 15);
      });

      test('should throw and roll back the entire transaction on insufficient stock', () async {
        // Arrange
        final (:product, batch: _) = await SalesTestFactory.seedProductReadyForSale(
          database,
          barcode: '123456789017',
          productName: 'Rice 15kg',
          batchId: 'batch_1',
          stockQuantity: 5,
        );

        final sale = SalesTestFactory.buildSale(id: 'sale_fail', totalAmount: 5000);
        final item = SalesTestFactory.buildProductSaleItem(
          id: 'item_fail',
          saleId: sale.id,
          productId: product.id,
          quantity: 10, // exceeds available stock
          unitPrice: 500,
        );
        final payment = SalesTestFactory.buildPayment(id: 'pay_fail', saleId: sale.id, amount: 5000);

        // Act & Assert
        await expectLater(
          salesRepository.createSale(sale, [item], [payment]),
          throwsA(isA<Exception>()),
        );

        // ── Assert: Full Transaction Rollback ──────────────────────────────
        // 1. No sale record
        final result = await salesRepository.getSaleById(sale.id);
        expect(result, isNull, reason: 'Sale record must not be persisted on failure');

        // 2. No independent records in other tables
        final salesItems = await database.select(database.salesItem).get();
        expect(salesItems, isEmpty, reason: 'SalesItem record must not be persisted on failure');

        final payments = await database.select(database.payments).get();
        expect(payments, isEmpty, reason: 'Payment record must not be persisted on failure');

        // 3. Stock levels remain untouched
        final inv = await (database.select(database.inventory)
          ..where((t) => t.productId.equals(product.id))).getSingle();
        expect(inv.quantity, 5, reason: 'Inventory stock must not be deducted on failure');
      });

      test('should correctly link a customer to a sale', () async {
        // Arrange
        final (:product, batch: _) = await SalesTestFactory.seedProductReadyForSale(database, stockQuantity: 20, productName: 'Bread 1kg', batchId: 'batch_2', barcode: '123456789018');
        final customer = await SalesTestFactory.seedCustomer(database);

        final sale = SalesTestFactory.buildSale(id: 'sale_cust', customerId: customer.id);
        final item = SalesTestFactory.buildProductSaleItem(
          id: 'item_cust',
          saleId: sale.id,
          productId: product.id,
        );

        // Act
        await salesRepository.createSale(sale, [item], []);

        // ── Assert via Repository ──────────────────────────────────────────
        final result = await salesRepository.getSaleById(sale.id);
        expect(result, isNotNull);
        expect(result!.customer, isNotNull);
        expect(result.customer!.id, customer.id);
      });
    });

    // ─── getSalesWithItems ───────────────────────────────────────────────────

    group('getSalesWithItems', () {
      test('should return all sales with hydrated items and payments for a branch', () async {
        // Arrange
        final (:product, batch: _) = await SalesTestFactory.seedProductReadyForSale(database, stockQuantity: 100, productName: 'Rice 8kg', batchId: 'batch_8', barcode: '123456789014');
        
        final sale1 = SalesTestFactory.buildSale(id: 's1', totalAmount: 500);
        final item1 = SalesTestFactory.buildProductSaleItem(id: 'i1', saleId: 's1', productId: product.id);
        
        final sale2 = SalesTestFactory.buildSale(id: 's2', totalAmount: 1000);
        final item2 = SalesTestFactory.buildProductSaleItem(id: 'i2', saleId: 's2', productId: product.id);
        final payment2 = SalesTestFactory.buildPayment(id: 'p2', saleId: 's2', amount: 1000);

        await salesRepository.createSale(sale1, [item1], []);
        await salesRepository.createSale(sale2, [item2], [payment2]);

        // Act
        final results = await salesRepository.getSalesWithItems(branchId: branchId);

        // Assert
        expect(results.length, 2);
        final s2 = results.firstWhere((r) => r.sale.id == 's2');
        expect(s2.items.length, 1);
        expect(s2.payments.length, 1);
      });

      test('should filter sales by branchId ensuring branch isolation', () async {
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId1 );
        
        // Arrange
        await SalesTestFactory.seedBranch(database, id: 'branches_1');
        await SalesTestFactory.seedBranch(database, id: 'b2');

        final (product:p2, batch: _) = await SalesTestFactory.seedProductReadyForSale(database, skipBranch: true, productId: Constants.productId, productName: 'Garri 1kg', batchId: 'batch_3', barcode: '123456789013', stockQuantity: 100);
        final (product: p1, batch: _) = await SalesTestFactory.seedProductReadyForSale(database, productId: Constants.productId2, productName: 'Rice 5kg', batchId: 'batch_4', barcode: '000000000000', stockQuantity: 100);

        final sale1 = SalesTestFactory.buildSale(id: 'sale_b1', branchId: 'b1');
        final sale2 = SalesTestFactory.buildSale(id: 'sale_b2', branchId: 'b2');

        // final saleItem1 = SalesTestFactory.buildProductSaleItem(id: 'sale_b1', saleId: 'sale_b1');
        // final saleItem2 = SalesTestFactory.buildProductSaleItem(id: 'sale_b2', saleId: 'sale_b2');

        
        final saleItem1 = SalesTestFactory.buildProductSaleItem(id: 'sale_b1', saleId: 'sale_b1', productId: Constants.productId);
        final saleItem2 = SalesTestFactory.buildProductSaleItem(id: 'sale_b2', saleId: 'sale_b2', productId: Constants.productId2,);

        // Manual seed for speed/isolation in this test
        await database.into(database.sales).insert(sale1);
        await database.into(database.sales).insert(sale2);

        await database.into(database.salesItem).insert(saleItem1);
        await database.into(database.salesItem).insert(saleItem2);

        // await database.into(database.payments).insert(payment1);
        // await database.into(database.payments).insert(payment2);

        // Act
        final resultsB1 = await salesRepository.getSalesWithItems(branchId: 'b1');

        // Assert
        expect(resultsB1.length, 1);
        expect(resultsB1.first.sale.id, 'sale_b1');
      });
    });

    // ─── getSaleById ─────────────────────────────────────────────────────────

    group('getSaleById', () {
      test('should return correct sale with full joins or null if missing', () async {
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId1 );
        
        // Arrange
        final (:product, batch: _) = await SalesTestFactory.seedProductReadyForSale(database, stockQuantity: 20, batchId: 'batch_6', productName: 'Rice 2kg', barcode: '123456789015');
        final sale = SalesTestFactory.buildSale(id: 'sale_found');
        final item = SalesTestFactory.buildProductSaleItem(id: 'item_found', saleId: 'sale_found', productId: product.id);
        
        await salesRepository.createSale(sale, [item], []);

        // Act
        final found = await salesRepository.getSaleById('sale_found');
        final missing = await salesRepository.getSaleById('missing');

        // Assert
        expect(found, isNotNull);
        expect(found!.sale.id, 'sale_found');
        expect(found.items.first.product, isNotNull, reason: 'Product must be joined');
        expect(missing, isNull);
      });
    });
  });
}
