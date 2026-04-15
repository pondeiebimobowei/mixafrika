import 'package:spine/data/repositories/auth/auth_repository_abstract.dart';
import 'package:spine/data/services/api/auth/auth_api_services.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepository implements AuthRepositoryAbstract {
  AuthRepository({required AuthApiServices authApiServices})
    : _authApiServices = authApiServices;

  final AuthApiServices _authApiServices;

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
  Future<ApiResponse<void>> logOut() {
    // TODO: implement logOut
    throw UnimplementedError();
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
}

final authRepositoryProvider = Provider(
  (ref) => AuthRepository(authApiServices: AuthApiServices()),
);
