import 'package:spine/drift/database.dart';

class CustomersState {
  final List<CustomerData> customers;
  final bool isLoading;
  final String? errorMessage;
  final String searchQuery;

  CustomersState({
    this.customers = const [],
    this.isLoading = false,
    this.errorMessage,
    this.searchQuery = '',
  });

  CustomersState copyWith({
    List<CustomerData>? customers,
    bool? isLoading,
    String? errorMessage,
    String? searchQuery,
    bool clearError = false,
  }) {
    return CustomersState(
      customers: customers ?? this.customers,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }
}
