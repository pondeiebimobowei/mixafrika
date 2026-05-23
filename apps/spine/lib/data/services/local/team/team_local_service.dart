import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/team/team_local_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/drift/database.dart';

class TeamRepositoryLocal implements TeamLocalRepository {
  TeamRepositoryLocal({required AppDatabase db}) : _db = db;
  final AppDatabase _db;


  @override
  Future<ApiResponse<List<BranchUserWithUser>>> getBranchTeamMembers(String branchId) async {
    try {
      final query = _db.select(_db.branchUser).join([
        innerJoin(
          _db.user,
          _db.user.id.equalsExp(_db.branchUser.userId),
        ),
      ])
        ..where(_db.branchUser.branchId.equals(branchId));

      final result = await query.get();

      final teamMembers = result.map((row) {
        return BranchUserWithUser(
          branchUser: row.readTable(_db.branchUser),
          user: row.readTable(_db.user),
        );
      }).toList();

      return ApiResponse(
        data: teamMembers,
        message: 'Branch team members fetched successfully',
        success: true,
      );
    } catch (e) {
      print(e);
      return ApiResponse(
        data: [],
        message: e.toString(),
        success: false,
      );
    }
  }

  @override
  Future<ApiResponse<List<Invite>>> getBranchPendingInvitations(String branchId) async {
    try {
      final pendingInvitations = await (_db.select(_db.invites)
      ..where((tbl) => tbl.branchId.equals(branchId))
      ..where((tbl) => tbl.accepted.equals(false))).get();

      return ApiResponse(
        data: pendingInvitations,
        message: 'Pending branch invitations fetched successfully',
        success: true,
      );
    } catch (e) {
      print(e);
      return ApiResponse(
        data: [],
        message: e.toString(),
        success: false,
      );
    }
  }

}

final teamLocalServiceProvider = Provider<TeamRepositoryLocal>(
  (ref) => TeamRepositoryLocal(
    db: ref.watch(databaseProvider),
  ),
);