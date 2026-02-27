import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/add_product_state.dart';
import 'package:uuid/uuid.dart';
import 'package:spine/ui/user_business/active_user_business_provider.dart';
import 'package:spine/data/services/api/config/api_response.dart';

class AddProductViewModel extends StateNotifier<AddProductState> {
  AddProductViewModel(this.ref) : super(const AddProductState());

  final Ref ref;

  void updateName(String name) =>
      state = state.copyWith(name: name, errorMessage: null);
  void updateBarcode(String barcode) =>
      state = state.copyWith(barcode: barcode, errorMessage: null);
  void updateBulkUnit(String unit) =>
      state = state.copyWith(bulkUnit: unit, errorMessage: null);
  void updateRetailUnit(String unit) =>
      state = state.copyWith(retailUnit: unit, errorMessage: null);
  void updateConversionFactor(String factor) =>
      state = state.copyWith(conversionFactor: factor, errorMessage: null);
  void updateSellPricePerRetail(String price) =>
      state = state.copyWith(sellPricePerRetail: price, errorMessage: null);
  void updateSellPricePerBulk(String price) =>
      state = state.copyWith(sellPricePerBulk: price, errorMessage: null);

  void reset() {
    state = const AddProductState();
  }

  Future<ApiResponse<void>> submitProduct() async {
    if (state.name.isEmpty) {
      state = state.copyWith(errorMessage: 'Product name is required');
      return ApiResponse(
        data: null,
        success: false,
        message: 'Product name is required',
      );
    }

    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final business = ref.read(activeUserBusinessProvider);
      final businessId = business?.id ?? '';

      final newProduct = ProductData(
        id: const Uuid().v4(),
        businessId: businessId,
        name: state.name,
        description: '', // Optional in UI
        bulkUnitName: state.bulkUnit.isEmpty ? 'Bulk' : state.bulkUnit,
        pieceUnitName: state.retailUnit.isEmpty ? 'Piece' : state.retailUnit,
        unitsPerBulk: int.tryParse(state.conversionFactor) ?? 1,
        costPrice: 0, // Optional or not in UI
        sellingPricePerPiece: int.tryParse(state.sellPricePerRetail) ?? 0,
        sellingPricePerBulk: int.tryParse(state.sellPricePerBulk) ?? 0,
        category: '',
        serialNumber: state.barcode,
        imageUrl: '',
        reviews: '[]',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        deletedAt: DateTime.now(),
        syncStatus: 'pending',
        syncDate: DateTime.now(),
      );

      final repository = ref.read(productRepositoryProvider);
      final inventoryRepository = ref.read(inventoryRepositoryProvider);
      final response = await repository.createProduct(newProduct);
      await inventoryRepository.addInventoryItem(newProduct);

      if (response.success) {
        state = state.copyWith(isLoading: false, isSuccess: true);
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: response.message,
        );
      }
      return response;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
      return ApiResponse(data: null, success: false, message: e.toString());
    }
  }
}

final addProductViewModelProvider =
    StateNotifierProvider.autoDispose<AddProductViewModel, AddProductState>(
      (ref) => AddProductViewModel(ref),
    );
