import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';

class UserVerification extends Table with TableMixin {
  
  late final type = text()();
  late final idNumber = text()();
  late final idImageFrontUrl = text()();
  late final idImageBackUrl = text()();
  late final status = text()();
  late final rejectionReason = text()();
  late final submittedAt = dateTime()();
  late final reviewedAt = dateTime()();


  @ReferenceName('reviewed_by')
  late final reviewedBy = text().nullable().references(User, #id)();
  @ReferenceName('user_id')
  late final userId = text().references(User, #id)();
}
