import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/batch.model.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/businesses.dart';

class StockMovement extends Table with TableMixin {
    late final productId = text().references(Product, #id)();
    late final businessId = text().references(Businesses, #id)();
    late final batchId = text().references(SpineBatch, #id).nullable()();
    late final type = text()(); //'purchase', 'sale', 'adjustment', 'transfer_in', 'transfer_out', 'return'
    late final quantity = integer()();
    late final referenceId = text().nullable()();
    late final notes = text().nullable()();
    late final createdBy = text().references(User, #id).nullable()();
}