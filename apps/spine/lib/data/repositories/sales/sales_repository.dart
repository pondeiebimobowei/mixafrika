import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/data/repositories/sales/sales_repository_abstract.dart';

class SalesRepository implements SalesRepositoryAbstract {
  final AppDatabase _db;

  SalesRepository(this._db);

  @override
  Future<void> createSale(Sale sale, List<SalesItemData> items) async {
    await _db.transaction(() async {
      await _db.into(_db.sales).insert(sale);
      for (final item in items) {
        await _db.into(_db.salesItem).insert(item);
      }
    });
  }

  @override
  Future<List<Sale>> getSales() async {
    return await _db.select(_db.sales).get();
  }
}

final salesRepositoryProvider = Provider<SalesRepository>((ref) {
  return SalesRepository(ref.watch(databaseProvider));
});
