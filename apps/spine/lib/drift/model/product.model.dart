import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user_business.dart';

class Product extends Table with TableMixin {
    late final name = text()();
    late final description = text()();
    late final bulkUnitName = text()();
    late final pieceUnitName = text()();
    late final unitsPerBulk = integer()();
    late final costPrice = integer()();
    late final sellingPricePerPiece = integer()();
    late final sellingPricePerBulk = integer()();
    late final category = text()();
    late final serialNumber = text()();
    late final imageUrl = text()();
    late final reviews = text()();


    late final businessId = text().references(UserBusiness, #id)();

}
