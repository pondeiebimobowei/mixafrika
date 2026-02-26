import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/add_stock_state.dart';
import 'package:spine/ui/user_business/active_user_business_provider.dart';

class AddStockViewModel extends StateNotifier<AddStockState> {
  AddStockViewModel(this.ref) : super(const AddStockState()) {
    _init();
  }

  final Ref ref;

  Future<void> _init() async {
    state = state.copyWith(isLoading: true);
    final business = ref.read(activeUserBusinessProvider);
    if (business != null) {
      final products = await ref
          .read(productRepositoryProvider)
          .getProductsByBusinessId(business.id);
      state = state.copyWith(products: products, isLoading: false);
    } else {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'No active business found',
      );
    }
  }

  void selectProduct(ProductData? product) =>
      state = state.copyWith(selectedProduct: product, errorMessage: null);
  void updateSearchQuery(String query) =>
      state = state.copyWith(searchQuery: query);
  void updateBulkQuantity(String qty) {
    if (state.selectedProduct == null) {
      state = state.copyWith(bulkQuantity: qty);
      return;
    }
    final bulk = double.tryParse(qty) ?? 0;
    final unitsPerBulk =
        double.tryParse(state.selectedProduct!.unitsPerBulk) ?? 1;
    final pieces = bulk * unitsPerBulk;
    state = state.copyWith(
      bulkQuantity: qty,
      pieceQuantity: pieces == 0 ? '' : pieces.toStringAsFixed(0),
    );
  }

  void updatePieceQuantity(String qty) {
    if (state.selectedProduct == null) {
      state = state.copyWith(pieceQuantity: qty);
      return;
    }
    final pieces = double.tryParse(qty) ?? 0;
    final unitsPerBulk =
        double.tryParse(state.selectedProduct!.unitsPerBulk) ?? 1;
    final bulk = pieces / unitsPerBulk;
    state = state.copyWith(
      pieceQuantity: qty,
      bulkQuantity: bulk == 0 ? '' : bulk.toStringAsFixed(2),
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
      final repository = ref.read(inventoryRepositoryProvider);
      final business = ref.read(activeUserBusinessProvider);

      if (business == null) throw Exception('Active business not found');

      // Note: We'll implement recordPurchase in InventoryRepository
      await repository.addStock(
        productId: state.selectedProduct!.id,
        businessId: business.id,
        bulkQuantity: state.bulkQuantity,
        pieceQuantity: state.pieceQuantity,
        totalCost: state.totalCost,
        expiryDate: state.expiryDate,
      );

      state = state.copyWith(isLoading: false, isSuccess: true);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

final addStockViewModelProvider =
    StateNotifierProvider.autoDispose<AddStockViewModel, AddStockState>(
      (ref) => AddStockViewModel(ref),
    );
