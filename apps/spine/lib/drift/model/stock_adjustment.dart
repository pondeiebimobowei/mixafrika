import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';
import 'package:spine/drift/model/businesses.dart';

class StockAdjustment extends Table with TableMixin {
    late final businessId = text().references(Businesses, #id)();
    late final reason = text()();
    late final createdBy = text().references(User, #id)();

}