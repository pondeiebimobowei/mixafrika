import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/ui/team_management/view_model/team_management_view_model.dart';
import 'package:spine/ui/shop_management/view_model/shop_management_view_model.dart';

class InviteMemberSheet extends ConsumerStatefulWidget {
  const InviteMemberSheet({super.key});

  @override
  ConsumerState<InviteMemberSheet> createState() => _InviteMemberSheetState();
}

class _InviteMemberSheetState extends ConsumerState<InviteMemberSheet> {
  final _emailController = TextEditingController();
  String _selectedRole = 'agent';
  String _selectedBranchId = '';

  final List<String> _roles = ['admin', 'subadmin', 'trader', 'investor', 'agent'];

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final shopState = ref.watch(shopManagementViewModelProvider);

    return Material(
      color: Colors.transparent,
      child: Container(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          left: 20,
          right: 20,
          top: 24,
        ),
        decoration: BoxDecoration(
          color: colors.background,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: colors.primaryForeground.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const Text(
              'Invite Team Member',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 32),
            _buildLabel('EMAIL ADDRESS'),
            const SizedBox(height: 10),
            _buildTextField(
              controller: _emailController,
              hint: 'member@example.com',
              prefixIcon: Icons.email_outlined,
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 24),
            _buildLabel('ROLE'),
            const SizedBox(height: 10),
            _buildRoleSelector(context),
            const SizedBox(height: 24),
            _buildLabel('ASSIGN TO BRANCH (OPTIONAL)'),
            const SizedBox(height: 10),
            _buildBranchSelector(context, shopState),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: FButton(
                child: const Text('Send Invitation'),
                onPress: () async {
                  if (_emailController.text.isEmpty) return;
                  
                  final success = await ref.read(teamManagementViewModelProvider.notifier).inviteMember(
                    email: _emailController.text.trim(),
                    role: _selectedRole,
                    branchId: _selectedBranchId,
                  );

                  if (success && mounted) {
                    Navigator.pop(context);
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        color: Colors.white60,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    IconData? prefixIcon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withAlpha(150),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withAlpha(13)),
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        decoration: InputDecoration(
          prefixIcon: prefixIcon != null
              ? Icon(prefixIcon, color: Colors.white38, size: 20)
              : null,
          hintText: hint,
          hintStyle: const TextStyle(
            color: Colors.white24,
            fontSize: 15,
            fontWeight: FontWeight.w400,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 18,
          ),
        ),
      ),
    );
  }

  Widget _buildRoleSelector(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withAlpha(150),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withAlpha(13)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedRole,
          isExpanded: true,
          dropdownColor: const Color(0xFF1E293B),
          icon: const Icon(Icons.keyboard_arrow_down, color: Colors.white38),
          style: const TextStyle(color: Colors.white, fontSize: 16),
          items: _roles.map((role) {
            return DropdownMenuItem(
              value: role,
              child: Text(role.toUpperCase()),
            );
          }).toList(),
          onChanged: (val) {
            if (val != null) setState(() => _selectedRole = val);
          },
        ),
      ),
    );
  }

  Widget _buildBranchSelector(BuildContext context, ShopManagementState shopState) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withAlpha(150),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withAlpha(13)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedBranchId,
          hint: const Text('None', style: TextStyle(color: Colors.white24)),
          isExpanded: true,
          dropdownColor: const Color(0xFF1E293B),
          icon: const Icon(Icons.keyboard_arrow_down, color: Colors.white38),
          style: const TextStyle(color: Colors.white, fontSize: 16),
          items: [
            const DropdownMenuItem<String>(
              value: '',
              child: Text('None'),
            ),
            ...shopState.branch.map((b) {
              return DropdownMenuItem<String>(
                value: b.id,
                child: Text(b.name),
              );
            }),
          ],
          onChanged: (val) {
            if (val != null) setState(() => _selectedBranchId = val);
          },
        ),
      ),
    );
  }
}
