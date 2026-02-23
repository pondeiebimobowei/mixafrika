import 'dart:async';

import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

class ProductsViewModel extends AsyncNotifier<List<ProductData>> {
  @override
  FutureOr<List<ProductData>> build() {
    // Initial state: fetch the username from the repository
    return ref.watch(productRepositoryProvider).getProducts();
  }

  Future<List<ProductData>> loadProducts() async {
    return ref.read(productRepositoryProvider).getProducts();
  }

  Future<ApiResponse<void>> createProduct() async {
    return ref.read(productRepositoryProvider).createProduct();
  }

  Future<void> deleteProduct(String id) async {
    await ref.read(productRepositoryProvider).deleteProduct(id);
  }
}

// Provide the ViewModel
final productsViewModelProvider =
    AsyncNotifierProvider<ProductsViewModel, List<ProductData>>(
      ProductsViewModel.new,
    );
