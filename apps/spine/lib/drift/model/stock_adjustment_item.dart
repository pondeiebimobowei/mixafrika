import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/stock_adjustment.dart';

class StockAdjustmentItem extends Table with TableMixin {
    late final quantity = integer()();
    
    
    late final adjustmentId = text().references(StockAdjustment, #id)();
    late final productId = text().references(Product, #id)();
}