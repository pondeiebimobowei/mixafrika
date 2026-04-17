import 'package:dio/dio.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

class TeamApiServices {
  Future<ApiResponse> inviteMember({
    required String businessId,
    required String email,
    required String role,
    String? branchId,
  }) async {
    try {
      final res = await apiPrivate.post(
        '/team/invite/$businessId',
        data: {
          'email': email,
          'role': role,
          'branch_id': branchId,
        },
      );
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: null,
      );
    }
  }

  Future<ApiResponse<List<BusinessUserData>>> getTeamMembers(String businessId) async {
    try {
      final res = await apiPrivate.get('/team/members/$businessId');
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  Future<ApiResponse<List<Invite>>> getPendingInvitations(String businessId) async {
    try {
      final res = await apiPrivate.get('/team/invitations/$businessId');
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  Future<ApiResponse> acceptInvitation(String token) async {
    try {
      final res = await apiPrivate.post(
        '/team/accept-invite',
        data: {'token': token},
      );
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: null,
      );
    }
  }

  Future<ApiResponse> removeMember(String businessId, String userId) async {
    try {
      final res = await apiPrivate.delete('/team/members/$businessId/$userId');
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: null,
      );
    }
  }

  Future<ApiResponse> cancelInvitation(String invitationId) async {
    try {
      final res = await apiPrivate.delete('/team/invitations/$invitationId');
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: null,
      );
    }
  }
}

final teamApiServiceProvider = Provider((ref) => TeamApiServices());
