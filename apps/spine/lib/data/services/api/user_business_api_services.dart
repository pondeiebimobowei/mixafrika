import 'package:dio/dio.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:spine/data/services/models/user_business_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

class UserBusinessApiServices {
  Future<ApiResponse<List<UserBusiness>>> getUserBusiness() async {
    try {
      final res = await apiPrivate.get('/user_business');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => UserBusiness.fromJson(e)).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <UserBusiness>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  Future<ApiResponse<UserBusinessData>> createUserBusiness(UserBusinessData userBusiness) async {
    try {
      final res = await apiPrivate.post('/user_business', data: {
        'id': userBusiness.id,
        
        'userId': userBusiness.userId,
        'collectionId': userBusiness.collectionId,
        'name': userBusiness.name,
        'type': userBusiness.type,
        'phone': userBusiness.phone,
        'streetAddress': userBusiness.streetAddress,
        'city': userBusiness.city,
        'state': userBusiness.state,
        'country': userBusiness.country,
        'verification': userBusiness.verification,
        
        'syncStatus': userBusiness.syncStatus,
        'syncDate': userBusiness.syncDate,

        'createdAt': userBusiness.createdAt,
        'updatedAt': userBusiness.updatedAt,
        'deletedAt': userBusiness.deletedAt,
      });

      return ApiResponse.fromJson(res.data, (_) => UserBusinessData.fromJson(res.data));
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => UserBusinessData.fromJson(err.response!.data));
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: UserBusinessData.fromJson(err.response!.data),
      );
    }
  }
}

final userBusinessApiServiceProvider = Provider((ref) => UserBusinessApiServices());
