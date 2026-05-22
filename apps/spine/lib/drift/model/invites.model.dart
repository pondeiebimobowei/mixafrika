import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/branch.model.dart';
import 'package:spine/drift/model/businesses.dart';
import 'package:spine/drift/model/user.model.dart';


class Invites extends Table with TableMixin {
    late final email = text()();
    late final role = text()(); // admin, manager, staff etc
    late final token = text()();
    late final accepted = boolean()();
    late final expiresAt = text()();


    late final branchId = text().references(Branch, #id)();
    late final businessId = text().references(Businesses, #id)();
    late final invitedBy = text().references(User, #id)();
}
