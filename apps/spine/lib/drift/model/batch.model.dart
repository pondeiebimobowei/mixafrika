import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';

class SpineBatch extends Table with TableMixin {
    late final expiryDate = text()();
    late final quantity = text()();
    late final batchNumber = text()();
    
    
    late final productId = text().references(Product, #id)();
}