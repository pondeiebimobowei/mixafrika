import 'package:dio/dio.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:spine/data/services/models/user_business_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

class BusinessesApiServices {
  Future<ApiResponse<List<Businesses>>> getBusinesses() async {
    try {
      final res = await apiPrivate.get('/user_business');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => Businesses.fromJson(e)).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <Businesses>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  Future<ApiResponse<BusinessesData>> createBusinesses(
    BusinessesData businesses,
  ) async {
    try {
      final res = await apiPrivate.post(
        '/user_business',
        data: {
          'id': businesses.id,
          'collectionId': businesses.collectionId,
          'name': businesses.name,
          'type': businesses.type,
          'phone': businesses.phone,
          'streetAddress': businesses.streetAddress,
          'city': businesses.city,
          'state': businesses.state,
          'country': businesses.country,
          'verification': businesses.verification,

          'syncStatus': businesses.syncStatus,
          'syncDate': businesses.syncDate,

          'createdAt': businesses.createdAt,
          'updatedAt': businesses.updatedAt,
          'deletedAt': businesses.deletedAt,
        },
      );

      return ApiResponse.fromJson(
        res.data,
        (_) => BusinessesData.fromJson(res.data),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(
          err.response!.data,
          (_) => BusinessesData.fromJson(err.response!.data),
        );
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: BusinessesData.fromJson(err.response!.data),
      );
    }
  }
}

final businessesApiServiceProvider = Provider((ref) => BusinessesApiServices());
