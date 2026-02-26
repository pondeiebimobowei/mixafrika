import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';

class BusinessVerification extends Table with TableMixin {
  late final businessId = text()();
  late final status = text()();
  late final rejectionReason = text()();
  late final cacDocument = text()();
  late final reviewedById = text()();
  late final reviewedAt = text()();
}
