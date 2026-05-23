import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:path_provider/path_provider.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/inventory.model.dart';
import 'package:spine/drift/model/batch.model.dart';
import 'package:spine/drift/model/stock_adjustment_item.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/businesses.dart';
import 'package:spine/drift/model/business_verification.model.dart';
import 'package:spine/drift/model/sales.model.dart';
import 'package:spine/drift/model/product_image_model.dart';
import 'package:spine/drift/model/stock_adjustment.dart';
import 'package:spine/drift/model/stock_movement.model.dart';
import 'package:spine/drift/model/stock_transfer_item_model.dart';
import 'package:spine/drift/model/stock_transfer_model.dart';
import 'package:spine/drift/model/sales_item.dart';
import 'package:spine/drift/model/payments.model.dart';
import 'package:spine/drift/model/global_product.model.dart';
import 'package:spine/drift/model/product_category.model.dart';
import 'package:spine/drift/model/bank_details.model.dart';
import 'package:spine/drift/model/customer.model.dart';
import 'package:spine/drift/model/business_user.model.dart';
import 'package:spine/drift/model/collection.model.dart';
import 'package:spine/drift/model/cluster.model.dart';
import 'package:spine/drift/model/branch.model.dart';
import 'package:spine/drift/model/branch_user.model.dart';
import 'package:spine/drift/model/verification_token.model.dart';
import 'package:spine/drift/model/user_verification.model.dart';
import 'package:spine/drift/model/invites.model.dart';

part 'database.g.dart';

@DriftDatabase(
  tables: [
    SpineBatch,
    BusinessVerification,
    Inventory,
    Payments,
    ProductImage,
    StockAdjustmentItem,
    Product,
    ProductCategory,
    SalesItem,
    Sales,
    BusinessUser,
    GlobalProduct,
    StockAdjustment,
    StockMovement,
    StockTransferItem,
    StockTransfer,
    Businesses,
    Customer,
    Collection,
    Cluster,
    Branch,
    BranchUser,
    VerificationToken,
    UserVerification,
    Invites,
    User,
    BankDetails,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? executor])
    : super(executor ?? _openConnection()) {}

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'spinedbbbbbbBbXfDughUu1dediDdrf2fQ-1',

      

      native: const DriftNativeOptions(
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

      },

      // onUpgrade: stepByStep(

      // ),
      beforeOpen: (details) async {
        // Optional: Enable foreign keys or perform checks every time the app opens
        await customStatement('PRAGMA foreign_keys = ON');
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
