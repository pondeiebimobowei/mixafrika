import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/businesses.dart';
import 'package:spine/drift/model/collection.model.dart';


class Branch extends Table with TableMixin {

    late final name = text()();
    late final isHeadOffice = boolean().withDefault(const Constant(false))();

    late final phone = text()();
    late final streetAddress = text()();
    late final city = text()();
    late final state = text()();
    late final country = text()();
    
    late final businessId = text().unique().references(Businesses, #id)();
    late final collectionId = text().nullable().references(Collection, #id)();


}
