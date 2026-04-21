import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:spine/data/repositories/sales/sales_repository_abstract.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/sales/state/sales_log_state.dart';
import 'package:spine/ui/sales/view_model/sales_log_view_model.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/widget/spinner_widget.dart';

class SalesLogView extends ConsumerWidget {
  const SalesLogView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(salesLogViewModelProvider);
    final viewModel = ref.read(salesLogViewModelProvider.notifier);
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
              'Sales Log',
              style: TextStyle(
                fontSize: 20,
                color: colors.primaryForeground
              ),
            ),
            const Spacer(),
            IconButton(
              onPressed: () {},
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.search, color: colors.primary, size: 20),
              ),
            ),
          ],
        ),
      ),
      child: Material(
        child: Column(
          children: [
            _buildSummarySection(context, state, viewModel),
            Expanded(child: _buildSalesList(context, state)),
          ],
        ),
      ),
    );
  }

  Widget _buildSummarySection(
    BuildContext context,
    SalesLogState state,
    SalesLogViewModel viewModel,
  ) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 20),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(32),
      ),
      child: Column(
        children: [
          _buildPeriodSelector(context, state, viewModel),
          const SizedBox(height: 32),
          const Text(
            'PERIOD INFLOW (ACTUAL CASH)',
            style: TextStyle(
              color: Colors.grey,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '₦${NumberFormat('#,###').format(state.periodInflow)}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 48,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              Expanded(
                child: _buildMiniCard(
                  'TOTAL SALES',
                  '₦${NumberFormat('#,###').format(state.totalSales)}',
                  const Color(0xFF1DB978),
                  const Color(0xFF1DB978).withValues(alpha: 0.1),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildMiniCard(
                  'OWED TO SHOP',
                  '₦${NumberFormat('#,###').format(state.totalOwed)}',
                  const Color(0xFFEF4444),
                  const Color(0xFFEF4444).withValues(alpha: 0.1),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodSelector(
    BuildContext context,
    SalesLogState state,
    SalesLogViewModel viewModel,
  ) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: SalesPeriod.values.map((p) {
          final isSelected = state.period == p;
          return Expanded(
            child: GestureDetector(
              onTap: () => viewModel.setPeriod(p),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: isSelected ? Colors.white : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    p.name.toUpperCase(),
                    style: TextStyle(
                      color: isSelected ? Colors.black : Colors.grey,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildMiniCard(String label, String value, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 10,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSalesList(BuildContext context, SalesLogState state) {
    if (state.isLoading) {
      return Center(child: SpinnerWidget.spinner());
    }

    if (state.sales.isEmpty) {
      return const Center(child: Text('No sales found for this period'));
    }

    // For simplicity, we just show "TODAY" for all items right now
    // In a full implementation, we'd group by date
    return ListView(
      // padding: const EdgeInsets.symmetric(horizontal: 20),
      children: [
        Row(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                color: Color(0xFF1DB978),
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'TODAY',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ...state.sales.map((item) => _buildSaleTile(context, item)).toList(),
      ],
    );
  }


  Widget _buildSaleTile(BuildContext context, SaleWithItems item) {
    final colors = context.theme.colors;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E2433).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(24),
      ),
      child: InkWell(
        onTap: () => context.push('${Routes.saleReceipt}/${item.sale.id}'),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(Icons.receipt_long, color: colors.primary, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '₦${NumberFormat('#,###').format(item.sale.totalAmount)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  if (item.customer != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      item.customer!.name,
                      style: TextStyle(
                        color: colors.primary,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: colors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          item.sale.paymentMethod.toUpperCase(),
                          style: TextStyle(
                            color: colors.primary,
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "${item.items.length.toString()} Items",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  DateFormat('h:mm a').format(item.sale.createdAt.toLocal()),
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
