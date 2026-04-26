import 'package:spine/drift/database.dart';

/// Centralized factory for seeding deterministic test data into an in-memory
/// [AppDatabase]. All helpers use named parameters with sensible defaults so
/// each test only needs to specify the fields it cares about.
///
/// Using a shared factory keeps tests concise, reduces copy-paste drift, and
/// makes future schema changes easier to fix in a single place.
abstract final class InventoryTestFactory {
  // ─── Shared constants ──────────────────────────────────────────────────────

  /// Fully deterministic timestamp used across all seeded rows.
  /// Avoids any hidden dependency on [DateTime.now()] in test data.
  static final fixedNow = DateTime(2026, 4, 21, 12, 0, 0);

  static const testBranchId = 'branch_test';
  static const testBusinessId = 'biz_test';

  // ─── Seed helpers ──────────────────────────────────────────────────────────

  /// Seeds a [BranchData] row and returns it.
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

  /// Seeds a [GlobalProductData] row and returns it.
  static Future<GlobalProductData> seedGlobalProduct(
    AppDatabase db, {
    String id = 'gp_1',
    String name = 'Garri 1kg',
    String barcode = 'BARCODE-001',
  }) async {
    return db.into(db.globalProduct).insertReturning(GlobalProductData(
      id: id,
      name: name,
      normalizedName: name.toLowerCase(),
      description: 'A test global product',
      barcode: barcode,
      syncStatus: 'pending',
      imageUrl: '',
      createdAt: fixedNow,
      updatedAt: fixedNow,
    ));
  }

  /// Seeds a [ProductData] row and returns it.
  static Future<ProductData> seedProduct(
    AppDatabase db, {
    String id = 'prod_1',
    String globalProductId = 'gp_1',
    String branchId = testBranchId,
    String name = 'Garri 1kg',
    int costPrice = 500,
    int sellingPricePerPiece = 700,
    int sellingPricePerBulk = 5000,
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

  /// Seeds an [InventoryData] row with zero quantity by default and returns it.
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

  // ─── Composite helpers ─────────────────────────────────────────────────────

  /// Seeds the minimum prerequisites a product + inventory test needs:
  /// one branch, one global product, one product, one inventory row.
  ///
  /// Returns the seeded [ProductData] so callers can reference it without
  /// re-querying the database.
  static Future<ProductData> seedFullProduct(
    AppDatabase db, {
    String productId = 'prod_1',
    String globalProductId = 'gp_1',
    String barcode = 'BARCODE-001',
    String productName = 'Garri 1kg',
    int costPrice = 500,
    int sellingPricePerPiece = 700,
    int sellingPricePerBulk = 5000,
    int initialQuantity = 0,
  }) async {
    await seedBranch(db);
    await seedGlobalProduct(db, id: globalProductId, barcode: barcode);
    final product = await seedProduct(
      db,
      id: productId,
      globalProductId: globalProductId,
      name: productName,
      costPrice: costPrice,
      sellingPricePerPiece: sellingPricePerPiece,
      sellingPricePerBulk: sellingPricePerBulk,
    );
    await seedInventory(db, productId: product.id, branchId: testBranchId, quantity: initialQuantity);
    return product;
  }
}
