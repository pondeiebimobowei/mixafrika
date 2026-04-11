import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/sales/sales_repository.dart';
import 'package:spine/ui/sales/state/sale_details_state.dart';

class SaleDetailsViewModel extends StateNotifier<SaleDetailsState> {
  final Ref ref;
  final String saleId;

  SaleDetailsViewModel(this.ref, this.saleId)
    : super(const SaleDetailsState()) {
    fetchSaleDetails();
  }

  Future<void> fetchSaleDetails() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final repository = ref.read(salesRepositoryProvider);
      final item = await repository.getSaleById(saleId);

      if (item != null) {
        state = state.copyWith(item: item, isLoading: false);
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Sale not found',
        );
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to fetch sale details: $e',
      );
    }
  }
}

final saleDetailsViewModelProvider = StateNotifierProvider.autoDispose
    .family<SaleDetailsViewModel, SaleDetailsState, String>((ref, saleId) {
      return SaleDetailsViewModel(ref, saleId);
    });
