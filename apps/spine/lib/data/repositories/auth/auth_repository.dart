import 'package:drift/drift.dart';
import 'package:spine/data/repositories/auth/auth_repository_abstract.dart';
import 'package:spine/data/services/api/auth/auth_api_services.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepository implements AuthRepositoryAbstract {
  AuthRepository({required AuthApiServices authApiServices, required AppDatabase database})
    : _authApiServices = authApiServices,
      _database = database;

  final AuthApiServices _authApiServices;
  final AppDatabase _database;

  @override
  Future<ApiResponse<AuthResponse>> login(String email, String password) async {
    final res = await _authApiServices.login(email, password);

    return ApiResponse(
      data: res.data,
      message: res.message,
      success: res.success,
    );
  }

  @override
  Future<ApiResponse<void>> logOut() async {
    
    await AppPreferences.clearAll();

    final List<TableInfo<Table, dynamic>> tablesInDeleteOrder  = [
      _database.stockMovement,
      _database.stockTransferItem,
      _database.stockTransfer,
      _database.stockAdjustment,
      _database.payments,
      _database.salesItem,
      _database.sales,
      _database.invites,
      _database.inventory,
      _database.customer,
      _database.businessUser,
      _database.globalProduct,
      _database.cluster,
      _database.businessVerification,
      _database.spineBatch,
      _database.productImage,
      _database.productCategory,
      _database.product,
      _database.branchUser,
      _database.branch,
      _database.businesses,
      _database.collection,
      _database.user,
    ];


    await _database.transaction(() async {

    for (final table in tablesInDeleteOrder) {
      await _database.delete(table).go();
    }

  });
    return ApiResponse(
      data: null,
      message: 'Logged out successfully',
      success: true,
    );
  }

  @override
  Future<ApiResponse<AuthResponse>> signUp(String firstName, String lastName, String phone, String email, String password) async {
    final res = await _authApiServices.signUp(firstName, lastName, phone, email, password);

    return ApiResponse(
      data: res.data,
      message: res.message,
      success: res.success,
    );
  }

  @override
  Future<ApiResponse<void>> syncData() async {
    final res = await _authApiServices.syncData();

    if (res.success) {
      final data = res.data;
      await _database.transaction(() async {
        // Upsert User
        if (data.user != null) {
          await _database.into(_database.user).insertOnConflictUpdate(data.user!.toData());
        }

        // Upsert Businesses
        for (final business in data.businesses) {
          await _database.into(_database.businesses).insertOnConflictUpdate(business.toData());
        }

        // Upsert Collections
        for (final collection in data.collections) {
          await _database.into(_database.collection).insertOnConflictUpdate(collection.toData());
        }

        // Upsert BusinessUsers
        for (final bu in data.businessUsers) {
          await _database.into(_database.businessUser).insertOnConflictUpdate(bu.toData());
        }

        // Upsert Branches
        for (final branch in data.branches) {
          await _database.into(_database.branch).insertOnConflictUpdate(branch.toData());
        }

        // Upsert BranchUsers
        for (final bru in data.branchUsers) {
          await _database.into(_database.branchUser).insertOnConflictUpdate(bru.toData());
        }
      });
    }

    return ApiResponse(
      data: null,
      message: res.message,
      success: res.success,
    );
  }
}

final authRepositoryProvider = Provider(
  (ref) => AuthRepository(
    authApiServices: ref.read(authApiServicesProvider),
    database: ref.read(databaseProvider),
  ),
);
