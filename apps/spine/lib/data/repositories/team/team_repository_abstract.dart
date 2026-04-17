import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

abstract class TeamRepositoryAbstract {
  Future<void> inviteMember({
    required String branchId,
    required String businessId,
    required String email,
    required String role,
  });
  Future<ApiResponse<List<BusinessUserData>>> getTeamMembers(String businessId);
  Future<ApiResponse<List<Invite>>> getPendingInvitations(String businessId);
  Future<ApiResponse<void>> acceptInvitation(String token);
  Future<ApiResponse<void>> removeMember(String businessId, String userId);
  Future<ApiResponse<void>> cancelInvitation(String invitationId);
}
  