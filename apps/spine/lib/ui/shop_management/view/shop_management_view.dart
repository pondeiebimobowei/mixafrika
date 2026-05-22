import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/shop_management/view_model/shop_management_view_model.dart';
import 'package:spine/ui/shop_management/widget/edit_branch_sheet.dart';
import 'package:spine/ui/shop_management/widget/edit_business_sheet.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/widget/toast_widget.dart';
import 'package:spine/widget/spinner_widget.dart';

class ShopManagementView extends ConsumerWidget {
  const ShopManagementView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(shopManagementViewModelProvider);
    final viewModel = ref.read(shopManagementViewModelProvider.notifier);
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const IconWidget(icon: Icons.arrow_back),
            ),
            const SizedBox(width: 20),
            Text(
              'Shop Management',
              style: TextStyle(fontSize: 20, color: colors.primaryForeground),
            ),
          ],
        ),
      ),
      child: Material(
        color: colors.background,
        child: state.isLoading
            ? Center(child: SpinnerWidget.spinner())
            : SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        margin: const EdgeInsets.only(bottom: 24),
                        decoration: BoxDecoration(
                          color: colors.primaryForeground.withValues(
                            alpha: 0.1,
                          ),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),

                    // --- MY BUSINESSES SECTION ---
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildSectionHeader(
                          context,
                          'My Businesses',
                          Icons.business_center_outlined,
                        ),
                        FButton(
                          variant: FButtonVariant.outline,
                          // size: FButtonSize.extraSmall,
                          child:  Icon(Icons.add, size: 14, color: context.theme.colors.primaryForeground,),
                          onPress: () => _showEditBusinessSheet(context, viewModel),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    if (state.businesses.isEmpty)
                      _buildEmptyBusinessState(context, viewModel)
                    else
                      SizedBox(
                        height: 140,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: state.businesses.length,
                          itemBuilder: (context, index) {
                            final biz = state.businesses[index];
                            final isActive = biz.id == state.activeBusinessId;
                            return _buildBusinessCard(
                              context,
                              biz,
                              isActive,
                              viewModel,
                            );
                          },
                        ),
                      ),

                    const SizedBox(height: 40),

                    // --- BRANCH PROFILE SECTION ---
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildSectionHeader(
                          context,
                          'Branch Profile',
                          Icons.storefront_outlined,
                        ),
                        FButton(
                          variant: FButtonVariant.outline,
                          // size: FButtonSize.extraSmall,
                          child: Icon(Icons.add, size: 14, color: context.theme.colors.primaryForeground,),
                          onPress: () => _showEditBranchSheet(context, viewModel),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    if (state.branch.isEmpty)
                      _buildEmptyBranchState(context, viewModel)
                    else
                      ...state.branch.map(
                        (biz) => _buildBranchCard(context, biz, viewModel),
                      ),

                    const SizedBox(height: 40),
                    _buildSectionHeader(
                      context,
                      'Inventory Settings',
                      Icons.inventory_2_outlined,
                    ),
                    const SizedBox(height: 20),
                    _buildSettingsGroup(context, [
                      _buildToggleTile(
                        context,
                        'Batch Tracking',
                        'Enable tracking items by batch numbers',
                        state.batchTrackingEnabled,
                        viewModel.toggleBatchTracking,
                      ),
                      _buildToggleTile(
                        context,
                        'Expiry Tracking',
                        'Alert when items are near expiry',
                        state.expiryTrackingEnabled,
                        viewModel.toggleExpiryTracking,
                      ),
                      _buildValueTile(
                        context,
                        'Default Unit',
                        state.defaultUnit,
                        () => _showUnitSelection(context, viewModel),
                      ),
                    ]),

                    const SizedBox(height: 40),
                    _buildSectionHeader(
                      context,
                      'Sales & Payments',
                      Icons.payments_outlined,
                    ),
                    const SizedBox(height: 20),
                    _buildSettingsGroup(context, [
                      _buildToggleTile(
                        context,
                        'Cash Payment',
                        'Allow sales via cash',
                        state.cashPaymentEnabled,
                        viewModel.toggleCashPayment,
                      ),
                      _buildToggleTile(
                        context,
                        'Card Payment',
                        'Enable integrated card payments',
                        state.cardPaymentEnabled,
                        viewModel.toggleCardPayment,
                      ),
                      _buildToggleTile(
                        context,
                        'Bank Transfer',
                        'Show bank details for transfers',
                        state.transferPaymentEnabled,
                        viewModel.toggleTransferPayment,
                      ),
                    ]),

                    const SizedBox(height: 40),
                    _buildSectionHeader(
                      context,
                      'System',
                      Icons.settings_suggest_outlined,
                    ),
                    const SizedBox(height: 20),
                    _buildSettingsGroup(context, [
                      _buildToggleTile(
                        context,
                        'Push Notifications',
                        'Get alerts for low stock and sales',
                        state.notificationEnabled,
                        viewModel.toggleNotification,
                      ),
                      _buildActionTile(
                        context,
                        'Data & Backup',
                        'Export data or manage cloud backup',
                        Icons.backup_outlined,
                        () {},
                      ),
                      _buildActionTile(
                        context,
                        'Team Management',
                        'Manage staff, roles and invitations',
                        Icons.people_alt_outlined,
                        () => context.push(Routes.teamManagement),
                      ),
                      _buildActionTile(
                        context,
                        'Logout',
                        'Sign out of your account',
                        Icons.logout,
                        () => _showLogoutConfirmation(context, viewModel),
                        isDestructive: true,
                      ),
                    ]),
                    const SizedBox(height: 60),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildBusinessCard(
    BuildContext context,
    BusinessesData biz,
    bool isActive,
    ShopManagementViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    return GestureDetector(
      onTap: () {
        viewModel.switchBusiness(biz.id);
        ToastWidget.makeToast(
          context: context, 
          description: 'Switched to ${biz.name}', 
          icon: FIcons.circleCheck, 
          color: Colors.green
        );
      },
      child: Container(
        width: 200,
        margin: const EdgeInsets.only(right: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isActive
                ? [colors.primary, colors.primary.withValues(alpha: 0.8)]
                : [
                    colors.secondaryForeground,
                    colors.secondaryForeground.withValues(alpha: 0.8)
                  ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isActive
                ? colors.primary.withValues(alpha: 0.2)
                : colors.primary.withValues(alpha: 0.1),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.business_outlined,
                    color: isActive ? Colors.white : colors.primary,
                    size: 20,
                  ),
                ),
                if (isActive)
                  const Icon(Icons.check_circle, color: Colors.white, size: 20),
              ],
            ),
            const Spacer(),
            Text(
              biz.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
                color: isActive ? Colors.white : null,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              biz.type,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: isActive
                    ? Colors.white.withValues(alpha: 0.7)
                    : colors.primaryForeground.withValues(alpha: 0.5),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildSmallCircleButton(
                  icon: Icons.edit_outlined,
                  onTap: () => _showEditBusinessSheet(context, viewModel, business: biz),
                  color: Colors.white.withValues(alpha: 0.15),
                  iconColor: isActive ? Colors.white : colors.primary,
                ),
                const SizedBox(width: 8),
                _buildSmallCircleButton(
                  icon: Icons.delete_outline,
                  onTap: () => viewModel.deleteBusiness(biz.id),
                  color: Colors.white.withValues(alpha: 0.15),
                  iconColor: isActive ? Colors.white : colors.error,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSmallCircleButton({
    required IconData icon,
    required VoidCallback onTap,
    required Color color,
    required Color iconColor,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        child: Icon(icon, size: 14, color: iconColor),
      ),
    );
  }

  Widget _buildEmptyBusinessState(
    BuildContext context,
    ShopManagementViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 24),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        children: [
          Icon(Icons.business_center_outlined,
              size: 40, color: colors.primary.withValues(alpha: 0.3)),
          const SizedBox(height: 16),
          const Text('No businesses yet',
              style: TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          FButton(
            variant: FButtonVariant.outline,
            child: const Text('Add Business'),
            onPress: () => _showEditBusinessSheet(context, viewModel),
          ),
        ],
      ),
    );
  }

  void _showEditBusinessSheet(
    BuildContext context,
    ShopManagementViewModel viewModel, {
    BusinessesData? business,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => EditBusinessSheet(business: business),
    ).then((result) {
      if (result != null) {
        if (result is BusinessesCompanion) {
          viewModel.createBusiness(
            BusinessesData(
              id: result.id.value,
              name: result.name.value,
              type: result.type.value,
              phone: result.phone.value,
              streetAddress: result.streetAddress.value,
              city: result.city.value,
              state: result.state.value,
              country: result.country.value,
              isVerified: result.isVerified.value,
              syncStatus: result.syncStatus.value,
              createdAt: result.createdAt.value,
              updatedAt: result.updatedAt.value,
            ),
          );
          ToastWidget.makeToast(
            context: context, 
            description: 'Business created successfully', 
            icon: FIcons.circleCheck, 
            color: Colors.green
          );
        } else if (result is BusinessesData) {
          viewModel.updateBusiness(result);
          ToastWidget.makeToast(
            context: context, 
            description: 'Business updated successfully', 
            icon: FIcons.circleCheck, 
            color: Colors.green
          );
        }
      }
    });
  }

  void _showEditBranchSheet(
    BuildContext context,
    ShopManagementViewModel viewModel, {
    BranchData? branch,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => EditBranchSheet(branch: branch),
    ).then((result) {
      if (result != null) {
        if (result is BranchCompanion) {
          viewModel.createBranch(
            BranchData(
              id: result.id.value,
              name: result.name.value,
              phone: result.phone.value,
              streetAddress: result.streetAddress.value,
              city: result.city.value,
              state: result.state.value,
              country: result.country.value,
              isHeadOffice: result.isHeadOffice.value,
              businessId: viewModel.state.activeBusinessId!,
              syncStatus: result.syncStatus.value,
              createdAt: result.createdAt.value,
              updatedAt: result.updatedAt.value,
              collectionId: result.collectionId.value,
            ),
          );
          ToastWidget.makeToast(
            context: context, 
            description: 'Shop created successfully', 
            icon: FIcons.circleCheck, 
            color: Colors.green
          );
        } else if (result is BranchData) {
          viewModel.updateBranch(result);
          ToastWidget.makeToast(
            context: context, 
            description: 'Shop updated successfully', 
            icon: FIcons.circleCheck, 
            color: Colors.green
          );
        }
      }
    });
  }

  Widget _buildSectionHeader(
    BuildContext context,
    String title,
    IconData icon,
  ) {
    final colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: colors.primary.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: colors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 14, color: colors.primary),
          ),
          const SizedBox(width: 10),
          Text(
            title.toUpperCase(),
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.5,
              color: colors.primary.withValues(alpha: 0.8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBranchCard(
    BuildContext context,
    BranchData biz,
    ShopManagementViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            colors.secondaryForeground,
            colors.secondaryForeground.withValues(alpha: 0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: colors.primary.withValues(alpha: 0.1),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    colors.primary.withValues(alpha: 0.2),
                    colors.primary.withValues(alpha: 0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                Icons.storefront_outlined,
                color: colors.primary,
                size: 28,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    biz.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.phone_outlined,
                        size: 10,
                        color: colors.primaryForeground.withValues(alpha: 0.4),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        biz.phone,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: colors.primaryForeground.withValues(
                            alpha: 0.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            _buildRoundActionButton(
              icon: Icons.edit_outlined,
              onTap: () => _showEditBranchSheet(context, viewModel, branch: biz),
              color: colors.primary.withValues(alpha: 0.1),
              iconColor: colors.primary,
            ),
            const SizedBox(width: 8),
            _buildRoundActionButton(
              icon: Icons.delete_outline,
              onTap: () => viewModel.deleteBranch(biz.id),
              color: colors.destructive.withValues(alpha: 0.1),
              iconColor: colors.destructive,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoundActionButton({
    required IconData icon,
    required VoidCallback onTap,
    required Color color,
    required Color iconColor,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        child: Icon(icon, size: 18, color: iconColor),
      ),
    );
  }

  Widget _buildEmptyBranchState(
    BuildContext context,
    ShopManagementViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: colors.primary.withValues(alpha: 0.1),
          style: BorderStyle.solid,
        ),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: colors.primary.withValues(alpha: 0.05),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.add_business_outlined,
              size: 40,
              color: colors.primary.withValues(alpha: 0.5),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No shops found',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 18,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Add your first shop to start managing inventory and sales across multiple locations.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              color: colors.primaryForeground.withValues(alpha: 0.4),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),
          FButton(
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.add, size: 18),
                SizedBox(width: 8),
                Text('Add First Shop'),
              ],
            ),
            onPress: () => _showEditBranchSheet(context, viewModel),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsGroup(BuildContext context, List<Widget> children) {
    final colors = context.theme.colors;
    return Container(
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: colors.primary.withValues(alpha: 0.08)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Column(children: children),
      ),
    );
  }

  Widget _buildToggleTile(
    BuildContext context,
    String title,
    String subtitle,
    bool value,
    Function(bool) onChanged,
  ) {
    final colors = context.theme.colors;
    return InkWell(
      onTap: () => onChanged(!value),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: colors.primaryForeground.withValues(alpha: 0.5),
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            Transform.scale(
              scale: 0.85,
              child: Switch(
                value: value,
                onChanged: onChanged,
                activeColor: colors.primary,
                activeTrackColor: colors.primary.withValues(alpha: 0.2),
                inactiveThumbColor: colors.primaryForeground.withValues(
                  alpha: 0.3,
                ),
                inactiveTrackColor: colors.primaryForeground.withValues(
                  alpha: 0.05,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildValueTile(
    BuildContext context,
    String title,
    String value,
    VoidCallback onTap,
  ) {
    final colors = context.theme.colors;
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        child: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                  letterSpacing: -0.3,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: colors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  color: colors.primary,
                  fontSize: 13,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Icon(
              Icons.chevron_right,
              size: 20,
              color: colors.primaryForeground.withValues(alpha: 0.3),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionTile(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap, {
    bool isDestructive = false,
  }) {
    final colors = context.theme.colors;
    final tileColor = isDestructive ? colors.error : colors.primary;
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    tileColor.withValues(alpha: 0.15),
                    tileColor.withValues(alpha: 0.05),
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 20, color: tileColor),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                      letterSpacing: -0.3,
                      color: isDestructive ? colors.error : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: colors.primaryForeground.withValues(alpha: 0.5),
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              size: 20,
              color: colors.primaryForeground.withValues(alpha: 0.3),
            ),
          ],
        ),
      ),
    );
  }

  void _showUnitSelection(
    BuildContext context,
    ShopManagementViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).padding.bottom + 24,
          left: 20,
          right: 20,
          top: 24,
        ),
        decoration: BoxDecoration(
          color: colors.background,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: colors.primaryForeground.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const Text(
              'Select Default Unit',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 24),
            _buildSelectionTile(context, 'Pcs', Icons.widgets_outlined, () {
              viewModel.setDefaultUnit('Pcs');
              Navigator.pop(context);
            }),
            const SizedBox(height: 12),
            _buildSelectionTile(
              context,
              'Kg',
              Icons.monitor_weight_outlined,
              () {
                viewModel.setDefaultUnit('Kg');
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 12),
            _buildSelectionTile(context, 'Litre', Icons.opacity_outlined, () {
              viewModel.setDefaultUnit('Litre');
              Navigator.pop(context);
            }),
            const SizedBox(height: 12),
            _buildSelectionTile(context, 'Box', Icons.inventory_2_outlined, () {
              viewModel.setDefaultUnit('Box');
              Navigator.pop(context);
            }),
            const SizedBox(height: 12),
            _buildSelectionTile(
              context,
              'Bag',
              Icons.shopping_bag_outlined,
              () {
                viewModel.setDefaultUnit('Bag');
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectionTile(
    BuildContext context,
    String title,
    IconData icon,
    VoidCallback onTap,
  ) {
    final colors = context.theme.colors;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: colors.secondaryForeground.withValues(alpha: 0.4),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: colors.primary.withValues(alpha: 0.05)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: colors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 20, color: colors.primary),
            ),
            const SizedBox(width: 16),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
            ),
            const Spacer(),
            Icon(
              Icons.chevron_right,
              size: 20,
              color: colors.primaryForeground.withValues(alpha: 0.3),
            ),
          ],
        ),
      ),
    );
  }

  void _showLogoutConfirmation(
    BuildContext context,
    ShopManagementViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: colors.background,
        title: const Text('Confirm Logout'),
        content: const Text('Are you sure you want to log out? This will clear your session data.'),
        actions: [
          FButton(
            variant: FButtonVariant.ghost,
            onPress: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FButton(
            variant: FButtonVariant.destructive,
            onPress: () async {
              await viewModel.logout();
              if (context.mounted) {
                ToastWidget.makeToast(
                  context: context, 
                  description: 'Logged out successfully', 
                  icon: FIcons.logOut, 
                  color: Colors.blue
                );
                context.go(Routes.login);
              }
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}
