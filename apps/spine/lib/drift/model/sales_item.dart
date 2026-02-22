import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/sales.model.dart';

class SalesItem extends Table with TableMixin {
    late final quantity = text()();
    late final unitPrice = text()();
    late final total = text()();
    
    
    late final saleId = text().references(Sales, #id)();
    late final productId = text().references(Product, #id)();
}
