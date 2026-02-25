import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/product_model.dart';
import 'package:spine/drift/database.dart';

abstract class ProductRepositoryAbstract {

  Future<List<ProductData>> getProducts();

  Future<List<ProductData>> getProductsByBusinessId(String businessId);

  Future<ApiResponse<Product>> getProduct(String id);

  Future<ApiResponse<void>> createProduct();

  Future<void> deleteProduct(String id);
}