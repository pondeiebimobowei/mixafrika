import 'package:spine/data/repositories/user_business/user_business_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/user_business_api_services.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

class UserBusinessRepositoryRemote implements UserBusinessRepositoryAbstract {
  UserBusinessRepositoryRemote({
    required AppDatabase database,
    required UserBusinessApiServices apiService,
  }) : _database = database,
       _apiService = apiService;

  final AppDatabase _database;
  final UserBusinessApiServices _apiService;

  @override
  Future<ApiResponse<UserBusinessData>> createUserBusiness(
    String userId,
  ) async {
    UserBusinessData userBusiness = UserBusinessData(
      id: Uuid().v4(),
      userId: userId,
      collectionId: Uuid().v4(),
      name: 'Trader Business',
      type: 'business',
      phone: '08023467856',
      streetAddress: '123 Main St',
      city: 'Gwarimpa',
      state: 'Abuja',
      country: 'Nigeria',
      verification: '',

      syncStatus: '',
      syncDate: DateTime.now(),

      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    final res = await _apiService.createUserBusiness(userBusiness);

    return ApiResponse(
      data: res.data,
      message: res.message,
      success: res.success,
    );
  }

  @override
  Future<UserBusinessData> getUserBusinessById(String id) async {
    final res = await _database.select(_database.userBusiness).get();

    return UserBusinessData.fromJson(res.first.toJson());
  }

  @override
  Future<List<UserBusinessData>> getUserBusiness() async {
    List<UserBusinessData> allItems = await _database
        .select(_database.userBusiness)
        .get();

    return allItems.map((e) => UserBusinessData.fromJson(e.toJson())).toList();
  }

  @override
  Future<void> deleteUserBusiness(String id) async {
    await (_database.delete(
      _database.userBusiness,
    )..where((p) => p.id.equals(id))).go();
  }
}

final userBusinessRepositoryRemoteProvider = Provider(
  (ref) => UserBusinessRepositoryRemote(
    database: ref.watch(databaseProvider),
    apiService: ref.watch(userBusinessApiServiceProvider),
  ),
);
