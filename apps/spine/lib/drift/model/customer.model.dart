import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/branch.model.dart';

class Customer extends Table with TableMixin {
  late final name = text()();
  late final phone = text().nullable()();


  late final branchId = text().references(Branch, #id)();
}