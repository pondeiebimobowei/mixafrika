import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/inventory/view_model/product_details_view_model.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:intl/intl.dart';

class ProductDetailsView extends ConsumerWidget {
  final String productId;
  const ProductDetailsView({super.key, required this.productId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(productDetailsViewModelProvider(productId));
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const IconWidget(icon: Icons.arrow_back),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                state.item?.product.name ?? 'Loading...',
                style: TextStyle(
                  color: colors.primaryForeground,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            IconButton(
              onPressed: state.item == null
                  ? null
                  : () => context.push(
                      '${Routes.editProduct}/${state.item!.product.id}',
                    ),
              icon: Icon(
                Icons.edit_outlined,
                color: colors.mutedForeground,
                size: 20,
              ),
            ),
          ],
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: state.isLoading
            ? const Center(child: CircularProgressIndicator())
            : state.errorMessage != null
            ? Center(
                child: Text(
                  state.errorMessage!,
                  style: TextStyle(color: colors.destructive),
                ),
              )
            : state.item == null
            ? const Center(child: Text('No data found'))
            : _buildContent(context, state),
      ),
    );
  }

  Widget _buildContent(BuildContext context, dynamic state) {
    final item = state.item!;
    final product = item.product;

    // Calculate quantities
    final totalUnits = item.totalQuantity;
    final unitsPerBulk = product.unitsPerBulk.toDouble();
    final bulkQty = (totalUnits / unitsPerBulk).floor();
    final remainingUnits = (totalUnits % unitsPerBulk).toInt();

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStockOverview(context, bulkQty, remainingUnits, product),
              const SizedBox(height: 24),
              _buildPricingSection(context, product),
              const SizedBox(height: 24),
              _buildProfitCard(context, product),
              const SizedBox(height: 32),
              _buildBatchesHeader(context, item.batches.length),
              const SizedBox(height: 12),
              ...item.batches
                  .map((batch) => _buildBatchTile(context, batch, unitsPerBulk))
                  .toList(),
              const SizedBox(height: 32),
              _buildProductDetailsTable(context, product, totalUnits),
              const SizedBox(height: 120), // Space for bottom buttons
            ],
          ),
        ),
        _buildBottomActions(context),
      ],
    );
  }

  Widget _buildStockOverview(
    BuildContext context,
    int bulk,
    int units,
    dynamic product,
  ) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 24),
      decoration: BoxDecoration(
        color: const Color(0xFF121826).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          const Text(
            'AVAILABLE STOCK',
            style: TextStyle(
              color: Colors.grey,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildStockCounter(
                bulk.toString(),
                product.bulkUnitName.toUpperCase(),
                Colors.white,
              ),
              Container(
                height: 40,
                width: 1,
                margin: const EdgeInsets.symmetric(horizontal: 24),
                color: Colors.white.withValues(alpha: 0.1),
              ),
              _buildStockCounter(
                units.toString(),
                product.pieceUnitName.toUpperCase(),
                const Color(0xFF1DB978),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            '1 ${product.bulkUnitName} = ${product.unitsPerBulk} ${product.pieceUnitName}',
            style: const TextStyle(color: Colors.grey, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildStockCounter(String value, String label, Color valueColor) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: valueColor,
            fontSize: 42,
            fontWeight: FontWeight.w900,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildPricingSection(BuildContext context, dynamic product) {
    return Row(
      children: [
        Expanded(
          child: _buildPriceCard(
            'COST PRICE',
            '₦${product.costPrice}',
            Colors.white,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildPriceCard(
            'SELLING PRICE',
            '₦${product.sellingPricePerPiece}',
            const Color(0xFF1DB978),
          ),
        ),
      ],
    );
  }

  Widget _buildPriceCard(String label, String price, Color priceColor) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E2433).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            price,
            style: TextStyle(
              color: priceColor,
              fontSize: 24,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfitCard(BuildContext context, dynamic product) {
    // Basic calculation for demo
    final cost = product.costPrice.toDouble();
    final selling =
        product.sellingPricePerPiece.toDouble() *
        product.unitsPerBulk.toDouble();
    final profit = selling - cost;
    final margin = cost > 0 ? (profit / cost * 100).round() : 0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1DB978).withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFF1DB978).withValues(alpha: 0.1),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'PROFIT PER ${product.pieceUnitName.toUpperCase()}',
                  style: const TextStyle(
                    color: Color(0xFF1DB978),
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.1,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '₦${(profit / product.unitsPerBulk).toStringAsFixed(0)}',
                  style: const TextStyle(
                    color: Color(0xFF1DB978),
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1DB978),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '+$margin%',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'MARGIN',
                style: TextStyle(
                  color: Color(0xFF1DB978),
                  fontSize: 9,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBatchesHeader(BuildContext context, int count) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'BATCHES & EXPIRATION',
          style: TextStyle(
            color: Colors.grey,
            fontSize: 11,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.2,
          ),
        ),
        Text(
          '$count active batches',
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 11,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildBatchTile(
    BuildContext context,
    dynamic batch,
    double unitsPerBulk,
  ) {
    final qty = batch.quantity;
    final bulk = (qty / unitsPerBulk).floor();
    final pieces = (qty % unitsPerBulk).toInt();
    final expiry = batch.expiryDate;
    final formattedExpiry = DateFormat('dd MMM yyyy').format(expiry);

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
              Icons.calendar_today,
              color: Colors.orange,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      batch.batchNumber ?? 'Batch',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(width: 8),
                    _buildSmallButton(
                      'RESOLVE',
                      Icons.bolt,
                      const Color(0xFF1DB978),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '$bulk BULK, $pieces PIECES',
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                formattedExpiry,
                style: const TextStyle(
                  color: Colors.orange,
                  fontWeight: FontWeight.w900,
                  fontSize: 13,
                ),
              ),
              const Text(
                'EXPIRY DATE',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(width: 12),
          const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
        ],
      ),
    );
  }

  Widget _buildSmallButton(String text, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: 9,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductDetailsTable(
    BuildContext context,
    dynamic product,
    double totalUnits,
  ) {
    // Calculate total stock value
    final piecePrice = product.sellingPricePerPiece.toDouble();
    final totalValue = piecePrice * totalUnits;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'PRODUCT DETAILS',
          style: TextStyle(
            color: Colors.grey,
            fontSize: 11,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1E2433).withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              _buildDetailRow('Category', product.category, true),
              _buildDetailRow(
                'Stock Code',
                product.serialNumber ?? 'N/A',
                true,
              ),
              _buildDetailRow(
                'Total Stock Value',
                '₦${NumberFormat('#,###').format(totalValue)}',
                false,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value, bool showBorder) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        border: showBorder
            ? Border(
                bottom: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
              )
            : null,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 15)),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActions(BuildContext context) {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.black.withValues(alpha: 0),
              Colors.black.withValues(alpha: 0.8),
            ],
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: _buildActionButton(
                'TRANSFER',
                Icons.swap_horiz,
                Colors.teal,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildActionButton('ADJUST', Icons.tune, Colors.redAccent),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(String label, IconData icon, Color color) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: const Color(0xFF1E2433),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
