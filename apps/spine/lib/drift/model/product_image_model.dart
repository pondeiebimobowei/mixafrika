import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/product.model.dart';

class ProductImage extends Table with TableMixin {
  
  TextColumn get productId => text().references(Product, #id)();
  TextColumn get localPath => text().nullable()();
  TextColumn get remoteUrl => text().nullable()();

}