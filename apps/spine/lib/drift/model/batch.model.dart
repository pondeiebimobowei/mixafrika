import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';

class SpineBatch extends Table with TableMixin {
    late final expiryDate = dateTime().nullable()();
    late final batchNumber = text()();
    late final costPricePerPiece = integer()();
    late final costPricePerBulk = integer()();
    late final initialQuantity = integer()();
    late final remainingQuantity = integer()();
    
    
    late final productId = text().references(Product, #id)();
}