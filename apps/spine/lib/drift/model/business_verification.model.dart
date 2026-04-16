import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/businesses.dart';

class BusinessVerification extends Table with TableMixin {
  
  late final type = text()();
  late final docNumber = text().nullable()();
  late final docUrl = text()();
  late final status = text()();
  late final rejectionReason = text()();
  late final reviewedAt = dateTime()();


  late final businessId = text().references(Businesses, #id)();
  @ReferenceName('businessVerificationSubmittedBy')
  late final submittedBy = text().references(User, #id)();
  @ReferenceName('businessVerificationReviewedBy')
  late final reviewedBy = text().references(User, #id)();
}
