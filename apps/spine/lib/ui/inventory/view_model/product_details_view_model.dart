import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/ui/inventory/state/product_details_state.dart';

class ProductDetailsViewModel extends StateNotifier<ProductDetailsState> {
  ProductDetailsViewModel(this.ref, this.productId)
    : super(const ProductDetailsState()) {
    fetchProductDetails();
  }

  final Ref ref;
  final String productId;

  Future<void> fetchProductDetails() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final repository = ref.read(inventoryRepositoryProvider);
      final item = await repository.getInventoryItemById(productId);

      if (item != null) {
        state = state.copyWith(item: item, isLoading: false);
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Product not found',
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

final productDetailsViewModelProvider = StateNotifierProvider.autoDispose
    .family<ProductDetailsViewModel, ProductDetailsState, String>(
      (ref, productId) => ProductDetailsViewModel(ref, productId),
    );
