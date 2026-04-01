import 'package:dio/dio.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';

class AuthApiServices {
  Future<ApiResponse<AuthResponse>> login(String email, String password) async {
    try {
      final response = await api.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      return ApiResponse.fromJson(
        response.data,
        (data) => AuthResponse.fromJson(data),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(
          err.response!.data,
          (_) => AuthResponse(token: '', refreshToken: '', user: null),
        );
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: AuthResponse(token: '', refreshToken: '', user: null),
      );
    }
  }
  Future<ApiResponse<AuthResponse>> signUp(String firstName, String lastName, String phone, String email, String password) async {
    try {
      final response = await api.post(
        '/auth/signup',
        data: {'first_name': firstName, 'last_name': lastName, 'phone_number': phone, 'email': email, 'password': password, 'role': 'trader'},
      );

      return ApiResponse.fromJson(
        response.data,
        (data) => AuthResponse.fromJson(data),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(
          err.response!.data,
          (_) => AuthResponse(token: '', refreshToken: '', user: null),
        );
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: AuthResponse(token: '', refreshToken: '', user: null),
      );
    }
  }
}
