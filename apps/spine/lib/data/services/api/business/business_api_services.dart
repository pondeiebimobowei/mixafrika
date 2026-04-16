import 'package:dio/dio.dart';
import 'package:spine/data/services/api/business/business_api_services_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/models/business_model.dart';
import 'package:spine/drift/database.dart';

class BusinessApiServices implements BusinessApiServicesAbstract {
  @override
  Future<ApiResponse<List<BusinessesData>>> getBusinesses() async {
    try {
      final res = await apiPrivate.get('/business');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => BusinessMapper.fromJson(e).toData()).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <BusinessesData>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  @override
  Future<ApiResponse<BusinessesData>> createBusiness(
    BusinessesData business,
  ) async {
    try {
      final res = await apiPrivate.post(
        '/business',
        data: {
          'id': business.id,
          'name': business.name,
          'phone': business.phone,
          'streetAddress': business.streetAddress,
          'city': business.city,
          'state': business.state,
          'country': business.country,

          'syncStatus': business.syncStatus,
          'syncDate': business.syncDate,

          'createdAt': business.createdAt,
          'updatedAt': business.updatedAt,
          'deletedAt': business.deletedAt,
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

final businessApiServiceProvider = Provider((ref) => BusinessApiServices());
