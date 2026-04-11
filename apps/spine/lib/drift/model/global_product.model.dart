import 'package:drift/drift.dart';
import 'package:flutter/foundation.dart';
import 'package:spine/drift/model/base.dart';

class GlobalProduct extends Table with TableMixin {

    late final name = text()();
    late final normalizedName = text().unique()();
    late final description = text()();

    late final category = text().nullable().references(Category, #id)();
    late final barcode = text().unique()();
    late final imageUrl = text()();

}