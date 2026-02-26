import 'package:dio/dio.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:spine/data/services/models/product_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProductsApiServices {
  Future<ApiResponse<List<Product>>> getProducts() async {
    try {
      final res = await apiPrivate.get('/products');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => Product.fromJson(e)).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <Product>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }
}

final productsApiServiceProvider = Provider((ref) => ProductsApiServices());
