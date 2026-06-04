import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/branch.model.dart';
import 'package:spine/drift/model/user.model.dart';

class StockAdjustment extends Table with TableMixin {
    late final reason = text()();

    
    late final branchId = text().references(Branch, #id)();
    late final createdById = text().references(User, #id)();

}