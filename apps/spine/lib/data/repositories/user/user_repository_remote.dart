import 'package:spine/data/repositories/user/user_repository_abstract.dart';
import 'package:spine/data/services/api/user/user_api_services.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class UserRepositoryRemote implements UserRepositoryAbstract {
  UserRepositoryRemote({
    required AppDatabase database,
    required UserApiServices userApiService,
  });

  @override
  Future<void> saveUser (List<UserData?> user) async {}
}

final userRepositoryRemoteProvider = Provider(
  (ref) => UserRepositoryRemote(
    database: ref.watch(databaseProvider),
    userApiService: ref.watch(userApiServiceProvider),
  ),
);
