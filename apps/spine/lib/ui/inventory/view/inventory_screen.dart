import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/routing/routes.dart';

class InventoryView extends ConsumerWidget {
  const InventoryView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inventoryAsync = ref.watch(inventoryViewModelProvider);
    final FColors colors = context.theme.colors;

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
              'My Stock',
              style: TextStyle(fontSize: 20, color: colors.primaryForeground),
            ),
            const Spacer(),
            FButton(
              size: .xs,
              prefix: Icon(
                Icons.shopping_cart_outlined,
                color: colors.primaryForeground,
              ),
              onPress: () => context.go(Routes.addStock),
              variant: .outline,
              child: Text(
                'RESTOCK',
                style: TextStyle(color: colors.primaryForeground),
              ),
            ),

            const SizedBox(width: 8),

            Container(
              padding: const EdgeInsets.all(5),
              decoration: BoxDecoration(
                color: context.theme.colors.primary,
                shape: BoxShape.circle,
              ),
              child: FButton(
                size: .xs,
                onPress: () => context.go(Routes.addProduct),
                child: Icon(Icons.add, color: Colors.white, size: 24),
              ),
            ),
            // Container(
            //   padding: const EdgeInsets.all(8),
            //   decoration: BoxDecoration(
            //     color: context.theme.colors.primary,
            //     shape: BoxShape.circle,
            //   ),
            //   child: FButton(onPress: ()=>{}, child: Icon(Icons.add, color: Colors.white, size: 24)),
            //   // child: const Icon(Icons.add, color: Colors.white, size: 24),
            // ),
          ],
        ),
      ),
      child: Material(
        child: inventoryAsync.when(
          data: (state) => _buildContent(context, ref, state),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stack) => Center(
            child: Text(
              'Error: $error',
              style: TextStyle(color: colors.primaryForeground),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(
    BuildContext context,
    WidgetRef ref,
    InventoryState state,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildStats(context, state),
          const SizedBox(height: 24),
          _buildFilters(context, ref, state),
          const SizedBox(height: 24),
          _buildSearchBar(context, ref),
          const SizedBox(height: 32),
          _buildListHeader(context, state),
          const SizedBox(height: 16),
          _buildInventoryList(context, ref, state),
        ],
      ),
    );
  }

  Widget _buildStats(BuildContext context, InventoryState state) {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            context,
            'STOCK WORTH',
            '₦${state.stockWorth.toStringAsFixed(0)}',
            'Cost value of inventory',
            const Color(0xFF1E293B),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            context,
            'EST. PROFIT',
            '₦${state.estProfit.toStringAsFixed(0)}',
            'Potential earnings',
            const Color(0xFF1E293B),
            valueColor: Colors.greenAccent,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String title,
    String value,
    String sub,
    Color bgColor, {
    Color? valueColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 10,
              fontWeight: .bold,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: .bold,
              color: valueColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            sub,
            style: TextStyle(
              fontSize: 10,
              fontWeight: .bold,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters(
    BuildContext context,
    WidgetRef ref,
    InventoryState state,
  ) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      clipBehavior: Clip.none,
      child: Row(
        children: [
          _buildFilterItem(
            context,
            '10',
            'ALL PRODUCTS',
            Icons.grid_view_rounded,
            state.currentFilter == InventoryFilter.all,
            () => ref
                .read(inventoryViewModelProvider.notifier)
                .setFilter(InventoryFilter.all),
          ),
          const SizedBox(width: 12),
          _buildFilterItem(
            context,
            '2',
            'LOW STOCK',
            Icons.warning_amber_rounded,
            state.currentFilter == InventoryFilter.lowStock,
            () => ref
                .read(inventoryViewModelProvider.notifier)
                .setFilter(InventoryFilter.lowStock),
            iconColor: Colors.redAccent,
          ),
          const SizedBox(width: 12),
          _buildFilterItem(
            context,
            '2',
            'EXPIRING',
            Icons.calendar_today_rounded,
            state.currentFilter == InventoryFilter.expiring,
            () => ref
                .read(inventoryViewModelProvider.notifier)
                .setFilter(InventoryFilter.expiring),
            iconColor: Colors.orangeAccent,
          ),
        ],
      ),
    );
  }

  Widget _buildFilterItem(
    BuildContext context,
    String count,
    String label,
    IconData icon,
    bool isSelected,
    VoidCallback onTap, {
    Color? iconColor,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 80,
        constraints: BoxConstraints(minWidth: label.isEmpty ? 60 : 140),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.grey[100]
                    : Colors.white.withValues(alpha: .05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: iconColor ?? (isSelected ? Colors.black : Colors.white),
                size: 20,
              ),
            ),
            if (label.isNotEmpty) ...[
              const SizedBox(width: 12),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    count,
                    style: TextStyle(
                      fontSize: 16,
                      color: isSelected ? Colors.black : Colors.white,
                    ),
                  ),
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 8,
                      fontWeight: .bold,
                      color: isSelected ? Colors.black54 : Colors.grey[400],
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
      ),
      child: TextField(
        onChanged: (v) =>
            ref.read(inventoryViewModelProvider.notifier).setSearchQuery(v),
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          icon: Icon(Icons.search, color: Colors.grey[400]),
          hintText: 'Search items...',
          hintStyle: TextStyle(color: Colors.grey[500]),
          border: InputBorder.none,
        ),
      ),
    );
  }

  Widget _buildListHeader(BuildContext context, InventoryState state) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'INVENTORY LIST (${state.currentFilter.name.toUpperCase()})',
          style: TextStyle(fontSize: 12, color: Colors.grey[400]),
        ),
        Text(
          '${state.filteredItems.length} Results',
          style: TextStyle(fontSize: 12, color: Colors.grey[500]),
        ),
      ],
    );
  }

  Widget _buildInventoryList(
    BuildContext context,
    WidgetRef ref,
    InventoryState state,
  ) {
    if (state.filteredItems.isEmpty) {
      return _buildEmptyState(context, ref, state);
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: state.filteredItems.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = state.filteredItems[index];
        return _buildInventoryItem(context, item);
      },
    );
  }

  Widget _buildEmptyState(
    BuildContext context,
    WidgetRef ref,
    InventoryState state,
  ) {
    String message = 'Keep track of your products and their stock levels here.';
    String title = 'No items in stock';
    IconData icon = Icons.inventory_2_outlined;

    if (state.searchQuery.isNotEmpty) {
      title = 'No search results';
      message = 'We couldn\'t find any items matching "${state.searchQuery}"';
      icon = Icons.search_off_rounded;
    } else if (state.currentFilter == InventoryFilter.lowStock) {
      title = 'No low stock items';
      message = 'All your products have sufficient stock levels.';
      icon = Icons.check_circle_outline_rounded;
    } else if (state.currentFilter == InventoryFilter.expiring) {
      title = 'No expiring items';
      message =
          'None of your batches are set to expire within the next 30 days.';
      icon = Icons.calendar_today_outlined;
    }

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 64, horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B).withOpacity(0.5),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 48, color: Colors.grey[500]),
          ),
          const SizedBox(height: 24),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            message,
            style: TextStyle(fontSize: 14, color: Colors.grey[500]),
            textAlign: TextAlign.center,
          ),
          if (state.searchQuery.isNotEmpty ||
              state.currentFilter != InventoryFilter.all) ...[
            const SizedBox(height: 32),
            FButton(
              onPress: () {
                if (state.searchQuery.isNotEmpty) {
                  ref
                      .read(inventoryViewModelProvider.notifier)
                      .setSearchQuery('');
                } else {
                  ref
                      .read(inventoryViewModelProvider.notifier)
                      .setFilter(InventoryFilter.all);
                }
              },
              child: Text(
                state.searchQuery.isNotEmpty
                    ? 'Clear search'
                    : 'Show all products',
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInventoryItem(BuildContext context, dynamic item) {
    // Determine status color based on logic (low stock, expiring)
    Color statusColor = Colors.greenAccent;
    String? statusBadge;

    // Mock logic for demo purposes based on design
    if (item.product.name.contains('Bananas')) {
      statusBadge = 'EXPIRING';
      statusColor = Colors.orangeAccent;
    }

    return GestureDetector(
      onTap: () => context.push('${Routes.productDetails}/${item.product.id}'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange[50], // Box color from image
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                Icons.calendar_today_rounded,
                color: Colors.orange[700],
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.product.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildCountBadge(context, '12', 'Bunchs'),
                      const SizedBox(width: 8),
                      _buildCountBadge(
                        context,
                        '12',
                        'Fingers',
                        color: Colors.green.withValues(alpha: 0.1),
                        textColor: Colors.greenAccent,
                      ),
                      if (statusBadge != null) ...[
                        const SizedBox(width: 8),
                        _buildStatusBadge(context, statusBadge, statusColor),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '₦${item.product.sellingPricePerPiece}',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: statusColor,
                  ),
                ),
                const SizedBox(height: 8),
                const Icon(Icons.chevron_right, color: Colors.grey),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCountBadge(
    BuildContext context,
    String count,
    String label, {
    Color? color,
    Color? textColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color ?? Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(
            count,
            style: TextStyle(fontSize: 10, fontWeight: .bold, color: textColor),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 8,
              color: textColor?.withValues(alpha: .7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(BuildContext context, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .2),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 8,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
