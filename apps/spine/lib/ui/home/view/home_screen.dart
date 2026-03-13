import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/theme/app-theme.dart';
import 'package:spine/theme/typography.dart';
import 'package:spine/ui/home/view_model/home_view_model.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/widget/styles/f_header_style.dart';

class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  void _showShopSelectionSheet(BuildContext context, WidgetRef ref) {
    final homeState = ref.read(homeViewModelProvider).value;
    final FColors colors = context.theme.colors;
    

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: colors.background,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        String searchQuery = "";
        return StatefulBuilder(
          builder: (context, setModalState) {
            return DraggableScrollableSheet(
              initialChildSize: 0.6,
              minChildSize: 0.4,
              maxChildSize: 0.9,
              expand: false,
              builder: (context, scrollController) {
                final filteredShops =
                    homeState?.userBusiness.value
                        ?.where(
                          (shop) => shop.name.toLowerCase().contains(
                            searchQuery.toLowerCase(),
                          ),
                        )
                        .toList() ??
                    [];

                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      const SizedBox(height: 12),
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: colors.border,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          Text(
                            'Select Shop',
                            style: TextStyle(
                              fontSize: 18,
                              color: colors.primaryForeground,
                            ),
                          ),
                          const Spacer(),
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: IconWidget(icon: Icons.close),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        onChanged: (value) {
                          setModalState(() {
                            searchQuery = value;
                          });
                        },
                        style: TextStyle(color: colors.foreground),
                        decoration: InputDecoration(
                          hintText: 'Search shops...',
                          hintStyle: TextStyle(color: colors.mutedForeground),
                          prefixIcon: Icon(
                            Icons.search,
                            color: colors.mutedForeground,
                          ),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 12,
                            horizontal: 16,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: ListView.builder(
                          controller: scrollController,
                          itemCount: filteredShops.length,
                          itemBuilder: (context, index) {
                            final shop = filteredShops[index];
                            final isSelected =
                                shop == homeState?.activeUserBusiness;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 8.0),
                              child: ListTile(
                                onTap: () {
                                  ref
                                          .read(
                                            activeUserBusinessProvider.notifier,
                                          )
                                          .state =
                                      shop;
                                  Navigator.pop(context);
                                },
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                tileColor: isSelected
                                    ? colors.primary.withValues(alpha: 0.1)
                                    : Colors.transparent,
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 4,
                                ),
                                title: Text(
                                  shop.name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: isSelected ? .bold : .normal,
                                    color: isSelected
                                        ? colors.primary
                                        : colors.primaryForeground,
                                  ),
                                ),
                                trailing: isSelected
                                    ? Icon(
                                        Icons.check_circle,
                                        color: colors.primary,
                                        size: 20,
                                      )
                                    : null,
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homeState = ref.watch(homeViewModelProvider);
    final themeNotifier = ref.read(themeProvider.notifier);
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        style: FHeaderStyling().build(context),
        title: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundImage: NetworkImage(
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
              ), // Placeholder for profile pic
            ),
            const SizedBox(width: 12),
            Text(
              'Dashboard',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: colors.primaryForeground,
              ),
            ),
            const Spacer(),
            IconWidget(icon: Icons.notifications_outlined),
            GestureDetector(
              onTap: () => themeNotifier.toggleTheme(),
              child: IconWidget(icon: Icons.wb_sunny_outlined),
            ),
          ],
        ),
      ),
      child: Material(
        child: homeState.when(
          data: (homeState) {
            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTopBar(context, ref),
                  const SizedBox(height: 20),
                  _buildActivityCard(context),
                  const SizedBox(height: 24),
                  _buildQuickActions(context),
                  const SizedBox(height: 24),
                  _buildMenuGrid(context),
                  const SizedBox(height: 32),
                  _buildStockAlertsSection(context, homeState),
                  const SizedBox(height: 32),
                  _buildSpineIntelligence(context),
                  const SizedBox(height: 40),
                ],
              ),
            );
          },
          loading: () => const CircularProgressIndicator(),
          error: (error, stack) => RegularText(title: 'Error: $error'),
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context, WidgetRef ref) {
    final homeState = ref.watch(homeViewModelProvider).value;
    final activeBusiness = homeState?.activeUserBusiness;
    final FColors colors = context.theme.colors;

    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => _showShopSelectionSheet(context, ref),
            child: FCard(
              style: FCardStyleDelta.delta(
                decoration: BoxDecorationDelta.delta(
                  border: Border.all(
                    color: colors.primaryForeground.withValues(alpha: 0.5),
                    width: 0.02,
                  ),

                  borderRadius: BorderRadius.circular(12),
                ),
                contentStyle: FCardContentStyleDelta.delta(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
              ),

              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                child: Row(
                  children: [
                    Icon(
                      Icons.location_on_outlined,
                      size: 12,
                      color: colors.primary,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        overflow: TextOverflow.ellipsis,
                        activeBusiness?.name ?? "Select Shop",
                        style: context.theme.typography.sm.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.keyboard_arrow_down,
                      textDirection: TextDirection.rtl,
                      color: colors.primaryForeground,
                      size: 12,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          width: 80,
          // color: colors.destructive,
          decoration: BoxDecoration(
            border: BoxBorder.all(
              color: colors.destructive.withValues(alpha: .6),
            ),
            // color: colors.destructive,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center, // horizontal center
            crossAxisAlignment: CrossAxisAlignment.center, // vertical center
            children: [
              Icon(
                Icons.receipt_long_outlined,
                color: colors.destructive,
                size: 14,
              ),
              SizedBox(width: 4),
              Text(
                '₦14,000',
                style: context.theme.typography.sm.copyWith(
                  fontWeight: FontWeight.bold,
                  color: colors.destructive,
                  fontSize: 8,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        IconWidget(icon: Icons.videocam_outlined),
        const SizedBox(width: 4),
        IconWidget(icon: Icons.settings_outlined),
        const SizedBox(width: 8),
      ],
    );
  }

  Widget _buildActivityCard(BuildContext context) {
    final FColors colors = context.theme.colors;
    final FTypography typography = context.theme.typography;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: colors.secondaryForeground,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "TODAY'S ACTIVITY (NET REVENUE)",
                style: typography.xs.copyWith(
                  fontWeight: FontWeight.bold,
                  color: colors.primaryForeground.withValues(alpha: .6),
                ),
              ),
              Icon(Icons.refresh, size: 16, color: colors.primaryForeground),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            '₦23,500',
            style: typography.xl4.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              _buildStatusIndicator(
                context,
                '₦23,500 REALIZED',
                colors.primary,
              ),
              const SizedBox(width: 12),
              _buildStatusIndicator(context, 'NO PENDING', colors.destructive),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              _buildSubMetricCard(
                context,
                'EST. PROFIT',
                '₦6,800',
                colors.primary,
              ),
              const SizedBox(width: 12),
              _buildSubMetricCard(
                context,
                'PHYSICAL INFLOW',
                '₦23,500',
                colors.secondary,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusIndicator(BuildContext context, String text, Color color) {
    return Row(
      children: [
        Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            color: color,
            fontSize: 9,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildSubMetricCard(
    BuildContext context,
    String title,
    String value,
    Color highlightColor,
  ) {
    final FColors colors = context.theme.colors;

    return Expanded(
      child: FCard(
        style: FCardStyle(
          decoration: BoxDecoration(
            color: colors.primaryForeground.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(16),
          ),
          contentStyle: FCardContentStyle(
            titleTextStyle: TextStyle(),
            subtitleTextStyle: TextStyle(),
          ),
        ),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                color: colors.primaryForeground.withValues(alpha: .7),
                fontSize: 9,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                color: highlightColor,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final FColors colors = context.theme.colors;
    return Row(
      children: [
        _buildActionCard(
          context,
          'Sell Item',
          Icons.shopping_basket_outlined,
          colors.primary,
          onTap: () => context.push(Routes.createSale),
        ),
        const SizedBox(width: 12),
        _buildActionCard(
          context,
          'Add Stock',
          Icons.add_shopping_cart_outlined,
          colors.secondary,
          onTap: () => context.push(Routes.addStock),
        ),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color, {
    VoidCallback? onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: 140,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [color.withValues(alpha: .8), color],
            ),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: .3),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: .2),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: Colors.white, size: 28),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuGrid(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 2.2,
      children: [
        _buildSmallMenuCard(
          context,
          'INVENTORY',
          FIcons.package,
          onTap: () => context.go(Routes.inventory),
        ),
        _buildSmallMenuCard(
          context,
          'SALES LOG',
          FIcons.list,
          onTap: () => context.go(Routes.salesLog),
        ),
        _buildSmallMenuCard(
          context,
          'CALC',
          Icons.calculate_outlined,
          color: Colors.orangeAccent,
          onTap: () => context.push(Routes.calculator),
        ),
        _buildSmallMenuCard(
          context,
          'GROWTH',
          FIcons.trendingUp,
          color: Colors.purpleAccent,
          onTap: () => {},
        ),
      ],
    );
  }

  Widget _buildSmallMenuCard(
    BuildContext context,
    String title,
    IconData icon, {
    Color? color,
    VoidCallback? onTap,
  }) {
    final FColors colors = context.theme.colors;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: colors.secondaryForeground, // Navy blue
          borderRadius: BorderRadius.circular(16),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: colors.primaryForeground.withValues(alpha: .05),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                size: 20,
                color: color ?? colors.primaryForeground.withValues(alpha: 1),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              title,
              style: TextStyle(
                color: colors.primaryForeground.withValues(alpha: 1),
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStockAlertsSection(BuildContext context, HomeState homeState) {
    final FColors colors = context.theme.colors;

    return homeState.inventory.when(
      data: (inventory) {
        final items = inventory.items;

        // 1. SOLD OUT
        final soldOut = items
            .where((item) => item.totalRemainingQuantity == 0)
            .toList();

        // 2. LOW STOCK
        final lowStock = items
            .where(
              (item) =>
                  item.totalRemainingQuantity > 0 &&
                  item.totalRemainingQuantity < 10,
            )
            .toList();

        // 3. EXPIRY
        final now = DateTime.now();
        final criticalExpiry = items
            .where(
              (item) => item.batches.any(
                (b) =>
                    b.expiryDate != null &&
                    b.expiryDate!.isBefore(now.add(const Duration(days: 7))),
              ),
            )
            .toList();

        final expiringSoon = items
            .where(
              (item) =>
                  !criticalExpiry.contains(item) &&
                  item.batches.any(
                    (b) =>
                        b.expiryDate != null &&
                        b.expiryDate!.isBefore(
                          now.add(const Duration(days: 30)),
                        ),
                  ),
            )
            .toList();

        final allAlerts = [
          ...soldOut.map((e) => (e, 'SOLD OUT', colors.error, 'Restock')),
          ...criticalExpiry.map(
            (e) => (e, 'CRITICAL EXPIRY', colors.error, 'Review'),
          ),
          ...lowStock.map((e) => (e, 'LOW STOCK', Colors.amber, 'Restock')),
          ...expiringSoon.map(
            (e) => (e, 'BATCH EXPIRING SOON', Colors.amber, 'Review'),
          ),
        ];

        if (allAlerts.isEmpty) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.warning_amber_rounded,
                    color: Colors.amber,
                    size: 16,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'STOCK ALERTS',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 8),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: colors.primary.withValues(alpha: 0.2),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.check_circle_outline,
                      color: colors.primary,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'All Clear!',
                            style: TextStyle(
                              color: colors.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            'No inventory issues detected at this time.',
                            style: TextStyle(
                              color: colors.primary.withValues(alpha: 0.8),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        }

        final displayAlerts = allAlerts.take(5).toList();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.warning_amber_rounded,
                      color: Colors.amber,
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'STOCK ALERTS',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 8,
                      ),
                    ),
                  ],
                ),
                FBadge(
                  style: FBadgeStyleDelta.delta(
                    decoration: BoxDecorationDelta.delta(
                      color: colors.error.withValues(alpha: .2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  variant: FBadgeVariant.destructive,
                  child: Text(
                    '${allAlerts.length} Issues',
                    style: TextStyle(fontSize: 8),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (criticalExpiry.isNotEmpty) ...[
              _buildCriticalAlertBanner(context, criticalExpiry.length),
              const SizedBox(height: 16),
            ],
            ...displayAlerts.map((alert) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _buildAlertItem(
                  context,
                  alert.$1.product,
                  alert.$2,
                  alert.$3,
                  alert.$4,
                ),
              );
            }),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, s) => const SizedBox.shrink(),
    );
  }

  Widget _buildCriticalAlertBanner(BuildContext context, int count) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Icon(FIcons.calendar, color: Colors.white),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'CRITICAL EXPIRATION ALERT',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '$count items expire within 7 days!',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          Icon(FIcons.chevronRight, color: Colors.white),
        ],
      ),
    );
  }

  Widget _buildAlertItem(
    BuildContext context,
    ProductData product,
    String status,
    Color statusColor,
    String actionText,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: context.theme.colors.secondaryForeground,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: TextStyle(
                    fontSize: 12,
                    color: context.theme.colors.primaryForeground,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.event_busy_outlined,
                      size: 8,
                      color: statusColor,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      status,
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () => context.go('/product-details/${product.id}'),
            child: SizedBox(
              width: 80,
              height: 24,
              child: FBadge(
                style: FBadgeStyleDelta.delta(
                  decoration: BoxDecorationDelta.delta(
                    color: context.theme.colors.destructive.withValues(alpha: .2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                ),
                child: Text(
                  actionText,
                  style: TextStyle(
                    fontSize: 10,
                    color: context.theme.colors.destructive,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpineIntelligence(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
        ), // Purple gradient
        borderRadius: BorderRadius.circular(32),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.auto_awesome, color: Colors.white, size: 18),
              const SizedBox(width: 8),
              const Text(
                'SPINE INTELLIGENCE',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            '"Classic Ankara" has a 4.2x faster turnover on Market Days. Increase your restock by 15% this Thursday to capture ₦2,400 in extra profit."',
            style: TextStyle(color: Colors.white, fontSize: 14, height: 1.5),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: 150,
            height: 40,
            child: FButton(
              onPress: () {},
              style: FButtonStyleDelta.delta(
                decoration: FVariants.from(
                  BoxDecoration(
                    color: Colors.white.withValues(alpha: .05),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  variants: {},
                ),
              ),
              variant: .ghost,
              child: const Text(
                'VIEW FULL ANALYSIS',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
