import 'package:dio/dio.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/api/user/user_api_services_abstract.dart';
import 'package:spine/drift/database.dart';

class UserApiServices implements UserApiServicesAbstract {

  @override
  Future<ApiResponse<List<UserData>>> getUsers() async {
    try {
      final res = await apiPrivate.get('/user');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => UserData.fromJson(e)).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <UserData>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }
}

final userApiServiceProvider = Provider((ref) => UserApiServices());
