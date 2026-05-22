import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/branch.model.dart';
import 'package:spine/drift/model/user.model.dart';

class StockTransfer extends Table with TableMixin {
    late final reason = text()();
    late final status = text()(); //'pending','completed'


    late final createdBy = text().references(User, #id)();
    @ReferenceName('outgoingTransfers')
    late final fromBranchId = text().references(Branch, #id)();
    @ReferenceName('incomingTransfers')
    late final toBranchId = text().references(Branch, #id)();
}