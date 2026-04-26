import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/team/team_repository_abstract.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/drift/database.dart';
import 'package:uuid/uuid.dart';

class TeamRepositoryLocal implements TeamRepositoryAbstract {
  TeamRepositoryLocal({required AppDatabase db}) : _db = db;
  final AppDatabase _db;

  
  @override
  Future<ApiResponse<void>> inviteMember({ required String branchId, required String businessId, required String email, required String role}) async {
    final now = DateTime.now();
    try {
      final existingInvite = await (_db.select(_db.invites)
      ..where((tbl) => tbl.email.equals(email))
      ..where((tbl) => tbl.businessId.equals(businessId))
      // ..where((tbl) => tbl.role.equals(role))
      ..where((tbl) => tbl.branchId.equals(branchId))).get();

      if(existingInvite.isNotEmpty) {
        throw Exception('Invite already exists');
      }

      await _db.into(_db.invites).insert(
        Invite(
          email: email,
          role: role,
          businessId: businessId,
          branchId: branchId,
          token: Uuid().v4(),
          syncStatus: 'pending',
          accepted: false,
          createdAt: now,
          updatedAt: now,
          id: Uuid().v4()
        ),
      );

      return ApiResponse(
        data: null,
        message: 'Invitation sent successfully',
        success: true,
      );
    }
    catch (e) {
      print(e);
      return ApiResponse(
        data: null,
        message: e.toString(),
        success: false,
      );
    }
  }

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

  @override
  Future<ApiResponse<void>> acceptInvitation(String invitationId) {
    return Future.value();
  }

  @override
  Future<ApiResponse<void>> removeMember(String businessId, String userId) async {
    try {
      await (_db.delete(_db.businessUser)
      ..where((tbl) => tbl.businessId.equals(businessId))
      ..where((tbl) => tbl.userId.equals(userId))).go();

      return ApiResponse(
        data: null,
        message: 'Member removed successfully',
        success: true,
      );
    } catch (e) {
      print(e);
      return ApiResponse(
        data: null,
        message: e.toString(),
        success: false,
      );
    }
  }

  @override
  Future<ApiResponse<void>> cancelInvitation(String invitationId) async {
    try {
      await (_db.delete(_db.invites)
      ..where((tbl) => tbl.id.equals(invitationId))).go();

      return ApiResponse(
        data: null,
        message: 'Invitation cancelled successfully',
        success: true,
      );
    } catch (e) {
      print(e);
      return ApiResponse(
        data: null,
        message: e.toString(),
        success: false,
      );
    }
  }
}

final teamRepositoryLocalProvider = Provider<TeamRepositoryLocal>(
  (ref) => TeamRepositoryLocal(
    db: ref.watch(databaseProvider),
  ),
);