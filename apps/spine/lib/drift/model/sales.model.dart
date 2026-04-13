import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/customer.model.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/businesses.dart';

class Sales extends Table with TableMixin {
    late final customerId = text().nullable().references(Customer, #id)();
    late final totalAmount = integer()();
    late final amountPaid = integer().withDefault(const Constant(0))();
    late final balance = integer().withDefault(const Constant(0))();
    late final paymentMethod = text()(); //'cash','transfer','card','credit'
    late final status = text()(); //'completed','cancelled','refunded', 'pending'
    late final note = text().nullable()();

    late final businessId = text().references(Businesses, #id)();

    
    late final createdBy = text().references(User, #id).nullable()();
}