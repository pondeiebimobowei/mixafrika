import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/businesses.dart';

class SpineBatch extends Table with TableMixin {
    late final expiryDate = dateTime().nullable()();
    late final batchNumber = text().unique()();
    late final costPricePerUnit = integer()();
    late final sellingPricePerPiece = integer()();
    late final sellingPricePerBulk = integer()();
    late final initialQuantity = integer()();
    late final remainingQuantity = integer()();
    
    
    late final productId = text().references(Product, #id)();
    late final businessId = text().references(Businesses, #id)();

  //    @override
  // List<Set<Column>> get uniqueKeys => [
  //       {productId, batchNumber, businessId},
  //     ];
}