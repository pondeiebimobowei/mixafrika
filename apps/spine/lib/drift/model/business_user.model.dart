import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/businesses.dart';

class BusinessUser extends Table with TableMixin {
  late final role = text()();
  late final isActive = boolean().withDefault(const Constant(false))();
  late final hasFullAccess = boolean().withDefault(const Constant(false))();
  late final joinedAt = dateTime().nullable()();

  late final userId = text().references(User, #id)();
  late final businessId = text().references(Businesses, #id)();

  @override
  List<Set<Column>> get uniqueKeys => [
    {businessId, userId},
  ];
}
