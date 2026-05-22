import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/sales.model.dart';
import 'package:spine/drift/model/batch.model.dart';

class SalesItem extends Table with TableMixin {
  late final name = text()();
  late final quantity = integer().withDefault(const Constant(1))();
  late final type = text()();// product, charge
  late final unitPrice = integer()();
  late final costPrice = integer()();
  late final total = integer()();
  late final description = text().nullable()();

  late final saleId = text().references(Sales, #id)();
  late final productId = text().nullable().references(Product, #id)();
  late final batchId = text().nullable().references(SpineBatch, #id)();
}
