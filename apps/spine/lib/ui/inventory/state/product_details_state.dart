import 'package:spine/ui/inventory/state/inventory_state.dart';

class ProductDetailsState {
  final InventoryItemData? item;
  final bool isLoading;
  final String? errorMessage;

  const ProductDetailsState({
    this.item,
    this.isLoading = false,
    this.errorMessage,
  });

  ProductDetailsState copyWith({
    InventoryItemData? item,
    bool? isLoading,
    String? errorMessage,
  }) {
    return ProductDetailsState(
      item: item ?? this.item,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage, // Allow null override
    );
  }
}
