import 'package:spine/data/services/api/config/api_response.dart';

abstract class TeamRemoteRepository {
  Future<ApiResponse<void>> inviteMember({
    required String branchId,
    required String businessId,
    required String email,
    required String role,
  });

  Future<ApiResponse<void>> acceptInvitation(String token);

  Future<ApiResponse<void>> removeMember(
   String businessId,
   String userId,
  );

  Future<ApiResponse<void>> cancelInvitation(
    String invitationId,
  );
}