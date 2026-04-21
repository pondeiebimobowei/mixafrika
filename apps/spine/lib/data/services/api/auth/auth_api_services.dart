import 'package:dio/dio.dart';
import 'package:spine/data/services/api/auth/auth_api_services_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:spine/data/services/api/auth/sync_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthApiServices implements AuthApiServicesAbstract {
  @override
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
  
  @override
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

  @override
  Future<ApiResponse<SyncResponse>> syncData() async {
    try {
      final response = await apiPrivate.get('/auth/sync');

      return ApiResponse.fromJson(
        response.data,
        (data) => SyncResponse.fromJson(data),
      );
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: SyncResponse(
          user: null,
          businessUsers: [],
          businesses: [],
          branchUsers: [],
          branches: [],
        ),
      );
    }
  }
}

final authApiServicesProvider = Provider((ref) => AuthApiServices());
