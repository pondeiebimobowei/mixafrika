import 'package:spine/data/repositories/sales/sales_repository_abstract.dart';

enum SalesPeriod { daily, weekly, monthly }

class SalesLogState {
  final List<SaleWithItems> sales;
  final bool isLoading;
  final String? errorMessage;
  final SalesPeriod period;

  const SalesLogState({
    this.sales = const [],
    this.isLoading = false,
    this.errorMessage,
    this.period = SalesPeriod.daily,
  });

  SalesLogState copyWith({
    List<SaleWithItems>? sales,
    bool? isLoading,
    String? errorMessage,
    SalesPeriod? period,
  }) {
    return SalesLogState(
      sales: sales ?? this.sales,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      period: period ?? this.period,
    );
  }

  int get periodInflow {
    return sales.fold(0, (sum, item) => sum + item.sale.amountPaid);
  }

  int get totalSales {
    return sales.fold(0, (sum, item) => sum + item.sale.totalAmount);
  }

  int get totalOwed {
    return sales.fold(0, (sum, item) => sum + item.sale.balance);
  }
}
