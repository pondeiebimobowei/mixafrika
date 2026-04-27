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
              _buildFloatingDock(context, state),
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
          const SizedBox(height: 28),
          _buildFilters(context, ref, state),
          const SizedBox(height: 28),
          _buildSearchBar(context, ref),
          const SizedBox(height: 32),
          _buildListHeader(context, state),
          // const SizedBox(height: 16),
          _buildInventoryList(context, ref, state),
          const SizedBox(height: 120), // Spacing for Dock
        ],
      ),
    );
  }

  Widget _buildStats(BuildContext context, InventoryState state) {
    final colors = context.theme.colors;

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            context,
            'STOCK WORTH',
            formatCurrency(state.stockWorth),
            'Cost value of inventory',
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            context,
            'EST. PROFIT',
            formatCurrency(state.estProfit),
            'Potential earnings',
            valueColor: colors.primary,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String title,
    String value,
    String sub, {
    Color? valueColor,
  }) {
    final colors = context.theme.colors;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            colors.secondaryForeground.withValues(alpha: 0.8),
            colors.secondaryForeground.withValues(alpha: 0.4),
          ],
        ),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: colors.primary.withValues(alpha: 0.08),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
              color: colors.primary.withValues(alpha: 0.7),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: valueColor ?? colors.primaryForeground,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            sub,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: colors.primaryForeground.withValues(alpha: 0.4),
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
    final colors = context.theme.colors;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 64,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: isSelected
              ? colors.primary
              : colors.secondaryForeground.withValues(alpha: 0.3),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? colors.primary
                : colors.primary.withValues(alpha: 0.05),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.black.withValues(alpha: 0.1)
                    : colors.primary.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: isSelected ? Colors.black : (iconColor ?? colors.primary),
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
                    color: isSelected ? Colors.black : colors.primaryForeground,
                  ),
                ),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 8,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                    color: isSelected
                        ? Colors.black.withValues(alpha: 0.6)
                        : colors.primaryForeground.withValues(alpha: 0.4),
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
              onChanged: (v) =>
                  ref.read(inventoryViewModelProvider.notifier).setSearchQuery(v),
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
          '${Routes.inventory}/${Routes.productDetails}/${item.product.id}'),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: colors.secondaryForeground.withValues(alpha: 0.3),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(
            color: colors.primary.withValues(alpha: 0.05),
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

  Widget _buildFloatingDock(BuildContext context, InventoryState state) {
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
                onPress: () =>
                    context.go('${Routes.inventory}/${Routes.addStock}'),
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
                onPress: () =>
                    context.go('${Routes.inventory}/${Routes.addProduct}'),
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
