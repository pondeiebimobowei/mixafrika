import 'package:spine/data/repositories/product/product_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/product_model.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProductRepository implements ProductRepositoryAbstract {
  ProductRepository({required AppDatabase database}) : _database = database;

  final AppDatabase _database;

  @override
  Future<ApiResponse<void>> createProduct(ProductData product) async {
    try {
      await _database.into(_database.product).insert(product);

      return ApiResponse(
        data: null,
        message: 'Product created successfully',
        success: true,
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Product creation failed',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<Product?>> getProduct(String id) async {
    try {
      final query = _database.select(_database.product)
        ..where((p) => p.id.equals(id));
      final data = await query.getSingle();
      return ApiResponse(
        success: true,
        message: 'Product fetched',
        data: Product.fromJson(data.toJson()),
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Product not found',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<void>> updateProduct(ProductData product) async {
    try {
      await (_database.update(
        _database.product,
      )..where((p) => p.id.equals(product.id))).write(product);
      return ApiResponse(
        success: true,
        message: 'Product updated successfully',
        data: null,
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Update failed',
        data: null,
      );
    }
  }

  @override
  Future<List<ProductData>> getProducts() async {
    // _database.select(_database.product)
    List<ProductData> allItems = await _database
        .select(_database.product)
        .get();

    // final res = await _productsService.getProducts();
    return allItems.map((e) => ProductData.fromJson(e.toJson())).toList();
  }

  @override
  Future<ProductData> getProductById(String id) async {
    List<ProductData> allItems = await (_database.select(_database.product)
    ..where((t) => t.id.equals(id))).get();

    return ProductData.fromJson(allItems.first.toJson());
  }

  @override
  Future<List<ProductData>> getProductsByBusinessId(String businessId) async {
    List<ProductData> products = await (_database.select(_database.product)..where((t) => t.businessId.equals(businessId))).get();

    return products.map((e) => ProductData.fromJson(e.toJson())).toList();
  }

  @override
  Future<void> deleteProduct(String id) async {
    await (_database.delete(
      _database.product,
    )..where((p) => p.id.equals(id))).go();
  }
}

final productRepositoryProvider = Provider(
  (ref) => ProductRepository(database: ref.watch(databaseProvider)),
);
