import 'package:spine/drift/database.dart';

abstract final class QaSeedFactory {
  static final now = DateTime(2026, 5, 21, 9, 0);

  static Future<BusinessesData> business(
    AppDatabase db, {
    String id = 'biz_qa',
    String name = 'QA Stores',
  }) {
    return db
        .into(db.businesses)
        .insertReturning(
          BusinessesData(
            id: id,
            name: name,
            type: 'retail',
            phone: '+2348000000000',
            streetAddress: '1 Market Road',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            isVerified: true,
            syncStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          ),
        );
  }

  static Future<BranchData> branch(
    AppDatabase db, {
    String id = 'branch_qa',
    String businessId = 'biz_qa',
    String name = 'Main Shop',
    bool isHeadOffice = false,
  }) {
    return db
        .into(db.branch)
        .insertReturning(
          BranchData(
            id: id,
            name: name,
            isHeadOffice: isHeadOffice,
            phone: '+2348000000001',
            streetAddress: '2 Market Road',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            businessId: businessId,
            syncStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          ),
        );
  }

  static Future<UserData> user(
    AppDatabase db, {
    String id = 'user_qa',
    String email = 'user@example.test',
  }) {
    return db
        .into(db.user)
        .insertReturning(
          UserData(
            id: id,
            userName: null,
            firstName: 'Test',
            lastName: 'User',
            email: email,
            password: 'local-password',
            role: 'staff',
            isEmailVerified: true,
            isVerified: true,
            avatar: null,
            creditScore: 0,
            creditScoreStatus: 'new',
            syncStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          ),
        );
  }

  static Future<GlobalProductData> globalProduct(
    AppDatabase db, {
    String id = 'global_qa',
    String name = 'Rice 5kg',
    String barcode = 'QA-BARCODE-001',
  }) {
    return db
        .into(db.globalProduct)
        .insertReturning(
          GlobalProductData(
            id: id,
            name: name,
            normalizedName: name.toLowerCase(),
            description: 'QA product',
            barcode: barcode,
            imageUrl: '',
            syncStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          ),
        );
  }

  static Future<ProductData> product(
    AppDatabase db, {
    String id = 'product_qa',
    String branchId = 'branch_qa',
    String globalProductId = 'global_qa',
    String name = 'Rice 5kg',
    int costPricePerUnit = 3000,
    int sellingPricePerPiece = 4000,
    int sellingPricePerBulk = 38000,
  }) {
    return db
        .into(db.product)
        .insertReturning(
          ProductData(
            id: id,
            name: name,
            description: 'QA product',
            bulkUnitName: 'Bag',
            pieceUnitName: 'Piece',
            unitsPerBulk: 10,
            costPricePerUnit: costPricePerUnit,
            sellingPricePerPiece: sellingPricePerPiece,
            sellingPricePerBulk: sellingPricePerBulk,
            category: 'Food',
            imageUrl: '',
            reviews: '',
            branchId: branchId,
            globalProductId: globalProductId,
            syncStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          ),
        );
  }

  static Future<InventoryData> inventory(
    AppDatabase db, {
    required String id,
    required String productId,
    required String branchId,
    int quantity = 0,
    DateTime? deletedAt,
  }) {
    return db
        .into(db.inventory)
        .insertReturning(
          InventoryData(
            id: id,
            quantity: quantity,
            productId: productId,
            branchId: branchId,
            deletedAt: deletedAt,
            syncStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          ),
        );
  }

  static Future<SpineBatchData> batch(
    AppDatabase db, {
    required String id,
    required String productId,
    required String branchId,
    int initialQuantity = 20,
    int remainingQuantity = 20,
    DateTime? expiryDate,
    String? batchNumber,
  }) {
    return db
        .into(db.spineBatch)
        .insertReturning(
          SpineBatchData(
            id: id,
            expiryDate: expiryDate,
            batchNumber: batchNumber ?? 'BATCH-$id',
            costPricePerUnit: 3000,
            sellingPricePerPiece: 4000,
            sellingPricePerBulk: 38000,
            initialQuantity: initialQuantity,
            remainingQuantity: remainingQuantity,
            productId: productId,
            branchId: branchId,
            syncStatus: 'pending',
            createdAt: now,
            updatedAt: now,
          ),
        );
  }

  static Future<void> businessWithBranchesAndUser(
    AppDatabase db, {
    String businessId = 'biz_qa',
    String fromBranchId = 'branch_from',
    String toBranchId = 'branch_to',
    String userId = 'user_qa',
  }) async {
    await business(db, id: businessId);
    await branch(
      db,
      id: fromBranchId,
      businessId: businessId,
      name: 'From Branch',
      isHeadOffice: true,
    );
    await branch(db, id: toBranchId, businessId: businessId, name: 'To Branch');
    await user(db, id: userId);
  }
}
