import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/branch.model.dart';

class BranchUser extends Table with TableMixin {
  late final role = text()(); // manager, staff, sale
  late final isActive = boolean().withDefault(const Constant(true))();
  late final assignedAt = dateTime().nullable()();

  late final userId = text().references(User, #id)();
  late final branchId = text().references(Branch, #id)();

  @override
  List<Set<Column>> get uniqueKeys => [
    {branchId, userId},
  ];
}
