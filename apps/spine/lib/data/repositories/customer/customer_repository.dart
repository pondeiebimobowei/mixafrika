import 'package:drift/drift.dart';
import 'package:spine/data/repositories/customer/customer_repository_abstract.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CustomerRepository implements CustomerRepositoryAbstract {
  final AppDatabase _database;

  CustomerRepository({required AppDatabase database}) : _database = database;

  @override
  Future<List<CustomerData>> getCustomers(String branchId) async {
    return await (_database.select(_database.customer)
          ..where((t) => t.branchId.equals(branchId)))
        .get();
  }

  @override
  Future<List<CustomerData>> searchCustomers(String branchId, String query) async {
    return await (_database.select(_database.customer)
          ..where((t) => t.branchId.equals(branchId))
          ..where((t) => t.name.contains(query) | t.phone.contains(query)))
        .get();
  }

  @override
  Future<void> addCustomer(CustomerCompanion customer) async {
    await _database.into(_database.customer).insert(customer);
  }

  @override
  Future<void> updateCustomer(CustomerCompanion customer) async {
    await (_database.update(_database.customer)..where((t) => t.id.equals(customer.id.value))).write(customer);
  }

  @override
  Future<void> deleteCustomer(String id) async {
    await (_database.delete(_database.customer)..where((t) => t.id.equals(id))).go();
  }
}

final customerRepositoryProvider = Provider<CustomerRepository>((ref) {
  return CustomerRepository(database: ref.watch(databaseProvider));
});
