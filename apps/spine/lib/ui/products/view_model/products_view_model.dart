import 'dart:async';

import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/user_business/active_user_business_provider.dart';

class ProductsViewModel extends AsyncNotifier<List<ProductData>> {
  @override
  FutureOr<List<ProductData>> build() {
    // Initial state: fetch the username from the repository
    final business = ref.watch(activeUserBusinessProvider);
    if (business == null) return [];
    return ref.read(productRepositoryProvider).getProducts();
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
