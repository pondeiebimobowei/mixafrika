import 'package:drift/drift.dart';
import 'package:spine/data/services/models/user_model.dart';
import 'package:spine/drift/database.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';


class UserRepository {
  UserRepository({required AppDatabase database}) : _database = database;

  final AppDatabase _database;


  Future<void> saveUser (List<User?> users) async {
    final validUsers = users.whereType<UserData>();
    await _database.batch((batch) {

    batch.insertAllOnConflictUpdate(
      _database.user,
      validUsers.map((b) => UserCompanion.insert(
        id: b.id,
        firstName: b.firstName,
        lastName: b.lastName,
        creditScore: b.creditScore,
        creditScoreStatus: b.creditScoreStatus,
        email: b.email,
        isEmailVerified: b.isEmailVerified,
        isVerified: b.isVerified,
        password: b.password,
        role: b.role,      
        syncStatus: b.syncStatus,
        syncDate: Value(b.syncDate),
        createdAt: Value(b.createdAt),
        updatedAt: Value(b.updatedAt),
      )).toList()
      ,
    );
  });
}

}

final userRepositoryProvider = Provider(
  (ref) => UserRepository(database: ref.watch(databaseProvider)),
);
