import 'package:spine/drift/database.dart';

abstract class SalesRepositoryAbstract {
  Future<void> createSale(Sale sale, List<SalesItemData> items);
  Future<List<Sale>> getSales();
}
