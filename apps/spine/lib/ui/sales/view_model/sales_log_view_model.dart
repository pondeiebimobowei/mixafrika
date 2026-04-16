import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/sales/sales_repository.dart';
import 'package:spine/ui/sales/state/sales_log_state.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';

class SalesLogViewModel extends StateNotifier<SalesLogState> {
  final Ref ref;

  SalesLogViewModel(this.ref) : super(const SalesLogState()) {
    fetchSales();
  }

  Future<void> fetchSales() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final activeBranch = ref.read(activeBranchProvider);
      if (activeBranch == null) {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'No active branch',
        );
        return;
      }

      final repository = ref.read(salesRepositoryProvider);
      final sales = await repository.getSalesWithItems(
        branchId: activeBranch.id,
      );

      state = state.copyWith(sales: sales, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to fetch sales: $e',
      );
    }
  }

  void setPeriod(SalesPeriod period) {
    state = state.copyWith(period: period);
    // In a real app, we might re-fetch from the repository with date filters
    // For now, we'll just handle the state update
  }
}

final salesLogViewModelProvider =
    StateNotifierProvider.autoDispose<SalesLogViewModel, SalesLogState>((ref) {
      return SalesLogViewModel(ref);
    });
