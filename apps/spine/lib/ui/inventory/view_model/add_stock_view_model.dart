import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/add_stock_state.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';

class AddStockViewModel extends AutoDisposeNotifier<AddStockState> {
  @override
  AddStockState build() {
    Future.microtask(() => _init());
    return const AddStockState();
  }

  Future<void> _init() async {
    state = state.copyWith(isLoading: true);
    final branch = ref.read(activeBranchProvider);
    if (branch != null) {
      final products = await ref
          .read(productRepositoryProvider)
          .getProductsByBranchId(branch.id);
      state = state.copyWith(products: products, isLoading: false);
    } else {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'No active Business Branch found',
      );
    }
  }

  void selectProduct(ProductData? product) => state = state.copyWith(
    selectedProduct: product,
    errorMessage: null,
    bulkQuantity: '',
    pieceQuantity: '',
  );
  void updateSearchQuery(String query) =>
      state = state.copyWith(searchQuery: query);
  void toggleEntryMode(bool isBulk) {
    if (state.isEnteringBulk == isBulk) return;
    state = state.copyWith(isEnteringBulk: isBulk);
  }

  void updateBulkQuantity(String qty) {
    if (state.selectedProduct == null) {
      state = state.copyWith(bulkQuantity: qty);
      return;
    }
    final bulk = int.tryParse(qty) ?? 0;
    final unitsPerBulk = state.selectedProduct!.unitsPerBulk;
    final pieces = bulk * unitsPerBulk;
    state = state.copyWith(
      bulkQuantity: qty,
      pieceQuantity: pieces == 0 ? '' : pieces.toString(),
    );
  }

  void updatePieceQuantity(String qty) {
    if (state.selectedProduct == null) {
      state = state.copyWith(pieceQuantity: qty);
      return;
    }
    final pieces = int.tryParse(qty) ?? 0;
    final unitsPerBulk = state.selectedProduct!.unitsPerBulk;
    final bulk = pieces ~/ (unitsPerBulk != 0 ? unitsPerBulk : 1);
    state = state.copyWith(
      pieceQuantity: qty,
      bulkQuantity: bulk == 0 ? '' : bulk.toString(),
    );
  }

  void updateTotalCost(String cost) => state = state.copyWith(totalCost: cost);
  void updateExpiryDate(DateTime? date) =>
      state = state.copyWith(expiryDate: date);

  Future<void> submit() async {
    if (state.selectedProduct == null) {
      state = state.copyWith(errorMessage: 'Please select a product');
      return;
    }

    if (state.bulkQuantity.isEmpty && state.pieceQuantity.isEmpty) {
      state = state.copyWith(errorMessage: 'Please enter quantity');
      return;
    }

    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final inventoryRepository = ref.read(inventoryRepositoryProvider);
      final branchProvider = ref.read(activeBranchProvider);

      if (branchProvider == null)
        throw Exception('Active branch not found');

      // Note: We'll implement recordPurchase in InventoryRepository
      await inventoryRepository.addStock(
        productId: state.selectedProduct!.id,
        branchId: branchProvider.id,
        pieceQuantity: int.tryParse(state.pieceQuantity) ?? 0,
        totalCost: state.totalCost,

        bulkPrice: int.tryParse(state.bulkPrice) ?? 0,
        piecePrice: int.tryParse(state.piecePrice) ?? 0,
        expiryDate: state.expiryDate,
      );

      state = state.copyWith(isLoading: false, isSuccess: true);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

final addStockViewModelProvider =
    NotifierProvider.autoDispose<AddStockViewModel, AddStockState>(
      AddStockViewModel.new,
    );
