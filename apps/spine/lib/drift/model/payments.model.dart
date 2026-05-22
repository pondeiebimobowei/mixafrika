import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/sales.model.dart';

class Payments extends Table with TableMixin {
    late final amount = integer()();
    late final reference = text().nullable()();
    late final paymentMethod = text()();
    late final status = text()();

    
    late final saleId = text().references(Sales, #id)();
}