import 'package:spine/data/services/api/config/api_response.dart';

abstract class AuthRepositoryAbstract {
  Future<ApiResponse<void>> login(String email, String password);

  Future<ApiResponse<void>> logOut();

  Future<ApiResponse<void>> signUp(String email, String password);
}
