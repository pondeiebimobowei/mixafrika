import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user_business.dart';

class BankDetails extends Table with TableMixin {
  late final businessId = text().references(UserBusiness, #id)();
  late final bankName = text()();
  late final accountName = text()();
  late final accountNumber = text()();
}
