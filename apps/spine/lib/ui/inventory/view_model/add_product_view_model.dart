import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/add_product_state.dart';
import 'package:spine/utils/helper.dart';
import 'package:uuid/uuid.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';
import 'package:spine/data/services/api/config/api_response.dart';

class AddProductViewModel extends AutoDisposeNotifier<AddProductState> {
  @override
  AddProductState build() {
    return const AddProductState();
  }

  void updateName(String name) =>
      state = state.copyWith(name: name, errorMessage: null);
  void updateBarcode(String barcode) =>
      state = state.copyWith(barcode: barcode, errorMessage: null);
  void updateBulkUnit(String unit) =>
      state = state.copyWith(bulkUnit: unit, errorMessage: null);
  void updatePieceUnit(String unit) =>
      state = state.copyWith(pieceUnit: unit, errorMessage: null);
  void updateConversionFactor(String factor) =>
      state = state.copyWith(conversionFactor: factor, errorMessage: null);
  void updateSellPricePerUnit(String price) =>
      state = state.copyWith(sellPricePerRetail: price, errorMessage: null);
  void updateSellPricePerBulk(String price) =>
      state = state.copyWith(sellPricePerBulk: price, errorMessage: null);

  void reset() {
    state = const AddProductState();
  }

  Future<ApiResponse<void>> submitProduct() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final branch = ref.read(activeBranchProvider);
      final branchId = branch?.id ?? '';

      final newGlobalProduct = GlobalProductData(
        id: const Uuid().v4(),
        name: state.name,
        description: 'description of ${state.name}',
        barcode: state.barcode,
        imageUrl: '',
        normalizedName: normalizeName(state.name),
        category: '',

        syncStatus: 'pending',
        syncDate: DateTime.now(),

        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final newProduct = ProductData(
        id: const Uuid().v4(),
        branchId: branchId,
        name: state.name,
        description: 'description of ${state.name}',
        bulkUnitName: state.bulkUnit,
        pieceUnitName: state.pieceUnit,
        unitsPerBulk: int.parse(state.conversionFactor),
        costPricePerUnit: 0,
        sellingPricePerPiece: int.parse(state.sellPricePerRetail),
        sellingPricePerBulk: int.parse(state.sellPricePerBulk),
        category: '',
        globalProductId: newGlobalProduct.id,

        imageUrl: '',
        reviews: '',

        syncStatus: 'pending',
        syncDate: DateTime.now(),

        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final productRepository = ref.read(productRepositoryProvider);
      final inventoryRepository = ref.read(inventoryRepositoryProvider);
      final productResponse = await productRepository.createProduct(
        newProduct,
        newGlobalProduct,
      );
      final inventoryResponse = await inventoryRepository.addInventoryItem(
        newProduct,
      );

      if (productResponse.success) {
        state = state.copyWith(isLoading: false, isSuccess: true);
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: productResponse.message,
        );
      }

      if (inventoryResponse.success) {
        state = state.copyWith(isLoading: false, isSuccess: true);
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: inventoryResponse.message,
        );
      }
      return productResponse;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
      return ApiResponse(data: null, success: false, message: e.toString());
    }
  }
}

final addProductViewModelProvider =
    NotifierProvider.autoDispose<AddProductViewModel, AddProductState>(
      AddProductViewModel.new,
    );
