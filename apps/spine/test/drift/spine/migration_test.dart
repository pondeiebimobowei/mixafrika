// dart format width=80
// ignore_for_file: unused_local_variable, unused_import
import 'package:drift/drift.dart';
import 'package:drift_dev/api/migrations_native.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_test/flutter_test.dart';
import 'generated/schema.dart';

import 'generated/schema_v2.dart' as v2;
import 'generated/schema_v3.dart' as v3;

void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  late SchemaVerifier verifier;

  setUpAll(() {
    verifier = SchemaVerifier(GeneratedHelper());
  });

  group('simple database migrations', () {
    // These simple tests verify all possible schema updates with a simple (no
    // data) migration. This is a quick way to ensure that written database
    // migrations properly alter the schema.
    const versions = GeneratedHelper.versions;
    for (final (i, fromVersion) in versions.indexed) {
      group('from $fromVersion', () {
        for (final toVersion in versions.skip(i + 1)) {
          test('to $toVersion', () async {
            final schema = await verifier.schemaAt(fromVersion);
            final db = AppDatabase(schema.newConnection());
            await verifier.migrateAndValidate(db, toVersion);
            await db.close();
          });
        }
      });
    }
  });

  // The following template shows how to write tests ensuring your migrations
  // preserve existing data.
  // Testing this can be useful for migrations that change existing columns
  // (e.g. by alterating their type or constraints). Migrations that only add
  // tables or columns typically don't need these advanced tests. For more
  // information, see https://drift.simonbinder.eu/migrations/tests/#verifying-data-integrity
  // TODO: This generated template shows how these tests could be written. Adopt
  // it to your own needs when testing migrations with data integrity.
  test('migration from v2 to v3 does not corrupt data', () async {
    // Add data to insert into the old database, and the expected rows after the
    // migration.
    // TODO: Fill these lists
    final oldBusinessVerificationData = <v2.BusinessVerificationData>[];
    final expectedNewBusinessVerificationData = <v3.BusinessVerificationData>[];

    final oldUserBusinessData = <v2.UserBusinessData>[];
    final expectedNewUserBusinessData = <v3.UserBusinessData>[];

    final oldProductData = <v2.ProductData>[];
    final expectedNewProductData = <v3.ProductData>[];

    final oldSpineBatchData = <v2.SpineBatchData>[];
    final expectedNewSpineBatchData = <v3.SpineBatchData>[];

    final oldInventoryData = <v2.InventoryData>[];
    final expectedNewInventoryData = <v3.InventoryData>[];

    final oldUserData = <v2.UserData>[];
    final expectedNewUserData = <v3.UserData>[];

    final oldSalesData = <v2.SalesData>[];
    final expectedNewSalesData = <v3.SalesData>[];

    final oldSalesItemData = <v2.SalesItemData>[];
    final expectedNewSalesItemData = <v3.SalesItemData>[];

    final oldPaymentsData = <v2.PaymentsData>[];
    final expectedNewPaymentsData = <v3.PaymentsData>[];

    await verifier.testWithDataIntegrity(
      oldVersion: 2,
      newVersion: 3,
      createOld: v2.DatabaseAtV2.new,
      createNew: v3.DatabaseAtV3.new,
      openTestedDatabase: AppDatabase.new,
      createItems: (batch, oldDb) {
        batch.insertAll(
          oldDb.businessVerification,
          oldBusinessVerificationData,
        );
        batch.insertAll(oldDb.userBusiness, oldUserBusinessData);
        batch.insertAll(oldDb.product, oldProductData);
        batch.insertAll(oldDb.spineBatch, oldSpineBatchData);
        batch.insertAll(oldDb.inventory, oldInventoryData);
        batch.insertAll(oldDb.user, oldUserData);
        batch.insertAll(oldDb.sales, oldSalesData);
        batch.insertAll(oldDb.salesItem, oldSalesItemData);
        batch.insertAll(oldDb.payments, oldPaymentsData);
      },
      validateItems: (newDb) async {
        expect(
          expectedNewBusinessVerificationData,
          await newDb.select(newDb.businessVerification).get(),
        );
        expect(
          expectedNewUserBusinessData,
          await newDb.select(newDb.userBusiness).get(),
        );
        expect(expectedNewProductData, await newDb.select(newDb.product).get());
        expect(
          expectedNewSpineBatchData,
          await newDb.select(newDb.spineBatch).get(),
        );
        expect(
          expectedNewInventoryData,
          await newDb.select(newDb.inventory).get(),
        );
        expect(expectedNewUserData, await newDb.select(newDb.user).get());
        expect(expectedNewSalesData, await newDb.select(newDb.sales).get());
        expect(
          expectedNewSalesItemData,
          await newDb.select(newDb.salesItem).get(),
        );
        expect(
          expectedNewPaymentsData,
          await newDb.select(newDb.payments).get(),
        );
      },
    );
  });
}
