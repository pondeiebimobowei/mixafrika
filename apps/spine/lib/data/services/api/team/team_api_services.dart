import 'package:dio/dio.dart';
import 'package:spine/data/repositories/team/team_local_repository_abstract.dart';
import 'package:spine/data/repositories/team/team_remote_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/config/base_api_config.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/drift/database.dart';

class TeamApiServices implements TeamRemoteRepository, TeamLocalRepository {
  @override
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
  
  @override
  Future<ApiResponse<List<BranchUserWithUser>>> getBranchTeamMembers(String businessBranchId) async {
    try {
      final res = await apiPrivate.get('/team/branch/members/$businessBranchId');
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  @override
  Future<ApiResponse<List<Invite>>> getBranchPendingInvitations(String branchId) async {
    try {
      final res = await apiPrivate.get('/team/branch/invitations/$branchId');
      return ApiResponse.fromJson(res.data, (data) => data);
    } on DioException catch (err) {
      return ApiResponse(
        success: false,
        message: err.response?.data['message'] ?? err.message ?? 'Unknown error',
        data: [],
      );
    }
  }

  @override
  Future<ApiResponse<void>> acceptInvitation(String token) async {
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

  @override
  Future<ApiResponse<void>> removeMember(String businessId, String userId) async {
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

  @override
  Future<ApiResponse<void>> cancelInvitation(String invitationId) async {
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
