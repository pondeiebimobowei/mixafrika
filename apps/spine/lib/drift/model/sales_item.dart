import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/sales.model.dart';

class SalesItem extends Table with TableMixin {
    late final quantity = integer()();
    late final unitPrice = integer()();
    late final total = integer()();
    
    
    late final saleId = text().references(Sales, #id)();
    late final productId = text().references(Product, #id)();
}
