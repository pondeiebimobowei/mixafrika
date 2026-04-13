import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/data/repositories/inventory/stock_transfer_repository.dart';
import 'package:spine/ui/inventory/state/stock_transfer_state.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class StockTransferViewModel
    extends AutoDisposeFamilyNotifier<StockTransferState, String> {
  @override
  StockTransferState build(String arg) {
    Future.microtask(() => _init());
    return StockTransferState();
  }

  Future<void> _init() async {
    state = state.copyWith(isLoading: true);

    final inventoryRepo = ref.read(inventoryRepositoryProvider);
    final inventoryItem = await inventoryRepo.getInventoryItemById(arg);

    final currentBusiness = ref.read(activeBusinessesProvider);
    if (currentBusiness == null) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'No active business',
      );
      return;
    }

    final transferRepo = ref.read(stockTransferRepositoryProvider);
    final branches = await transferRepo.getOtherBranches(currentBusiness.id);

    state = state.copyWith(
      product: inventoryItem?.product,
      inventoryItem: inventoryItem,
      branches: branches,
      isLoading: false,
    );
  }

  void selectBranch(BusinessesData branch) {
    state = state.copyWith(selectedBranch: branch);
  }

  void updateQuantity(String qty) {
    state = state.copyWith(quantity: qty);
  }

  void updateReason(String reason) {
    state = state.copyWith(reason: reason);
  }

  Future<void> submit() async {
    if (state.selectedBranch == null) {
      state = state.copyWith(
        errorMessage: 'Please select a destination branch',
      );
      return;
    }

    final qty = int.tryParse(state.quantity) ?? 0;
    if (qty <= 0) {
      state = state.copyWith(errorMessage: 'Please enter a valid quantity');
      return;
    }

    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final currentBusiness = ref.read(activeBusinessesProvider);
      final transferRepo = ref.read(stockTransferRepositoryProvider);

      // For now, we'll use a dummy user ID or get it from auth state if available
      const userId = 'current-user-id';

      await transferRepo.executeTransfer(
        productId: arg,
        fromBranchId: currentBusiness!.id,
        toBranchId: state.selectedBranch!.id,
        quantity: qty,
        reason: state.reason,
        userId: userId,
      );

      state = state.copyWith(isLoading: false, isSuccess: true);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

final stockTransferViewModelProvider = NotifierProvider.autoDispose
    .family<StockTransferViewModel, StockTransferState, String>(
      StockTransferViewModel.new,
    );
