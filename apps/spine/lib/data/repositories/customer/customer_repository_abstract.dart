import 'package:spine/drift/database.dart';

abstract class CustomerRepositoryAbstract {
  Future<List<CustomerData>> getCustomers(String branchId);
  Future<List<CustomerData>> searchCustomers(String branchId, String query);
  Future<void> addCustomer(CustomerCompanion customer);
  Future<void> updateCustomer(CustomerCompanion customer);
  Future<void> deleteCustomer(String id);
}
