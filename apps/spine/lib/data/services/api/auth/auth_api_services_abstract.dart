import 'package:spine/data/services/api/config/api_response.dart';

abstract class AuthApiServicesAbstract {
  Future<ApiResponse<AuthResponse>> login(String email, String password);

  // Future<ApiResponse<void>> logOut();

  Future<ApiResponse<AuthResponse>> signUp(
    String firstName,
    String lastName,
    String phone,
    String email,
    String password,
  );
}
