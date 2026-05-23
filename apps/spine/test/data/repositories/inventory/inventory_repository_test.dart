import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import '../constants.dart';
import 'inventory_test_factory.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late AppDatabase database;
  late ProductRepository productRepository;
  late InventoryRepository repository;

  const branchId = Constants.testBranchId;

  setUp(() {
    database = AppDatabase(
      NativeDatabase.memory(),
    );

    productRepository = ProductRepository(
      database: database,
    );

    repository = InventoryRepository(
      database,
      productRepository: productRepository,
    );
  });

  tearDown(() async {
    await database.close();
  });

  group('InventoryRepository', () {
    group('addInventoryItem', () {
      
    });

    group('addStock', () {
      test(
        'creates isolated stock batch and updates inventory totals',
        () async {
          // Arrange
          final product =
              await InventoryTestFactory
                  .seedFullProduct(database);

          // Act
          await repository.addStock(
            productId: product.id,
            branchId: branchId,
            pieceQuantity: 50,
            totalCost: '10000',
            piecePrice: 750,
            bulkPrice: 6500,
          );

          // Assert
          final item =
              await repository
                  .getInventoryItemById(
            product.id,
          );

          expect(item, isNotNull);

          expect(
            item!.totalRemainingQuantity,
            50,
          );

          expect(
            item.batches.length,
            1,
          );

          final batch = item.batches.first;

          expect(
            batch.initialQuantity,
            50,
          );

          expect(
            batch.remainingQuantity,
            50,
          );

          expect(
            batch.sellingPricePerPiece,
            750,
          );

          expect(
            batch.sellingPricePerBulk,
            6500,
          );

          // expect(
          //   batch.costPricePerUnit,
          //   10000,
          // );
        },
      );

      test(
        'accumulates quantity across multiple independent batches',
        () async {
          // Arrange
          final product =
              await InventoryTestFactory
                  .seedFullProduct(database);

          // Act
          await repository.addStock(
            productId: product.id,
            branchId: branchId,
            pieceQuantity: 30,
            totalCost: '6000',
            piecePrice: 700,
            bulkPrice: 6000,
          );

          await repository.addStock(
            productId: product.id,
            branchId: branchId,
            pieceQuantity: 20,
            totalCost: '4000',
            piecePrice: 700,
            bulkPrice: 6000,
          );

          // Assert
          final item =
              await repository
                  .getInventoryItemById(
            product.id,
          );

          expect(item, isNotNull);

          expect(
            item!.totalRemainingQuantity,
            50,
          );

          expect(
            item.batches.length,
            2,
          );

          expect(
            item.batches[0].initialQuantity,
            30,
          );

          expect(
            item.batches[1].initialQuantity,
            20,
          );
        },
      );
    });

    group('getInventoryItems', () {
      test(
        'returns only inventory for requested branch',
        () async {
          // Arrange
          await InventoryTestFactory.seedBusiness(database);
          await InventoryTestFactory.seedBranch(
            database,
          );

          await InventoryTestFactory.seedBranch(
            database,
            id: 'other_branch',
            name: 'Other Branch',
            isHeadOffice: false,
            phone: '+234001',
          );

          await InventoryTestFactory
              .seedGlobalProduct(
            database,
            id: 'gp_1',
            barcode: 'BC001',
          );

          await InventoryTestFactory
              .seedGlobalProduct(
            database,
            id: 'gp_2',
            name: 'Rice 2kg',
            barcode: 'BC002',
          );

          final product1 =
              await InventoryTestFactory.seedProduct(
            database,
            id: 'prod_1',
            globalProductId: 'gp_1',
            branchId: branchId,
          );

          final product2 =
              await InventoryTestFactory.seedProduct(
            database,
            id: 'prod_2',
            globalProductId: 'gp_2',
            branchId: 'other_branch',
          );

          await InventoryTestFactory
              .seedInventory(
            database,
            productId: product1.id,
            branchId: branchId,
          );

          await InventoryTestFactory
              .seedInventory(
            database,
            productId: product2.id,
            branchId: 'other_branch',
          );

          // Act
          final results =
              await repository
                  .getInventoryItems(
            branchId,
          );

          // Assert
          expect(
            results.length,
            1,
          );

          expect(
            results.first.product.id,
            product1.id,
          );
        },
      );

      test(
        'returns empty list for empty branch inventory',
        () async {
          // Arrange
          await InventoryTestFactory.seedBusiness(database);
          await InventoryTestFactory.seedBranch(
            database,
          );

          // Act
          final result =
              await repository
                  .getInventoryItems(
            branchId,
          );

          // Assert
          expect(result, isEmpty);
        },
      );
    });

    group('getInventoryItemById', () {
      test(
        'returns inventory item with batches',
        () async {
          // Arrange
          final product =
              await InventoryTestFactory
                  .seedFullProduct(database);

          await repository.addStock(
            productId: product.id,
            branchId: branchId,
            pieceQuantity: 10,
            totalCost: '3000',
            piecePrice: 600,
            bulkPrice: 5000,
          );

          // Act
          final item =
              await repository
                  .getInventoryItemById(
            product.id,
          );

          // Assert
          expect(item, isNotNull);

          expect(
            item!.product.id,
            product.id,
          );

          expect(
            item.batches.length,
            1,
          );

          expect(
            item.batches.first.remainingQuantity,
            10,
          );
        },
      );

      test(
        'returns null for unknown product',
        () async {
          // Act
          final item =
              await repository
                  .getInventoryItemById(
            'missing_product',
          );

          // Assert
          expect(item, isNull);
        },
      );
    });

    group('getStockWorth', () {
      test(
        'computes stock worth correctly',
        () async {
          // Arrange
          final product =
              await InventoryTestFactory
                  .seedFullProduct(database);

          // Act
          await repository.addStock(
            productId: product.id,
            branchId: branchId,
            pieceQuantity: 10,
            totalCost: '5000',
            piecePrice: 700,
            bulkPrice: 6000,
          );

          final worth =
              await repository.getStockWorth(
            branchId,
          );

          // Assert
          expect(
            worth,
            5000.0,
          );
        },
      );

      test(
        'returns zero when inventory is empty',
        () async {
          // Arrange
          await InventoryTestFactory.seedBusiness(database);

          await InventoryTestFactory.seedBranch(
            database,
          );

          // Act
          final worth =
              await repository.getStockWorth(
            branchId,
          );

          // Assert
          expect(worth, 0.0);
        },
      );
    });

    group('searchInventoryItems', () {
      test(
        'returns matching products for partial search',
        () async {
          // Arrange
          await InventoryTestFactory.seedBusiness(database);
          await InventoryTestFactory.seedBranch(
            database,
          );

          await InventoryTestFactory
              .seedGlobalProduct(
            database,
            id: 'gp_1',
            barcode: 'BC001',
          );

          await InventoryTestFactory
              .seedGlobalProduct(
            database,
            id: 'gp_2',
            name: 'Rice 2kg',
            barcode: 'BC002',
          );

          final garri =
              await InventoryTestFactory.seedProduct(
            database,
            id: 'prod_1',
            globalProductId: 'gp_1',
            name: 'Garri 1kg',
          );

          final rice =
              await InventoryTestFactory.seedProduct(
            database,
            id: 'prod_2',
            globalProductId: 'gp_2',
            name: 'Rice 2kg',
          );

          await InventoryTestFactory
              .seedInventory(
            database,
            productId: garri.id,
            branchId: branchId,
          );

          await InventoryTestFactory
              .seedInventory(
            database,
            productId: rice.id,
            branchId: branchId,
          );

          // Act
          final results =
              await repository
                  .searchInventoryItems(
            branchId,
            'garri',
          );

          // Assert
          expect(
            results.length,
            1,
          );

          expect(
            results.first.product.name,
            'Garri 1kg',
          );
        },
      );

      test(
        'returns empty list for unmatched query',
        () async {
          // Arrange
          await InventoryTestFactory
              .seedFullProduct(database);

          // Act
          final results =
              await repository
                  .searchInventoryItems(
            branchId,
            'nonexistent_query',
          );

          // Assert
          expect(results, isEmpty);
        },
      );

      test(
        'search is case insensitive',
        () async {
          // Arrange
          await InventoryTestFactory
              .seedFullProduct(
            database,
            productName: 'Garri 1kg',
          );

          // Act
          final upper =
              await repository
                  .searchInventoryItems(branchId, 'GARRI');

          final lower =
              await repository
                  .searchInventoryItems(branchId, 'garri');

          final mixed =
              await repository
                  .searchInventoryItems(branchId, 'Garri');

          // Assert
          expect(
            upper.length,
            1,
          );

          expect(
            lower.length,
            1,
          );

          expect(
            mixed.length,
            1,
          );

          expect(
            upper.first.product.name,
            'Garri 1kg',
          );

          expect(
            lower.first.product.name,
            'Garri 1kg',
          );

          expect(
            mixed.first.product.name,
            'Garri 1kg',
          );
        },
      );
    });
  });
}