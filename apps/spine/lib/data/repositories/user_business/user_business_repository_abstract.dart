import 'package:spine/drift/database.dart';

abstract class UserBusinessRepositoryAbstract {
  Future<void> deleteUserBusiness(String id);

  Future<UserBusinessData> getUserBusiness(String id);

  Future<void> createUserBusiness(String userId);

  Future<List<UserBusinessData>> getUserBusinesses();

  Future<List<UserBusinessData>> getUserBusinessess();
}
