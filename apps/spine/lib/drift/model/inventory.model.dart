import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/batch.model.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/user_business.dart';

class Inventory extends Table with TableMixin {
  late final quantity = integer()();
  
  
  late final productId = text().references(Product, #id)();
  late final businessId = text().references(UserBusiness, #id)();
  late final batchId = text().references(SpineBatch, #id).nullable()();
}
