import 'package:spine/drift/database.dart';

import '../constants.dart';

/// Centralized factory for seeding deterministic test data into an in-memory
/// [AppDatabase]. All helpers use named parameters with sensible defaults so
/// each test only needs to specify the fields it cares about.
///
/// Using a shared factory keeps tests concise, reduces copy-paste drift, and
/// makes future schema changes easier to fix in a single place.
abstract final class BusinessTestFactory {
  // ─── Shared constants ──────────────────────────────────────────────────────

  /// Fully deterministic timestamp used across all seeded rows.
  /// Avoids any hidden dependency on [DateTime.now()] in test data.
  

  // ─── Seed helpers ──────────────────────────────────────────────────────────

  /// Seeds a [BranchData] row and returns it.

  static Future<BusinessesData> seedBusiness(
    AppDatabase db, {
    String businessId = Constants.testBusinessId1, 
  
  }   
  )async {
    
    final businessRecord = BusinessesData(
      id: businessId,
      name: 'Test Business',
      phone: '+234000',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      syncStatus: 'synced',
      isVerified: true,
      streetAddress: '1 Test St',
      type: "Retail Store",

      createdAt: Constants.fixedNow,
      updatedAt: Constants.fixedNow,
    );
    await db.into(db.businesses).insert(businessRecord);
    return businessRecord;
  }

}
