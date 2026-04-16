import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product_category.model.dart';

class GlobalProduct extends Table with TableMixin {

    late final name = text()();
    late final normalizedName = text().unique()();
    late final description = text()();

    late final barcode = text().unique()();
    late final imageUrl = text()();


    late final category = text().nullable().references(ProductCategory, #id)();
}