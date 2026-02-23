import 'package:spine/data/services/models/user_model.dart';

class ApiResponse<T> {
  final bool success;
  final String message;
  final T data;

  ApiResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic json) parser,
  ) {
    return ApiResponse<T>(
      success: json['success'],
      message: json['message'],
      data: parser(json['data']),
    );
  }
}


class AuthResponse {
  final String token;
  final String refreshToken;
  final User? user;

  AuthResponse({
    required this.token,
    required this.refreshToken,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'],
      refreshToken: json['refresh_token'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
    );
  }
}