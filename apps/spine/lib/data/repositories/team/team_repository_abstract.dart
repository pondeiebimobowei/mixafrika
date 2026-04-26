import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/drift/database.dart';

abstract class TeamRepositoryAbstract {
  Future<void> inviteMember({
    required String branchId,
    required String businessId,
    required String email,
    required String role,
  });
  Future<ApiResponse<List<BranchUserWithUser>>> getBranchTeamMembers(String branchId);
  Future<ApiResponse<List<Invite>>> getBranchPendingInvitations(String branchId);
  Future<ApiResponse<void>> acceptInvitation(String token);
  Future<ApiResponse<void>> removeMember(String businessId, String userId);
  Future<ApiResponse<void>> cancelInvitation(String invitationId);
}
  