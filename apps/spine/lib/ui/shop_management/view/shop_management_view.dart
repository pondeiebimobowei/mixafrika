import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/theme/app-theme.dart';
import 'package:spine/ui/shop_management/view_model/shop_management_view_model.dart';
import 'package:spine/ui/shop_management/widget/edit_business_sheet.dart';
import 'package:spine/widget/icon_widget.dart';

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
            const Spacer(),
            IconWidget(
              icon: Icons.add,
              onTap: () => _showEditSheet(context, viewModel),
            ),
          ],
        ),
      ),
      child: Material(
        color: colors.background,
        child: state.isLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionHeader(context, 'Business Profile', Icons.business_outlined),
                    const SizedBox(height: 16),
                    if (state.businesses.isEmpty)
                      _buildEmptyBusinessState(context, viewModel)
                    else
                      ...state.businesses.map((biz) => _buildBusinessCard(context, biz, viewModel)),
                    
                    const SizedBox(height: 32),
                    _buildSectionHeader(context, 'Inventory Settings', Icons.inventory_2_outlined),
                    const SizedBox(height: 16),
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
                    
                    const SizedBox(height: 32),
                    _buildSectionHeader(context, 'Sales & Payments', Icons.payments_outlined),
                    const SizedBox(height: 16),
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
  
                    const SizedBox(height: 32),
                    _buildSectionHeader(context, 'System', Icons.settings_suggest_outlined),
                    const SizedBox(height: 16),
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
                    ]),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, IconData icon) {
    final colors = context.theme.colors;
    return Row(
      children: [
        Icon(icon, size: 18, color: colors.primary),
        const SizedBox(width: 8),
        Text(
          title.toUpperCase(),
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.2,
            color: colors.primaryForeground.withValues(alpha: 0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildBusinessCard(BuildContext context, UserBusinessData biz, ShopManagementViewModel viewModel) {
    final colors = context.theme.colors;
    return FCard(
      style: FCardStyleDelta.delta(
        decoration: BoxDecorationDelta.delta(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: colors.primary.withValues(alpha: 0.1), width: 1),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: colors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.storefront_outlined, color: colors.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  biz.name,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  biz.phone,
                  style: TextStyle(
                    fontSize: 12,
                    color: colors.primaryForeground.withValues(alpha: 0.6),
                  ),
                ),
              ],
            ),
          ),
          FButton(
            // style: FButtonStyle.ghost,
            child: const Icon(Icons.edit_outlined, size: 18),
            onPress: () => _showEditSheet(context, viewModel, business: biz),
          ),
          FButton(
            // style: FButtonStyle.ghost,
            child: Icon(Icons.delete_outline, size: 18, color: colors.destructive),
            onPress: () => viewModel.deleteBusiness(biz.id),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyBusinessState(BuildContext context, ShopManagementViewModel viewModel) {
    final colors = context.theme.colors;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: colors.secondary.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border, style: BorderStyle.none),
      ),
      child: Column(
        children: [
          Icon(Icons.add_business_outlined, size: 48, color: colors.mutedForeground),
          const SizedBox(height: 16),
          const Text('No shops found', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(
            'Add your first shop to start managing inventory.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: colors.mutedForeground),
          ),
          const SizedBox(height: 16),
          FButton(
            child: const Text('Add Shop'),
            onPress: () => _showEditSheet(context, viewModel),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsGroup(BuildContext context, List<Widget> children) {
    final colors = context.theme.colors;
    return Container(
      decoration: BoxDecoration(
        color: colors.secondary.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.primary.withValues(alpha: 0.05)),
      ),
      child: Column(children: children),
    );
  }

  Widget _buildToggleTile(BuildContext context, String title, String subtitle, bool value, Function(bool) onChanged) {
    final colors = context.theme.colors;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(fontSize: 11, color: colors.primaryForeground.withValues(alpha: 0.6)),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: colors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildValueTile(BuildContext context, String title, String value, VoidCallback onTap) {
    final colors = context.theme.colors;
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          children: [
            Expanded(
              child: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            ),
            Text(
              value,
              style: TextStyle(fontWeight: FontWeight.bold, color: colors.primary, fontSize: 14),
            ),
            const SizedBox(width: 8),
            Icon(Icons.chevron_right, size: 18, color: colors.mutedForeground),
          ],
        ),
      ),
    );
  }

  Widget _buildActionTile(BuildContext context, String title, String subtitle, IconData icon, VoidCallback onTap) {
    final colors = context.theme.colors;
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: colors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 18, color: colors.primary),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(fontSize: 11, color: colors.primaryForeground.withValues(alpha: 0.6)),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, size: 18, color: colors.mutedForeground),
          ],
        ),
      ),
    );
  }

  void _showEditSheet(BuildContext context, ShopManagementViewModel viewModel, {UserBusinessData? business}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => EditBusinessSheet(business: business),
    ).then((result) {
      if (result != null) {
        if (result is UserBusinessCompanion) {
          viewModel.createBusiness(result);
        } else if (result is UserBusinessData) {
          viewModel.updateBusiness(result);
        }
      }
    });
  }

  void _showUnitSelection(BuildContext context, ShopManagementViewModel viewModel) {
    final colors = context.theme.colors;
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.background,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Select Default Unit', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            ...['Pcs', 'Kg', 'Litre', 'Box', 'Bag'].map((unit) => ListTile(
                  title: Text(unit),
                  onTap: () {
                    viewModel.setDefaultUnit(unit);
                    Navigator.pop(context);
                  },
                )),
          ],
        ),
      ),
    );
  }
}
