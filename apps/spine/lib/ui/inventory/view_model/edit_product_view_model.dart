import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/ui/inventory/state/edit_product_state.dart';

class EditProductViewModel extends StateNotifier<EditProductState> {
  final ProductRepository _productRepository;
  final String productId;

  EditProductViewModel({
    required ProductRepository productRepository,
    required this.productId,
  }) : _productRepository = productRepository,
       super(EditProductState(isLoading: true)) {
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    final response = await _productRepository.getProduct(productId);
    if (response.success && response.data != null) {
      final product = await _productRepository.getProductById(productId);

      state = state.copyWith(
        isLoading: false,
        initialProduct: product,
        name: product.name,
        description: product.description,
        category: product.category,
        bulkUnit: product.bulkUnitName,
        pieceUnit: product.pieceUnitName,
        unitsPerBulk: product.unitsPerBulk.toString(),
        bulkCostPrice: product.costPricePerUnit.toString(),
        pieceSellingPrice: product.sellingPricePerPiece.toString(),
        serialNumber: product.serialNumber,
      );
    } else {
      state = state.copyWith(isLoading: false, errorMessage: response.message);
    }
  }

  void updateName(String value) => state = state.copyWith(name: value);
  void updateDescription(String value) =>
      state = state.copyWith(description: value);
  void updateCategory(String value) => state = state.copyWith(category: value);
  void updateBulkUnit(String value) => state = state.copyWith(bulkUnit: value);
  void updatePieceUnit(String value) =>
      state = state.copyWith(pieceUnit: value);
  void updateUnitsPerBulk(String value) =>
      state = state.copyWith(unitsPerBulk: value);
  void updateBulkCostPrice(String value) =>
      state = state.copyWith(bulkCostPrice: value);
  void updatePieceSellingPrice(String value) =>
      state = state.copyWith(pieceSellingPrice: value);
  void updateSerialNumber(String value) =>
      state = state.copyWith(serialNumber: value);

  Future<bool> submit() async {
    if (state.initialProduct == null) return false;

    state = state.copyWith(isSubmitting: true, errorMessage: null);

    final updatedProduct = state.initialProduct!.copyWith(
      name: state.name,
      description: state.description,
      category: state.category,
      bulkUnitName: state.bulkUnit,
      pieceUnitName: state.pieceUnit,
      unitsPerBulk: int.tryParse(state.unitsPerBulk) ?? 1,
      costPricePerUnit: int.tryParse(state.bulkCostPrice) ?? 0,
      sellingPricePerPiece: int.tryParse(state.pieceSellingPrice) ?? 0,
      serialNumber: state.serialNumber,
      updatedAt: DateTime.now(),
    );

    final response = await _productRepository.updateProduct(updatedProduct);

    if (response.success) {
      state = state.copyWith(
        isSubmitting: false,
        successMessage: 'Product updated successfully',
      );
      return true;
    } else {
      state = state.copyWith(
        isSubmitting: false,
        errorMessage: response.message,
      );
      return false;
    }
  }
}

final editProductViewModelProvider =
    StateNotifierProvider.family<
      EditProductViewModel,
      EditProductState,
      String
    >((ref, productId) {
      return EditProductViewModel(
        productRepository: ref.watch(productRepositoryProvider),
        productId: productId,
      );
    });
