import 'package:spine/drift/database.dart';

/// Centralized factory for seeding deterministic test data for [SalesRepository]
/// integration tests. All methods use named parameters with sensible defaults
/// so each test only specifies the fields it cares about.
///
/// Seeding order matters due to foreign-key constraints:
///   Branch → GlobalProduct → Product → Inventory + SpineBatch → Sale → SalesItem / Payment
abstract final class SalesTestFactory {
  // ─── Shared constants ──────────────────────────────────────────────────────

  static final fixedNow = DateTime(2026, 4, 21, 12, 0, 0);

  static const testBranchId = 'branch_test1';
  static const testBusinessId = 'biz_test';

  // ─── Primitive seed helpers ────────────────────────────────────────────────

  static Future<BranchData> seedBranch(
    AppDatabase db, {
    String id = testBranchId,
    String businessId = testBusinessId,
    String name = 'Test Branch',
    bool isHeadOffice = true,
    String phone = '+234000',
  }) async {
    final record = BranchData(
      id: id,
      businessId: businessId,
      name: name,
      isHeadOffice: isHeadOffice,
      streetAddress: '1 Test St',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      phone: phone,
      syncStatus: 'synced',
      createdAt: fixedNow,
      updatedAt: fixedNow,
    );
    await db.into(db.branch).insert(record);
    return record;
  }

  static Future<GlobalProductData> seedGlobalProduct(
    AppDatabase db, {
    String id = 'gp_1',
    required String name,
    String barcode = 'BARCODE-001',
  }) async {
    return db.into(db.globalProduct).insertReturning(GlobalProductData(
      id: id,
      name: name,
      normalizedName: name.toLowerCase(),
      description: 'Test global product',
      barcode: barcode,
      syncStatus: 'pending',
      imageUrl: '',
      createdAt: fixedNow,
      updatedAt: fixedNow,
    ));
  }

  /// Seeds a [ProductData] with the given cost price. Returns the inserted row.
  static Future<ProductData> seedProduct(
    AppDatabase db, {
    String id = 'prod_1',
    String globalProductId = 'gp_1',
    String branchId = testBranchId,
    String name = 'Garri 1kg',
    int costPrice = 300,
    int sellingPricePerPiece = 500,
    int sellingPricePerBulk = 4500,
  }) async {
    return db.into(db.product).insertReturning(ProductData(
      id: id,
      globalProductId: globalProductId,
      branchId: branchId,
      name: name,
      description: 'Test product',
      bulkUnitName: 'Bag',
      pieceUnitName: 'Piece',
      unitsPerBulk: 10,
      costPricePerUnit: costPrice,
      sellingPricePerPiece: sellingPricePerPiece,
      sellingPricePerBulk: sellingPricePerBulk,
      category: 'Grains',
      imageUrl: '',
      reviews: '',
      syncStatus: 'pending',
      createdAt: fixedNow,
      updatedAt: fixedNow,
    ));
  }

  static Future<InventoryData> seedInventory(
    AppDatabase db, {
    required String productId,
    required String branchId,
    int quantity = 0,
  }) async {
    final record = InventoryData(
      id: 'inv_$productId',
      productId: productId,
      branchId: branchId,
      quantity: quantity,
      syncStatus: 'synced',
      createdAt: fixedNow,
      updatedAt: fixedNow,
    );
    await db.into(db.inventory).insert(record);
    return record;
  }

  /// Seeds a [SpineBatchData] with a given quantity. [id] is required so callers
  /// can reference it when building [SalesItemData].
  static Future<SpineBatchData> seedBatch(
    AppDatabase db, {
    required String id,
    required String productId,
    String branchId = testBranchId,
    int remainingQuantity = 50,
    int initialQuantity = 50,
    int costPricePerUnit = 300,
    int sellingPricePerPiece = 500,
    int sellingPricePerBulk = 4500,
    DateTime? expiryDate,
  }) async {
    return db.into(db.spineBatch).insertReturning(SpineBatchData(
      id: id,
      productId: productId,
      branchId: branchId,
      batchNumber: 'BATCH-$id',
      remainingQuantity: remainingQuantity,
      initialQuantity: initialQuantity,
      costPricePerUnit: costPricePerUnit,
      sellingPricePerPiece: sellingPricePerPiece,
      sellingPricePerBulk: sellingPricePerBulk,
      expiryDate: expiryDate,
      syncStatus: 'pending',
      createdAt: fixedNow,
      updatedAt: fixedNow,
      deletedAt: null,
      syncDate: fixedNow,
    ));
  }

  /// Seeds a [CustomerData] row and returns it.
  static Future<CustomerData> seedCustomer(
    AppDatabase db, {
    String id = 'cust_1',
    String name = 'Ada Obi',
    String? phone = '+2348000000001',
    String branchId = testBranchId,
  }) async {
    return db.into(db.customer).insertReturning(CustomerData(
      id: id,
      name: name,
      phone: phone,
      branchId: branchId,
      syncStatus: 'synced',
      syncDate: null,
      createdAt: fixedNow,
      updatedAt: fixedNow,
      deletedAt: null,
    ));
  }

  // ─── Builder helpers ───────────────────────────────────────────────────────

  /// Builds a [Sale] companion / data object — does NOT insert it.
  /// Pass this directly to [SalesRepository.createSale].
  static Sale buildSale({
    String id = 'sale_1',
    String branchId = testBranchId,
    String? customerId,
    int totalAmount = 1000,
    int amountPaid = 1000,
    int balance = 0,
    String paymentMethod = 'cash',
    String status = 'completed',
  }) {
    return Sale(
      id: id,
      branchId: branchId,
      customerId: customerId,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      balance: balance,
      paymentMethod: paymentMethod,
      status: status,
      note: null,
      createdBy: null,
      syncStatus: 'pending',
      syncDate: null,
      createdAt: fixedNow,
      updatedAt: fixedNow,
      deletedAt: null,
    );
  }

  /// Builds a product [SalesItemData] for a known batch — does NOT insert it.
  /// [SalesRepository.createSale] handles insertion via FIFO batch logic.
  static SalesItemData buildProductSaleItem({
    String id = 'item_1',
    required String saleId,
    required String productId,
    String name = 'Garri 1kg',
    int quantity = 1,
    int unitPrice = 500,
    int costPrice = 300,
  }) {
    return SalesItemData(
      id: id,
      saleId: saleId,
      productId: productId,
      batchId: null,
      name: name,
      quantity: quantity,
      type: 'product',
      unitPrice: unitPrice,
      costPrice: costPrice,
      total: unitPrice * quantity,
      description: null,
      syncStatus: 'pending',
      syncDate: null,
      createdAt: fixedNow,
      updatedAt: fixedNow,
      deletedAt: null,
    );
  }

  /// Builds a cash [Payment] row — does NOT insert it.
  static Payment buildPayment({
    String id = 'pay_1',
    required String saleId,
    int amount = 1000,
    String paymentMethod = 'cash',
    String status = 'confirmed',
    String? reference,
  }) {
    return Payment(
      id: id,
      saleId: saleId,
      amount: amount,
      paymentMethod: paymentMethod,
      status: status,
      reference: reference,
      syncStatus: 'pending',
      syncDate: null,
      createdAt: fixedNow,
      updatedAt: fixedNow,
      deletedAt: null,
    );
  }

  // ─── Composite helpers ─────────────────────────────────────────────────────

  /// Seeds the full prerequisite chain for a single product ready for sale:
  /// Branch → GlobalProduct → Product → Inventory → SpineBatch.
  ///
  /// Returns a record containing the seeded [ProductData] and [SpineBatchData].
  static Future<({ProductData product, SpineBatchData batch})> seedProductReadyForSale(
    AppDatabase db, {
    String productId = 'prod_1',
    String batchId = 'batch_1',
    String productName = 'Garri 1kg',
    int stockQuantity = 50,
    int costPrice = 300,
    String barcode = 'BARCODE-001',
    int sellingPricePerPiece = 500,
    bool skipBranch = false,
  }) async {
    if (!skipBranch) await seedBranch(db);
    await seedGlobalProduct(db, id: 'gp_$productId', barcode: barcode, name: productName);
    final product = await seedProduct(
      db,
      id: productId,
      globalProductId: 'gp_$productId',
      name: productName,
      costPrice: costPrice,
      sellingPricePerPiece: sellingPricePerPiece,
    );
    await seedInventory(db, productId: product.id, branchId: testBranchId, quantity: stockQuantity);
    final batch = await seedBatch(
      db,
      id: batchId,
      productId: product.id,
      remainingQuantity: stockQuantity,
      initialQuantity: stockQuantity,
      costPricePerUnit: costPrice,
      sellingPricePerPiece: sellingPricePerPiece,
    );
    return (product: product, batch: batch);
  }

  /// Seeds a full sale including items and payments in one go.
  /// Prerequisite: Products referenced in items must already be seeded.
  static Future<Sale> seedFullSale(
    AppDatabase db, {
    required Sale sale,
    required List<SalesItemData> items,
    required List<Payment> payments,
  }) async {
    await db.transaction(() async {
      await db.into(db.sales).insert(sale);
      for (final item in items) {
        await db.into(db.salesItem).insert(item);
      }
      for (final payment in payments) {
        await db.into(db.payments).insert(payment);
      }
    });
    return sale;
  }
}
