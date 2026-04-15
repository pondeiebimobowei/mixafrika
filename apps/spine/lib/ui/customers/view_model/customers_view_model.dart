import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/customer/customer_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/customers/state/customers_state.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';
import 'package:uuid/uuid.dart';

class CustomersViewModel extends StateNotifier<CustomersState> {
  final CustomerRepository _customerRepository;
  final BranchData? _activeBranch;

  CustomersViewModel({
    required CustomerRepository customerRepository,
    required BranchData? activeBranch,
  }) : _customerRepository = customerRepository,
       _activeBranch = activeBranch,
       super(CustomersState()) {
    loadCustomers();
  }

  Future<void> loadCustomers() async {
    if (_activeBranch == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final customers = await _customerRepository.getCustomers(
        _activeBranch.id,
      );
      state = state.copyWith(
        customers: customers,
        isLoading: false,
        clearError: true,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> searchCustomers(String query) async {
    if (_activeBranch == null) return;
    state = state.copyWith(searchQuery: query);
    if (query.isEmpty) {
      loadCustomers();
      return;
    }
    try {
      final results = await _customerRepository.searchCustomers(
        _activeBranch.id,
        query,
      );
      state = state.copyWith(customers: results);
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
    }
  }

  Future<void> addCustomer(String name, String phone) async {
    if (_activeBranch == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final companion = CustomerCompanion(
        id: Value(const Uuid().v4()),
        name: Value(name),
        phone: Value(phone),
        branchId: Value(_activeBranch.id),
        createdAt: Value(DateTime.now()),
        updatedAt: Value(DateTime.now()),
        syncStatus: const Value('pending'),
      );
      await _customerRepository.addCustomer(companion);
      await loadCustomers();
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> updateCustomer(String id, String name, String phone) async {
    if (_activeBranch == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final companion = CustomerCompanion(
        id: Value(id),
        name: Value(name),
        phone: Value(phone),
        updatedAt: Value(DateTime.now()),
      );
      await _customerRepository.updateCustomer(companion);
      await loadCustomers();
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> deleteCustomer(String id) async {
    state = state.copyWith(isLoading: true);
    try {
      await _customerRepository.deleteCustomer(id);
      await loadCustomers();
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

final customersViewModelProvider =
    StateNotifierProvider<CustomersViewModel, CustomersState>((ref) {
      return CustomersViewModel(
        customerRepository: ref.watch(customerRepositoryProvider),
        activeBranch: ref.watch(activeBranchProvider),
      );
    });
