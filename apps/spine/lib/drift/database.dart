import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:path_provider/path_provider.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/inventory.model.dart';
import 'package:spine/drift/model/batch.model.dart';
import 'package:spine/drift/model/user_business.dart';
import 'package:spine/drift/model/business_verification.model.dart';
import 'package:uuid/uuid.dart';

part 'database.g.dart';

@DriftDatabase(
  tables: [Product, Inventory, SpineBatch, UserBusiness, BusinessVerification],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? executor]) : super(executor ?? _openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'spine',
      native: const DriftNativeOptions(
        // By default, `driftDatabase` from `package:drift_flutter` stores the
        // database files in `getApplicationDocumentsDirectory()`.
        databaseDirectory: getApplicationSupportDirectory,
      ),
      web: DriftWebOptions(
        sqlite3Wasm: Uri.parse('sqlite3.wasm'),
        driftWorker: Uri.parse('drift_worker.js'),
        onResult: (result) {
          if (result.missingFeatures.isNotEmpty) {
            print(
              'Using ${result.chosenImplementation} due to unsupported '
              'browser features: ${result.missingFeatures}',
            );
          }
        },
      ),
      // If you need web support, see https://drift.simonbinder.eu/platforms/web/
    );
  }

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        // 1. Create all tables
        await m.createAll();

        // 2. Insert seed data
        await into(product).insert(product1);
        await into(product).insert(product2);
        await into(userBusiness).insert(userBiz1);
        await into(userBusiness).insert(userBiz2);
        await into(spineBatch).insert(batch1);
        await into(inventory).insert(inventory1);
        await into(inventory).insert(inventory2);

      },
      beforeOpen: (details) async {
        // Optional: Enable foreign keys or perform checks every time the app opens
        if (details.wasCreated) {
          // This also runs only on the very first creation
        }
      },
    );
  }
}

final databaseProvider = Provider<AppDatabase>((ref) {
  final db = AppDatabase();
  ref.onDispose(() => db.close());
  return db;
});


final product1 = ProductData(
            id: Uuid().v4(),
            name: 'Pack of Milk',
            description: 'Clean surface',
            bulkUnitName: 'Carton',
            pieceUnitName: 'Pack',
            unitsPerBulk: '10',
            costPrice: '3000',
            sellingPricePerPiece: '4000',
            sellingPricePerBulk: '20000',
            category: 'Food',
            serialNumber: '345567567',
            imageUrl: 'avatar.png',
            businessId: userBiz1.id,

            reviews: 'Reviews',


            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            deletedAt: DateTime.now(),
            syncStatus: 'Sync status',
            syncDate: DateTime.now(),
          );
final product2 = ProductData(
            id: Uuid().v4(),
            name: 'A product Two',
            description: '',
            bulkUnitName: 'Bunch',
            pieceUnitName: 'Finger',
            unitsPerBulk: '5',
            costPrice: '1500',
            sellingPricePerPiece: '2000',
            sellingPricePerBulk: '10000',
            category: 'Food',
            serialNumber: '123450987',
            imageUrl: 'image.png',
            businessId: userBiz1.id,

            reviews: 'no review',


            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            deletedAt: DateTime.now(),
            syncStatus: 'pending',
            syncDate: DateTime.now(),
          );


final batch1 = SpineBatchData(
            id: Uuid().v4(),
            batchNumber: '123456789',
            quantity: '30',
            expiryDate: DateTime.now().toString(),
            productId: product1.id,
            

            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            deletedAt: DateTime.now(),
            syncStatus: 'Sync status',
            syncDate: DateTime.now(),
          );

          final inventory1 = InventoryData(
            id: Uuid().v4(),
            quantity: '50',
            productId: product1.id,
            businessId: userBiz1.id,
            batchId: batch1.id,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            deletedAt: DateTime.now(),
            syncStatus: 'pending',
            syncDate: DateTime.now(),
          );

          final inventory2 = InventoryData(
            id: Uuid().v4(),
            quantity: '30',
            productId: product2.id,
            businessId: userBiz1.id,
            batchId: batch1.id,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            deletedAt: DateTime.now(),
            syncStatus: 'pending',
            syncDate: DateTime.now(),
          );

          

            final userBiz1 = UserBusinessData(
    id: Uuid().v4(),
    userId: 'sdedede',
    collectionId: '1',
    name: 'Chicken Republic',
    type: 'business',
    phone: '08023467856',
    streetAddress: '123 Main St',
    city: 'Gwarimpa',
    state: 'Abuja',
    country: 'Nigeria',
    verification: 'not verified',
    syncStatus: 'pending',

    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
    deletedAt: DateTime.now(),
    syncDate: DateTime.now(),
  );

  final userBiz2 = UserBusinessData(
    id: Uuid().v4(),
    userId: '1',
    collectionId: '1',
    name: 'Blessed Obaino',
    type: 'business',
    phone: '08023467856',
    streetAddress: '123 Main St',
    city: 'Gwarimpa',
    state: 'Abuja',
    country: 'Nigeria',
    verification: 'not verified',
    syncStatus: 'pending',

    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
    deletedAt: DateTime.now(),
    syncDate: DateTime.now(),
  );
