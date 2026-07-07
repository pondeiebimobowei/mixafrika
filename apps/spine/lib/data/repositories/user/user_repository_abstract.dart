import 'package:spine/drift/database.dart';

abstract class UserRepositoryAbstract {
  Future<void> saveUser (List<UserData> user);
}
