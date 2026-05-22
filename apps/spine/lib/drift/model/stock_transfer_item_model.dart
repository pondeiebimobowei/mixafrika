import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';
import 'package:spine/drift/model/stock_transfer_model.dart';

class StockTransferItem extends Table with TableMixin {
    late final quantity = integer()();

    
    late final transferId = text().references(StockTransfer, #id)();
    late final productId = text().references(Product, #id)();

}