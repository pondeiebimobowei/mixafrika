import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user_business.dart';

class Customer extends Table with TableMixin {
  late final name = text()();
  late final phone = text().nullable()();

  late final businessId = text().references(UserBusiness, #id)();
}