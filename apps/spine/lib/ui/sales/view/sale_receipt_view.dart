import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:spine/data/repositories/sales/sales_repository_abstract.dart';
import 'package:spine/ui/sales/view_model/sale_receipt_view_model.dart';
import 'package:spine/utils/helper.dart';

class SaleReceiptView extends ConsumerWidget {
  final String saleId;
  const SaleReceiptView({super.key, required this.saleId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(saleDetailsViewModelProvider(saleId));
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            IconButton(
              onPressed: () => context.pop(),
              icon: const Icon(Icons.arrow_back),
            ),
            const SizedBox(width: 8),
            const Text('Sale Receipt'),
            const Spacer(),
            IconButton(
              onPressed: () {},
              icon: Icon(Icons.print_outlined, color: colors.primary),
            ),
          ],
        ),
      ),
      child: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : state.errorMessage != null
          ? Center(child: Text(state.errorMessage!))
          : state.item == null
          ? const Center(child: Text('Receipt not found'))
          : _buildContent(context, state.item!),
    );
  }

  Widget _buildContent(BuildContext context, SaleWithItems item) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeaderCard(context, item),
          const SizedBox(height: 32),
          const Text(
            'INVENTORY ITEMS',
            style: TextStyle(
              color: Colors.grey,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          ...item.items.map((i) => _buildItemTile(context, i)).toList(),
          const SizedBox(height: 32),
          const Text(
            'FINANCIAL LOG',
            style: TextStyle(
              color: Colors.grey,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          _buildFinancialLog(context, item),
        ],
      ),
    );
  }

  Widget _buildHeaderCard(BuildContext context, SaleWithItems item) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(32),
        image: const DecorationImage(
          image: AssetImage(
            'assets/receipt_bg.png',
          ), // If exists, otherwise just color
          fit: BoxFit.cover,
          opacity: 0.1,
        ),
      ),
      child: Column(
        children: [
          Text(
            DateFormat('h:mm a').format(item.sale.createdAt),
            style: TextStyle(
              color: Colors.grey.shade400,
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            '₦${NumberFormat('#,###').format(item.sale.totalAmount)}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 48,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 12,
            runSpacing: 12,
            children: [
              _buildBadge(
                'PAID VIA ${item.sale.paymentMethod.toUpperCase()}',
                const Color(0xFF1DB978),
              ),
              _buildBadge(
                'PROFIT: ₦${NumberFormat('#,###').format(item.totalProfit)}',
                const Color(0xFF3B82F6),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  Widget _buildItemTile(BuildContext context, SaleItemWithProduct item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E2433).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.inventory_2_outlined,
              color: Colors.blue,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.item.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${item.item.quantity} x piece @ ₦${NumberFormat('#,###').format(item.item.unitPrice)}',
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ),
          Text(
            '₦${NumberFormat('#,###').format(item.item.total)}',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              fontSize: 18,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFinancialLog(BuildContext context, SaleWithItems item) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E2433).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          _buildLogEntry(
            'ACCRUED REVENUE',
            '₦${NumberFormat('#,###').format(item.sale.totalAmount)}',
            Colors.grey,
          ),
          _buildLogEntry(
            'REALIZED PAYMENT',
            '₦${NumberFormat('#,###').format(item.sale.amountPaid)}',
            const Color(0xFF1DB978),
          ),
          if (item.payments.isNotEmpty)
            ...item.payments.map<Widget>(
              (p) => _buildLogEntry(
                '  ↳ ${p.paymentMethod.toUpperCase()}',
                '₦${NumberFormat('#,###').format(p.amount)}',
                const Color(0xFF1DB978).withValues(alpha: 0.8),
              ),
            ),
          _buildLogEntry(
            'RECEIVABLE BALANCE',
            '₦${NumberFormat('#,###').format(item.sale.balance)}',
            Colors.grey,
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Divider(color: Colors.white10),
          ),
          _buildLogEntry(
            'TRANSACTION ID',
            toEllipsis(item.sale.id),
            Colors.grey,
            isLast: true,
          ),
        ],
      ),
    );
  }

  Widget _buildLogEntry(
    String label,
    String value,
    Color valueColor, {
    bool isLast = false,
  }) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: valueColor,
              fontSize: 14,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}
