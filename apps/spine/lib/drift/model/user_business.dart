import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/business_verification.model.dart';


class UserBusiness extends Table with TableMixin {
    late final userId = text()();
    late final collectionId = text()();
    late final name = text()();
    late final type = text()();
    late final phone = text()();
    late final streetAddress = text()();
    late final city = text()();
    late final state = text()();
    late final country = text()();

    
    late final verification = text().references(BusinessVerification, #id)();

}
