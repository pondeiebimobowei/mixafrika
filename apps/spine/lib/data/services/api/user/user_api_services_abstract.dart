import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

abstract class UserApiServicesAbstract {
  Future<ApiResponse<List<UserData>>> getUsers();

}