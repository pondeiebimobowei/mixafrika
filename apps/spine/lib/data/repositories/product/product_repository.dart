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
    try{

      await _database.into(_database.product).insert(product);

      return ApiResponse(
        data: null,
        message: 'Product created successfully',
        success: true,
      );
    }catch (e){
      return ApiResponse(success: false, message: 'Prouct creation failed', data: null);
    }
  }

  @override
  Future<ApiResponse<Product>> getProduct(String id) {
    // TODO: implement getProduct
    throw UnimplementedError();
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
  Future<List<ProductData>> getProductsByBusinessId(String businessId) async {
    List<ProductData> products = await _database
        .select(_database.product)
        // ..where((t) => t.businessId.equals(businessId))
        .get();

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
