import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/theme/app-theme.dart';
import 'package:spine/theme/typography.dart';
import 'package:spine/ui/home/view_model/home_view_model.dart';
import 'package:spine/ui/user_business/active_user_business_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/widget/icon_widget.dart';

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
                        style: TextStyle(
                          color: colors.foreground,
                        ),
                        decoration: InputDecoration(
                          hintText: 'Search shops...',
                          hintStyle: TextStyle(
                            color: colors.mutedForeground,
                          ),
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
                                    ? colors.primary.withValues(
                                        alpha: 0.1,
                                      )
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
        title: Row(
          children: [
            // CircleAvatar(
            //   radius: 16,
            //   backgroundImage: NetworkImage(
            //     'https://placeholder.com/150',
            //   ), // Placeholder for profile pic
            // ),
            const SizedBox(width: 12),
            const HeadingText(title: 'Dashboard', fontSize: 12),
            const Spacer(),
            IconWidget(icon: Icons.notifications_outlined),
            GestureDetector(
              onTap: () => themeNotifier.toggleTheme(),
              child: IconWidget(icon: Icons.wb_sunny_outlined),
            )
          ],
        ),
      ),
      child: homeState.when(
        data: (homeState) {
          return Material(
            color: colors.background,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(8),
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
                  _buildStockAlertsSection(context),
                  const SizedBox(height: 32),
                  _buildSpineIntelligence(context),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          );
        },
        loading: () => const CircularProgressIndicator(),
        error: (error, stack) => RegularText(title: 'Error: $error'),
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
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                child: Row(
                  children: [
                    Icon(
                      Icons.location_on_outlined,
                      size: 16,
                      color: colors.primary,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
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
                      size: 16,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        IconWidget(icon: Icons.videocam_outlined),
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
                style: typography.xs.copyWith(fontWeight: FontWeight.bold, color: colors.primaryForeground.withValues(alpha: .6)),
              ),
              Icon(Icons.refresh, size: 16, color: colors.primaryForeground),
            ],
          ),
          const SizedBox(height: 24),
          Text('₦23,500', style: typography.xl4.copyWith(fontWeight: FontWeight.w800 )),
          const SizedBox(height: 8),
          Row(
            children: [
              _buildStatusIndicator(context, '₦23,500 REALIZED', colors.primary),
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
        style: FCardStyle(decoration: BoxDecoration(
          color: colors.primaryForeground.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),

        ), contentStyle: FCardContentStyle(titleTextStyle: TextStyle(), subtitleTextStyle: TextStyle())),
        
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
          FIcons.shoppingCart,
          colors.primary,
        ),
        const SizedBox(width: 12),
        _buildActionCard(context, 'Add Stock', FIcons.shoppingBag, colors.secondary),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
  ) {
    return Expanded(
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
          onTap: () => context.push(Routes.inventory),
        ),
        _buildSmallMenuCard(context, 'SALES LOG', FIcons.list),
        _buildSmallMenuCard(context, 'CALC', FIcons.calculator),
        _buildSmallMenuCard(context, 'GROWTH', FIcons.trendingUp),
      ],
    );
  }

  Widget _buildSmallMenuCard(
    BuildContext context,
    String title,
    IconData icon, {
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
              child: Icon(icon, size: 20, color: colors.primaryForeground.withValues(alpha: .7)),
            ),
            const SizedBox(width: 12),
            Text(
              title,
              style: TextStyle(
                color: colors.primaryForeground.withValues(alpha: .7),
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStockAlertsSection(BuildContext context) {
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
                  size: 18,
                ),
                const SizedBox(width: 8),
                const Text(
                  'STOCK ALERTS',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ],
            ),
            FBadge(child: Text('15 Issues'), variant: FBadgeVariant.destructive),
          ],
        ),
        const SizedBox(height: 16),
        _buildCriticalAlertBanner(context),
        const SizedBox(height: 16),
        _buildAlertItem(
          context,
          'Organic Bananas',
          'CRITICAL EXPIRY',
          Colors.red,
          'Review',
        ),
        const SizedBox(height: 12),
        _buildAlertItem(
          context,
          'Premium Parboiled Rice',
          'BATCH EXPIRING SOON',
          Colors.amber,
          'Review',
        ),
        const SizedBox(height: 12),
        _buildAlertItem(
          context,
          'Shea Butter Soap',
          'SOLD OUT',
          Colors.red,
          'Restock',
        ),
        const SizedBox(height: 12),
        _buildAlertItem(
          context,
          'Standard Cement Bag',
          'SOLD OUT',
          Colors.red,
          'Restock',
        ),
      ],
    );
  }

  Widget _buildCriticalAlertBanner(BuildContext context) {
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
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CRITICAL EXPIRATION ALERT',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '1 items expire within 7 days!',
                  style: TextStyle(
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
    String name,
    String status,
    Color statusColor,
    String actionText,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(FIcons.calendar, size: 12, color: statusColor),
                    const SizedBox(width: 4),
                    Text(
                      status,
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () {},
            child: SizedBox(
              width: 80,
              height: 30,
              child: FBadge(child: Text(actionText, style: TextStyle(fontSize: 14),), variant: .android),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
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
              decoration: FVariants.from(BoxDecoration(
                color: Colors.white.withValues(alpha: .05),
                borderRadius: BorderRadius.circular(16)), variants: {})),
            variant: .ghost,
            child: const Text(
              'VIEW FULL ANALYSIS',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white),
            ),
          ),
          )
        ],
      ),
    );
  }
}
