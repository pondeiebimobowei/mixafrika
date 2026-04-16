import 'package:spine/drift/database.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';

class StockTransferState {
  final ProductData? product;
  final InventoryItemData? inventoryItem;
  final List<BranchData> branches;
  final BranchData? selectedBranch;
  final bool isLoading;
  final bool isSuccess;
  final String? errorMessage;
  final String quantity;
  final String reason;

  StockTransferState({
    this.product,
    this.inventoryItem,
    this.branches = const [],
    this.selectedBranch,
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMessage,
    this.quantity = '',
    this.reason = '',
  });

  StockTransferState copyWith({
    ProductData? product,
    InventoryItemData? inventoryItem,
    List<BranchData>? branches,
    BranchData? selectedBranch,
    bool? isLoading,
    bool? isSuccess,
    String? errorMessage,
    String? quantity,
    String? reason,
  }) {
    return StockTransferState(
      product: product ?? this.product,
      inventoryItem: inventoryItem ?? this.inventoryItem,
      branches: branches ?? this.branches,
      selectedBranch: selectedBranch ?? this.selectedBranch,
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMessage: errorMessage,
      quantity: quantity ?? this.quantity,
      reason: reason ?? this.reason,
    );
  }
}
