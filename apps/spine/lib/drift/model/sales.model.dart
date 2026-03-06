import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/user_business.dart';

class Sales extends Table with TableMixin {
    late final customerId = text().nullable()();
    late final totalAmount = integer()();
    late final amountPaid = integer().withDefault(const Constant(0))();
    late final balance = integer().withDefault(const Constant(0))();
    late final paymentMethod = text()();
    late final status = text()();
    late final note = text().nullable()();

    late final businessId = text().references(UserBusiness, #id)();

    
    late final createdBy = text().references(User, #id).nullable()();
}