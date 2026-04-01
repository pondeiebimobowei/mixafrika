import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/user_business.dart';

class StockTransfer extends Table with TableMixin {
    @ReferenceName('outgoingTransfers')
    late final fromBranchId = text().references(UserBusiness, #id)();
    @ReferenceName('incomingTransfers')
    late final toBranchId = text().references(UserBusiness, #id)();
    late final reason = text()();
    late final status = text()(); //'pending','completed'
    late final createdBy = text().references(User, #id)();

}