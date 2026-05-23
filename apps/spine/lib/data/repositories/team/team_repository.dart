

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/api/team/team_api_services.dart';
import 'package:spine/data/services/local/team/team_local_service.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/drift/database.dart';

abstract class TeamRepository {
  Future<ApiResponse<List<BranchUserWithUser>>> getBranchTeamMembers(
    String branchId,
  );

  Future<ApiResponse<List<Invite>>> getBranchPendingInvitations(
    String branchId,
  );

  Future<ApiResponse<void>> inviteMember({
    required String branchId,
    required String userId,
    required String businessId,
    required String email,
    required String role,
  });

  Future<ApiResponse<void>> acceptInvitation(
    String token,
  );

  Future<ApiResponse<void>> removeMember({
    required String businessId,
    required String userId,
  });

  Future<ApiResponse<void>> cancelInvitation(
    String invitationId,
  );
}



class TeamRepositoryImpl implements TeamRepository {
  final TeamApiServices remote;
  final TeamRepositoryLocal local;

  TeamRepositoryImpl({
    required this.remote,
    required this.local,
  });

  /// -------------------------------
  /// GET TEAM MEMBERS
  /// -------------------------------

  @override
  Future<ApiResponse<List<BranchUserWithUser>>>
      getBranchTeamMembers(
    String branchId,
  ) async {
      return await local.getBranchTeamMembers(branchId);

  }

  /// -------------------------------
  /// GET INVITATIONS
  /// -------------------------------

  @override
  Future<ApiResponse<List<Invite>>>
      getBranchPendingInvitations(
    String branchId,
  ) async {
      return await local.getBranchPendingInvitations(
        branchId,
      );
    
  }

  /// -------------------------------
  /// INVITE MEMBER
  /// -------------------------------

  @override
  Future<ApiResponse<void>> inviteMember({
    required String branchId,
    required String userId,
    required String businessId,
    required String email,
    required String role,
  }) async {
    return remote.inviteMember(
      branchId: branchId,
      businessId: businessId,
      email: email,
      role: role,
    );
  }

  /// -------------------------------
  /// ACCEPT INVITATION
  /// -------------------------------

  @override
  Future<ApiResponse<void>> acceptInvitation(
    String token,
  ) async {
    return remote.acceptInvitation(token);
  }

  /// -------------------------------
  /// REMOVE MEMBER
  /// -------------------------------

  @override
  Future<ApiResponse<void>> removeMember({
    required String businessId,
    required String userId,
  }) async {
    return remote.removeMember(
      businessId,
      userId,
    );
  }

  /// -------------------------------
  /// CANCEL INVITATION
  /// -------------------------------

  @override
  Future<ApiResponse<void>> cancelInvitation(
    String invitationId,
  ) async {
    return remote.cancelInvitation(
      invitationId,
    );
  }
}


final teamRepositoryProvider = Provider<TeamRepositoryImpl>(
  (ref) => TeamRepositoryImpl(
    remote: ref.watch(teamApiServiceProvider),
    local: ref.watch(teamLocalServiceProvider),
  ),
);