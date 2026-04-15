import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/branch.model.dart';

class BankDetails extends Table with TableMixin {
  late final branchId = text().references(Branch, #id)();
  late final bankName = text()();
  late final accountName = text()();
  late final accountNumber = text()();
}
