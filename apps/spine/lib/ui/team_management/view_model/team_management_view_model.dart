import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/team/team_repository_local.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/data/shared_preference.dart';

class TeamManagementState {
  final List<BranchUserWithUser> members;
  final List<dynamic> invitations;
  final bool isLoading;
  final String? error;

  TeamManagementState({
    required this.members,
    required this.invitations,
    this.isLoading = false,
    this.error,
  });

  TeamManagementState copyWith({
    List<BranchUserWithUser>? members,
    List<dynamic>? invitations,
    bool? isLoading,
    String? error,
  }) {
    return TeamManagementState(
      members: members ?? this.members,
      invitations: invitations ?? this.invitations,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class TeamManagementViewModel extends StateNotifier<TeamManagementState> {
  final Ref ref;

  TeamManagementViewModel(this.ref)
      : super(TeamManagementState(members: [], invitations: [])) {
    loadTeamData();
  }

  Future<void> loadTeamData() async {
    state = state.copyWith(isLoading: true, error: null);
    final businessId = await AppPreferences.getActiveBusinessId();
    final businessBranchId = await AppPreferences.getActiveBranchId();
    if (businessId == null) {
      state = state.copyWith(isLoading: false, error: 'No active business found');
      return;
    }
    if (businessBranchId == null) {
      state = state.copyWith(isLoading: false, error: 'No active business branch found');
      return;
    }



    try {
      final membersRes = await ref.read(teamRepositoryLocalProvider).getBranchTeamMembers(businessBranchId);
      final invitesRes = await ref.read(teamRepositoryLocalProvider).getBranchPendingInvitations(businessBranchId);

      if (membersRes.success && invitesRes.success) {
        state = state.copyWith(
          members: (membersRes.data as List<BranchUserWithUser>?) ?? [],
          invitations: (invitesRes.data as List?) ?? [],
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          error: membersRes.message,
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> inviteMember({
    required String email,
    required String role,
    required String branchId,
  }) async {
    final businessId = await AppPreferences.getActiveBusinessId();
    if (businessId == null) return false;

    state = state.copyWith(isLoading: true, error: null);
    final res = await ref.read(teamRepositoryLocalProvider).inviteMember(
      businessId: businessId,
      email: email,
      role: role,
      branchId: branchId,
    );

    if (res.success) {
      await loadTeamData();
      state = state.copyWith(isLoading: false);
      return true;
    } else {
      state = state.copyWith(isLoading: false, error: res.message);
      return false;
    }
  }

  Future<void> removeMember(String userId) async {
    final businessId = await AppPreferences.getActiveBusinessId();
    if (businessId == null) return;

    final res = await ref.read(teamRepositoryLocalProvider).removeMember(businessId, userId);
    if (res.success) {
      await loadTeamData();
    } else {
      state = state.copyWith(error: res.message);
    }
  }

  Future<void> cancelInvitation(String invitationId) async {
    final res = await ref.read(teamRepositoryLocalProvider).cancelInvitation(invitationId);
    if (res.success) {
      await loadTeamData();
    } else {
      state = state.copyWith(error: res.message);
    }
  }
}

final teamManagementViewModelProvider =
    StateNotifierProvider<TeamManagementViewModel, TeamManagementState>((ref) {
  return TeamManagementViewModel(ref);
});
