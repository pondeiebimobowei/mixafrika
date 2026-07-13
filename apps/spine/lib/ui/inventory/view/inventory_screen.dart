import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/ui/inventory/state/inventory_state.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/utils/helper.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/widget/spinner_widget.dart';

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
            IconWidget(
              icon: Icons.arrow_back_ios_new_rounded,
              size: 18,
              onTap: () => context.go(Routes.dashboard),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'My Stock',
                  style: TextStyle(
                    fontSize: 22,
                    color: colors.primaryForeground,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                  ),
                ),
                Text(
                  'Inventory Overview',
                  style: TextStyle(
                    fontSize: 10,
                    color: colors.primaryForeground.withValues(alpha: 0.4),
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      child: Material(
        color: colors.background,
        child: inventoryAsync.when(
          data: (state) => Stack(
            children: [
              _buildContent(context, ref, state),
              _buildFloatingDock(context),
            ],
          ),
          loading: () => Center(child: SpinnerWidget.spinner()),
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            _buildStats(context, state),
            const SizedBox(height: 16),
            _buildFilters(context, ref, state),
            const SizedBox(height: 20),
            _buildSearchBar(context, ref),
            const SizedBox(height: 28),
            _buildListHeader(context, state),
            const SizedBox(height: 16),
            _buildInventoryList(context, ref, state),
          ],
      ),
    );
  }

  Widget _buildStats(BuildContext context, InventoryState state) {
    final colors = context.theme.colors;
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                context,
                title: 'STOCK WORTH',
                value: formatCurrency(state.stockWorth),
                subtitle: 'Cost value of inventory',
                accent: colors.primary,
                icon: FLucideIcons.package,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                context,
                title: 'EST. PROFIT',
                value: formatCurrency(state.estProfit),
                subtitle: 'Potential earnings',
                accent: colors.secondary,
                icon: Icons.trending_up_rounded,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required String subtitle,
    required Color accent,
    required IconData icon,
  }) {
    final colors = context.theme.colors;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: colors.border.withValues(alpha: 0.6),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            color: accent,
            size: 20,
          ),

          const SizedBox(height: 20),

          Text(
            title,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.35,
              color: accent,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 23,
              fontWeight: FontWeight.w900,
              color: colors.primaryForeground,
              letterSpacing: -1.1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: colors.primaryForeground.withValues(alpha: 0.48),
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
            iconColor: context.theme.colors.primary,
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
            iconColor: context.theme.colors.destructive,
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
            iconColor: context.theme.colors.secondary,
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
    required Color iconColor,
  }) {
    final colors = context.theme.colors;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 64,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? iconColor
                : colors.border.withValues(alpha: 0.9),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected
                    ? iconColor.withValues(alpha: 0.2)
                    : iconColor.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: iconColor,
                size: 18,
              ),
            ),
            const SizedBox(width: 12),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  count,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: colors.primaryForeground,
                  ),
                ),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 8,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                    color: isSelected
                        ? iconColor
                        : colors.primaryForeground.withValues(alpha: 0.8),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar(BuildContext context, WidgetRef ref) {
    final colors = context.theme.colors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: colors.primary.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.search_rounded,
            color: colors.primary.withValues(alpha: 0.6),
            size: 22,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              onChanged: (v) => ref
                  .read(inventoryViewModelProvider.notifier)
                  .setSearchQuery(v),
              style: TextStyle(
                color: colors.primaryForeground,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
              decoration: InputDecoration(
                hintText: 'Search stock...',
                hintStyle: TextStyle(
                  color: colors.mutedForeground,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
                isDense: true,
                contentPadding: EdgeInsets.zero,
                border: InputBorder.none,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildListHeader(BuildContext context, InventoryState state) {
    final colors = context.theme.colors;
    return Row(
      children: [
        Text(
          'STOCK LIST',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
            color: colors.primary.withValues(alpha: 0.7),
          ),
        ),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: colors.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            state.filteredItems.length.toString(),
            style: TextStyle(
              color: colors.primary,
              fontSize: 10,
              fontWeight: FontWeight.w900,
            ),
          ),
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

  Widget _buildInventoryItem(BuildContext context, InventoryItemData item) {
    final FColors colors = context.theme.colors;

    return GestureDetector(
      onTap: () => context.go(
        '${Routes.inventory}/${Routes.productDetails}/${item.product.id}',
      ),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: colors.card.withValues(alpha: 0.3),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: colors.border.withValues(alpha: 0.6),
          ),
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: colors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    Icons.inventory_2_rounded,
                    color: colors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.product.name,
                        style: TextStyle(
                          color: colors.primaryForeground,
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Retail Unit: ${item.product.pieceUnitName}',
                        style: TextStyle(
                          color: colors.primaryForeground.withValues(alpha: 0.4),
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      formatCurrency(item.product.sellingPricePerPiece),
                      style: TextStyle(
                        color: colors.primary,
                        fontWeight: FontWeight.w900,
                        fontSize: 18,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'per ${item.product.pieceUnitName}',
                      style: TextStyle(
                        color: colors.primaryForeground.withValues(alpha: 0.4),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                _buildStockInfo(
                  context,
                  '${item.stockEntries?.quantity ?? 0}',
                  item.product.pieceUnitName,
                ),
                const SizedBox(width: 12),
                _buildStockInfo(
                  context,
                  '${((item.stockEntries?.quantity ?? 0) / (item.product.unitsPerBulk > 0 ? item.product.unitsPerBulk : 1)).toInt()}',
                  item.product.bulkUnitName,
                ),
                const Spacer(),
                Icon(
                  Icons.chevron_right_rounded,
                  color: colors.primaryForeground.withValues(alpha: 0.2),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStockInfo(BuildContext context, String count, String unit) {
    final colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: colors.background,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Text(
            count,
            style: TextStyle(
              color: colors.primaryForeground,
              fontWeight: FontWeight.w900,
              fontSize: 12,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            unit.toUpperCase(),
            style: TextStyle(
              color: colors.primaryForeground.withValues(alpha: 0.4),
              fontWeight: FontWeight.w900,
              fontSize: 9,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFloatingDock(BuildContext context) {
    final colors = context.theme.colors;
    return Positioned(
      left: 16,
      right: 16,
      bottom: 30,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
        decoration: BoxDecoration(
          color: colors.secondaryForeground,
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.3),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
          border: Border.all(
            color: colors.primary.withValues(alpha: 0.1),
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: FButton(
                variant: .outline,
                onPress: () => context.go('${Routes.inventory}/${Routes.addStock}'),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.shopping_cart_outlined,
                      color: context.theme.colors.primaryForeground,
                      size: 18,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'Restock',
                      style: TextStyle(
                        color: context.theme.colors.primaryForeground,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FButton(
                onPress: () => context.go('${Routes.inventory}/${Routes.addProduct}'),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.add_rounded,
                      color: context.theme.colors.primaryForeground,
                      size: 18,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'New Product',
                      style: TextStyle(
                        color: context.theme.colors.primaryForeground,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
