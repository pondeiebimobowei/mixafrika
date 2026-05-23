import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/drift/database.dart';

abstract class TeamLocalRepository {
  Future<ApiResponse<List<BranchUserWithUser>>> getBranchTeamMembers(
    String branchId,
  );

  Future<ApiResponse<List<Invite>>> getBranchPendingInvitations(
    String branchId,
  );
}