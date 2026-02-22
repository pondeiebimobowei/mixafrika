import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:spine/theme/typography.dart';
import 'package:spine/widget/icon_widget.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final List<String> _shops = [
    'Main Shop (Lagos)',
    'Second Shop (Ibadan)',
    'Warehouse (Kano)',
    'Distribution Center (Abuja)',
  ];

  late String _selectedShop;

  @override
  void initState() {
    super.initState();
    _selectedShop = _shops.first;
  }

  void _showShopSelectionSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: context.theme.colors.background,
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
                final filteredShops = _shops
                    .where(
                      (shop) => shop.toLowerCase().contains(
                        searchQuery.toLowerCase(),
                      ),
                    )
                    .toList();

                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      const SizedBox(height: 12),
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: context.theme.colors.border,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          HeadingText(
                            title: 'Select Shop',
                            fontSize: 18,
                            color: context.theme.colors.primaryForeground,
                          ),
                          const Spacer(),
                          // FButton(
                          //   onPress: () => Navigator.pop(context),
                          //   child: const Icon(Icons.close, size: 18),
                          // ),
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
                          color: context.theme.colors.foreground,
                        ),
                        decoration: InputDecoration(
                          hintText: 'Search shops...',
                          hintStyle: TextStyle(
                            color: context.theme.colors.mutedForeground,
                          ),
                          prefixIcon: Icon(
                            Icons.search,
                            color: context.theme.colors.mutedForeground,
                          ),
                          filled: true,
                          fillColor: context.theme.colors.secondary,
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
                            final isSelected = shop == _selectedShop;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 8.0),
                              child: ListTile(
                                onTap: () {
                                  setState(() {
                                    _selectedShop = shop;
                                  });
                                  Navigator.pop(context);
                                },
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                tileColor: isSelected
                                    ? context.theme.colors.primary.withValues(
                                        alpha: 0.1,
                                      )
                                    : Colors.transparent,
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 4,
                                ),
                                title: RegularText(
                                  title: shop,
                                  fontSize: 14,
                                  bold: isSelected,
                                  color: isSelected
                                      ? context.theme.colors.primary
                                      : context.theme.colors.primaryForeground,
                                ),
                                trailing: isSelected
                                    ? Icon(
                                        Icons.check_circle,
                                        color: context.theme.colors.primary,
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
  Widget build(BuildContext context) {
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
            IconWidget(icon: Icons.wb_sunny_outlined),
          ],
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTopBar(context),
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
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => _showShopSelectionSheet(context),
            child: FCard(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                child: Row(
                  children: [
                    Icon(
                      Icons.location_on_outlined,
                      size: 16,
                      color: context.theme.colors.primary,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: XSmallText(
                        title: _selectedShop,
                        fontSize: 8,
                        bold: true,
                      ),
                    ),
                    Icon(
                      Icons.keyboard_arrow_down,
                      textDirection: TextDirection.rtl,
                      color: context.theme.colors.primaryForeground,
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
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: context.theme.colors.secondaryForeground, // Dark slate/navy
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              HeadingText(
                title: "TODAY'S ACTIVITY (NET REVENUE)",
                fontSize: 10,
              ),
              Icon(Icons.refresh, size: 16, color: Colors.white),
            ],
          ),
          const SizedBox(height: 12),
          const HeadingText(title: '₦23,500'),
          const SizedBox(height: 8),
          Row(
            children: [
              _buildStatusIndicator(context, '₦23,500 REALIZED', Colors.green),
              const SizedBox(width: 12),
              _buildStatusIndicator(context, 'NO PENDING', Colors.red),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              _buildSubMetricCard(
                context,
                'EST. PROFIT',
                '₦6,800',
                Colors.greenAccent,
              ),
              const SizedBox(width: 12),
              _buildSubMetricCard(
                context,
                'PHYSICAL INFLOW',
                '₦23,500',
                Colors.blueAccent,
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
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                color: Colors.grey[400],
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
    return Row(
      children: [
        _buildActionCard(
          context,
          'Sell Item',
          FIcons.shoppingCart,
          Colors.green,
        ),
        const SizedBox(width: 12),
        _buildActionCard(context, 'Add Stock', FIcons.shoppingBag, Colors.blue),
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
            colors: [color.withOpacity(0.8), color],
          ),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
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
                color: Colors.white.withOpacity(0.2),
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
        _buildSmallMenuCard(context, 'INVENTORY', FIcons.package),
        _buildSmallMenuCard(context, 'SALES LOG', FIcons.list),
        _buildSmallMenuCard(context, 'CALC', FIcons.calculator),
        _buildSmallMenuCard(context, 'GROWTH', FIcons.trendingUp),
      ],
    );
  }

  Widget _buildSmallMenuCard(
    BuildContext context,
    String title,
    IconData icon,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B), // Navy blue
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 20, color: Colors.grey[400]),
          ),
          const SizedBox(width: 12),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
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
            _buildBadge('5 ISSUES', Colors.red),
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
          'REVIEW',
        ),
        const SizedBox(height: 12),
        _buildAlertItem(
          context,
          'Premium Parboiled Rice',
          'BATCH EXPIRING SOON',
          Colors.amber,
          'REVIEW',
        ),
        const SizedBox(height: 12),
        _buildAlertItem(
          context,
          'Shea Butter Soap',
          'SOLD OUT',
          Colors.red,
          'RESTOCK',
        ),
        const SizedBox(height: 12),
        _buildAlertItem(
          context,
          'Standard Cement Bag',
          'SOLD OUT',
          Colors.red,
          'RESTOCK',
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
          FButton(
            onPress: () {},
            child: Text(
              actionText,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
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
      child: Container(
        padding: const EdgeInsets.all(20.0),
        child: Container(
          child: Column(
            children: [
              GestureDetector(
                child: RegularText(title: 'Update Products'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
