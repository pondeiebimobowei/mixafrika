import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';

class Sales extends Table with TableMixin {
    late final branchId = text()();
    late final customerId = text().nullable();
    late final totalAmount = text()();
    late final paymentMethod = text()();
    late final status = text()();

    
    late final createdBy = text().references(User, #id)();
}