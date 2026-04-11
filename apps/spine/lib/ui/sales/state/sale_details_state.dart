import 'package:spine/data/repositories/sales/sales_repository_abstract.dart';

class SaleDetailsState {
  final SaleWithItems? item;
  final bool isLoading;
  final String? errorMessage;

  const SaleDetailsState({
    this.item,
    this.isLoading = false,
    this.errorMessage,
  });

  SaleDetailsState copyWith({
    SaleWithItems? item,
    bool? isLoading,
    String? errorMessage,
  }) {
    return SaleDetailsState(
      item: item ?? this.item,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}
