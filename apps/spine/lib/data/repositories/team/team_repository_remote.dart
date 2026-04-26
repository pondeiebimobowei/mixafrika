
import 'package:spine/data/repositories/team/team_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/team/team_api_services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/drift/database.dart';

class TeamRepositoryRemote implements TeamRepositoryAbstract {
  TeamRepositoryRemote({
    required TeamApiServices apiService,
  }) : _apiService = apiService;

  final TeamApiServices _apiService;

  @override
  Future<ApiResponse<void>> inviteMember({
    required String branchId,
    required String businessId,
    required String email,
    required String role,
  }) async {
     await _apiService.inviteMember(
      businessId: businessId,
      email: email,
      role: role,
      branchId: branchId,
    );

    return ApiResponse(
      success: true,
      message: 'Member invited successfully',
      data: null,
    );
  }

  @override
  Future<ApiResponse<List<BranchUserWithUser>>> getBranchTeamMembers(String branchId) async {
    return await _apiService.getBranchTeamMembers(branchId);
  }

  @override
  Future<ApiResponse<List<Invite>>> getBranchPendingInvitations(String branchId) async {
    return await _apiService.getBranchPendingInvitations(branchId);
  }

  @override
  Future<ApiResponse<void>> acceptInvitation(String token) async {
    return await _apiService.acceptInvitation(token);
  }

  @override
  Future<ApiResponse<void>> removeMember(String businessId, String userId) async {
    return await _apiService.removeMember(businessId, userId);
  }

  @override
  Future<ApiResponse<void>> cancelInvitation(String invitationId) async {
    return await _apiService.cancelInvitation(invitationId);
  }
}

final teamRepositoryRemoteProvider = Provider(
  (ref) => TeamRepositoryRemote(
    apiService: ref.watch(teamApiServiceProvider),
  ),
);
