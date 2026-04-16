import 'package:dio/dio.dart';
import 'package:spine/data/services/api/branch/branch_api_services_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

class BranchApiServices implements BranchApiServicesAbstract {

  @override
  Future<ApiResponse<BranchData>> getBranchById(String id) async {
    try {
      final res = await apiPrivate.get('/branch/$id');

      return ApiResponse.fromJson(
        res.data,
        (data) => BranchData.fromJson(data),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => BranchData.fromJson(err.response!.data));
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: BranchData.fromJson(err.response!.data),
      );
    }
  }

  @override
  Future<ApiResponse<List<BranchData>>> getBranchesByBusinessId(String businessId) async {
    try {
      final res = await apiPrivate.get('/branch/$businessId');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => BranchData.fromJson(e)).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <BranchData>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  @override
  Future<ApiResponse<List<BranchData>>> getBranches() async {
    try {
      final res = await apiPrivate.get('/branch');

      return ApiResponse.fromJson(
        res.data,
        (data) => (data as List).map((e) => BranchData.fromJson(e)).toList(),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(err.response!.data, (_) => <BranchData>[]);
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  @override
  Future<ApiResponse<BranchData>> createBranch(
    BranchData branch,
  ) async {
    try {
      final res = await apiPrivate.post(
        '/branch',
        data: {
          'id': branch.id,
          'name': branch.name,
          'phone': branch.phone,
          'streetAddress': branch.streetAddress,
          'city': branch.city,
          'state': branch.state,
          'country': branch.country,

          'syncStatus': branch.syncStatus,
          'syncDate': branch.syncDate,

          'createdAt': branch.createdAt,
          'updatedAt': branch.updatedAt,
          'deletedAt': branch.deletedAt,
        },
      );

      return ApiResponse.fromJson(
        res.data,
        (_) => BranchData.fromJson(res.data),
      );
    } on DioException catch (err) {
      if (err.response?.data != null) {
        return ApiResponse.fromJson(
          err.response!.data,
          (_) => BranchData.fromJson(err.response!.data),
        );
      }

      return ApiResponse(
        success: false,
        message: err.message ?? 'Unknown error',
        data: BranchData.fromJson(err.response!.data),
      );
    }
  }
}

final branchApiServiceProvider = Provider((ref) => BranchApiServices());
