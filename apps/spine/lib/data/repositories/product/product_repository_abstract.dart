import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/product_model.dart';
import 'package:spine/drift/database.dart';

abstract class ProductRepositoryAbstract {
  /// Returns the list of [BookingSummary] for the current user.
  Future<List<ProductData>> getProducts();

  /// Returns a full [Product] given the id.
  Future<ApiResponse<Product>> getProduct(String id);

  /// Creates a new [Product].
  Future<ApiResponse<void>> createProduct();

  /// Delete product
  Future<void> deleteProduct(String id);
}