import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/services/models/branch_user_model.dart';
import 'package:spine/ui/team_management/view_model/team_management_view_model.dart';
import 'package:spine/ui/team_management/widget/invite_member_sheet.dart';
import 'package:spine/widget/icon_widget.dart';

class TeamManagementView extends ConsumerWidget {
  const TeamManagementView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(teamManagementViewModelProvider);
    final viewModel = ref.read(teamManagementViewModelProvider.notifier);
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => Navigator.pop(context),
              child: const IconWidget(icon: Icons.arrow_back),
            ),
            const SizedBox(width: 20),
            Text(
              'Team Management',
              style: TextStyle(fontSize: 20, color: colors.primaryForeground),
            ),
            const Spacer(),
            IconWidget(
              icon: Icons.person_add_outlined,
              onTap: () => _showInviteSheet(context),
            ),
          ],
        ),
      ),
      child: Material(
        color: colors.background,
        child: state.isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: () => viewModel.loadTeamData(),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (state.error != null)
                        _buildErrorBanner(context, state.error!),
                      
                      const SizedBox(height: 20),
                      _buildSectionHeader(context, 'Active Members', Icons.group_outlined),
                      const SizedBox(height: 16),
                      if (state.members.isEmpty)
                        _buildEmptyState(context, 'No active members yet.')
                        
                      else
                        ...state.members.map((member) => _buildMemberCard(context, member, viewModel)),
                      
                      const SizedBox(height: 32),
                      _buildSectionHeader(context, 'Pending Invitations', Icons.outgoing_mail),
                      const SizedBox(height: 16),
                      if (state.invitations.isEmpty)
                        _buildEmptyState(context, 'No pending invitations.')
                      else
                        ...state.invitations.map((invite) => _buildInviteCard(context, invite, viewModel)),
                        
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, IconData icon) {
    final colors = context.theme.colors;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Icon(icon, size: 16, color: colors.primary),
          const SizedBox(width: 8),
          Text(
            title.toUpperCase(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
              color: colors.primaryForeground.withAlpha(150),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMemberCard(BuildContext context, BranchUserWithUser member, TeamManagementViewModel viewModel) {
    final colors = context.theme.colors;
    final user = member.user;
    final role = member.branchUser.role;

    if (user == null) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withAlpha(100),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.primary.withAlpha(20)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: colors.primary.withAlpha(50),
            child: Text(
              (user.firstName as String?)?[0].toUpperCase() ?? 'U',
              style: TextStyle(color: colors.primary, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${user.firstName} ${user.lastName}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  user.email,
                  style: TextStyle(fontSize: 12, color: colors.primaryForeground.withAlpha(120)),
                ),
                const SizedBox(height: 4),
                FBadge(
                  variant: FBadgeVariant.outline,
                  child: Text((role as String?)?.toUpperCase() ?? 'MEMBER', style: const TextStyle(fontSize: 10)),
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(Icons.remove_circle_outline, color: colors.error.withAlpha(150)),
            onPressed: () => _showMemberActions(context, user.id, viewModel),
          ),
        ],
      ),
    );
  }

  Widget _buildInviteCard(BuildContext context, dynamic invite, TeamManagementViewModel viewModel) {
    final colors = context.theme.colors;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withAlpha(50),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.primary.withAlpha(10)),
      ),
      child: Row(
        children: [
          Icon(Icons.mark_email_unread_outlined, color: colors.primary.withAlpha(150)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  invite['email'] ?? '',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  'Role: ${(invite['role'] as String?)?.toUpperCase() ?? ''}',
                  style: TextStyle(fontSize: 12, color: colors.primaryForeground.withAlpha(120)),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () => viewModel.cancelInvitation(invite['id']),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: colors.error.withAlpha(20),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('Cancel', style: TextStyle(color: Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, String message) {
    final colors = context.theme.colors;
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 24),
        child: Text(
          message,
          style: TextStyle(color: colors.primaryForeground.withAlpha(100)),
        ),
      ),
    );
  }

  Widget _buildErrorBanner(BuildContext context, String error) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.redAccent.withAlpha(30),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.redAccent.withAlpha(100)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.redAccent, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              error,
              style: const TextStyle(color: Colors.redAccent, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }

  void _showInviteSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const InviteMemberSheet(),
    );
  }

  void _showMemberActions(BuildContext context, String userId, TeamManagementViewModel viewModel) {
     showDialog(
       context: context,
       builder: (context) => AlertDialog(
         title: const Text('Remove Member'),
         content: const Text('Are you sure you want to remove this member from your team?'),
         actions: [
           TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
           TextButton(
             onPressed: () {
               viewModel.removeMember(userId);
               Navigator.pop(context);
             },
             child: const Text('Remove', style: TextStyle(color: Colors.redAccent)),
           ),
         ],
       ),
     );
  }
}
