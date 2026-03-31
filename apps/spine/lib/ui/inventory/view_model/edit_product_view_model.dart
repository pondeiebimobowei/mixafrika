import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/ui/inventory/state/edit_product_state.dart';

class EditProductViewModel extends FamilyAsyncNotifier<EditProductState, String> {
  // EditProductViewModel(this._productRepository);
  
  late final ProductRepository _productRepository;

  // EditProductViewModel({
  //   required ProductRepository productRepository,
  //   required this.productId,
  // }) : _productRepository = productRepository;
  //      super(EditProductState(isLoading: true)) {
  //   _loadProduct();
  // }

  @override
  Future<EditProductState> build(String productId) async {
    _productRepository = ref.read(productRepositoryProvider);
    _loadProduct(productId);
    return EditProductState(isLoading: true);
  }

  Future<void> _loadProduct(String productId) async {
    final response = await _productRepository.getProduct(productId);
    if (response.success && response.data != null) {
      final product = await _productRepository.getProductById(productId);
      print(response.data!.name);
      print('object');

      state = AsyncData(state.value!.copyWith(
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
      ));
    } else {
      print('fail');
      state = AsyncData(state.value!.copyWith(isLoading: false, errorMessage: response.message));
    }
  }

  void updateName(String value) => state = AsyncData(state.value!.copyWith(name: value));
  void updateDescription(String value) =>
      state = AsyncData(state.value!.copyWith(description: value));
  void updateCategory(String value) => state = AsyncData(state.value!.copyWith(category: value));
  void updateBulkUnit(String value) => state = AsyncData(state.value!.copyWith(bulkUnit: value));
  void updatePieceUnit(String value) =>
      state = AsyncData(state.value!.copyWith(pieceUnit: value));
  void updateUnitsPerBulk(String value) =>
      state = AsyncData(state.value!.copyWith(unitsPerBulk: value));
  void updateBulkCostPrice(String value) =>
      state = AsyncData(state.value!.copyWith(bulkCostPrice: value));
  void updatePieceSellingPrice(String value) =>
      state = AsyncData(state.value!.copyWith(pieceSellingPrice: value));
  void updateSerialNumber(String value) =>
      state = AsyncData(state.value!.copyWith(serialNumber: value));

  Future<bool> submit() async {
    if (state.value!.initialProduct == null) return false;

    state = AsyncData(state.value!.copyWith(isSubmitting: true, errorMessage: null));

    final updatedProduct = AsyncData(state.value!.initialProduct!.copyWith(
      name: state.value!.name,
      description: state.value!.description,
      category: state.value!.category,
      bulkUnitName: state.value!.bulkUnit,
      pieceUnitName: state.value!.pieceUnit,
      unitsPerBulk: int.tryParse(state.value!.unitsPerBulk) ?? 1,
      costPricePerUnit: int.tryParse(state.value!.bulkCostPrice) ?? 0,
      sellingPricePerPiece: int.tryParse(state.value!.pieceSellingPrice) ?? 0,
      serialNumber: state.value!.serialNumber,
      updatedAt: DateTime.now(),
    ));

    final response = await _productRepository.updateProduct(updatedProduct.value);

    if (response.success) {
      state = AsyncData(state.value!.copyWith(
        isSubmitting: false,
        successMessage: 'Product updated successfully',
      ));
      return true;
    } else {
      state = AsyncData(state.value!.copyWith(
        isSubmitting: false,
        errorMessage: response.message,
      ));
      return false;
    }
  }
}

final editProductViewModelProvider =
    AsyncNotifierProvider.family<
      EditProductViewModel,
      EditProductState,
      String
    >(EditProductViewModel.new);
