import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/drift/database.dart';

void main() {
  late AppDatabase db;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
  });

  tearDown(() async {
    await db.close();
  });

  group('Spine Drift database integrity', () {
    test(
      'creates all local core inventory, sales, branch, and user tables',
      () async {
        final rows = await db
            .customSelect("SELECT name FROM sqlite_master WHERE type = 'table'")
            .get();
        final tableNames = rows
            .map((row) => row.data['name'] as String)
            .toSet();

        expect(
          tableNames,
          containsAll({
            'businesses',
            'branch',
            'user',
            'business_user',
            'branch_user',
            'global_product',
            'product',
            'inventory',
            'spine_batch',
            'stock_movement',
            'stock_transfer',
            'stock_transfer_item',
            'stock_adjustment',
            'stock_adjustment_item',
            'customer',
            'sales',
            'sales_item',
            'payments',
            'verification_token',
            'user_verification',
          }),
        );
      },
    );

    test(
      'enables SQLite foreign key enforcement for local integrity',
      () async {
        final row = await db.customSelect('PRAGMA foreign_keys').getSingle();

        expect(
          row.data['foreign_keys'],
          1,
          reason: 'Offline Drift storage must reject orphaned local records.',
        );
      },
    );

    test(
      'applies base timestamp defaults and nullable sync/delete fields',
      () async {
        final inserted = await db
            .into(db.businesses)
            .insertReturning(
              BusinessesCompanion.insert(
                id: 'biz_defaults',
                syncStatus: 'pending',
                name: 'Defaults Store',
                type: 'retail',
                phone: '+2348000000000',
                streetAddress: '1 Market Road',
                city: 'Lagos',
                state: 'Lagos',
                country: 'Nigeria',
                isVerified: false,
              ),
            );

        expect(inserted.createdAt, isNotNull);
        expect(inserted.updatedAt, isNotNull);
        expect(inserted.syncStatus, 'pending');
        expect(inserted.syncDate, isNull);
        expect(inserted.deletedAt, isNull);
      },
    );

    test(
      'rejects inventory rows that point to missing product and branch ids',
      () async {
        await expectLater(
          db
              .into(db.inventory)
              .insert(
                InventoryCompanion.insert(
                  id: 'orphan_inventory',
                  syncStatus: 'pending',
                  quantity: 12,
                  productId: 'missing_product',
                  branchId: 'missing_branch',
                ),
              ),
          throwsA(anything),
        );
      },
    );

    test('rejects null required fields at the database boundary', () async {
      await expectLater(
        db.customStatement('''
          INSERT INTO product (
            id, sync_status, name, description, bulk_unit_name,
            piece_unit_name, selling_price_per_piece,
            selling_price_per_bulk, category, image_url, reviews,
            branch_id, global_product_id
          ) VALUES (
            'product_null_name', 'pending', NULL, 'desc', 'Bag',
            'Piece', 15, 100, 'Food', '', '',
            'branch_missing', 'global_missing'
          )
          '''),
        throwsA(anything),
      );
    });
  });
}
