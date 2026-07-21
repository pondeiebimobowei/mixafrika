import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/inventory/state/product_details_state.dart';
import 'package:spine/ui/inventory/view_model/product_details_view_model.dart';
import 'package:spine/utils/helper.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/widget/spinner_widget.dart';

class ProductDetailsView extends ConsumerWidget {
  final String productId;
  const ProductDetailsView({super.key, required this.productId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ProductDetailsState state = ref.watch(productDetailsViewModelProvider(productId));
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
                      '${Routes.inventory}/${Routes.editProduct}/${state.item!.product.id}',
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
            ? Center(child: SpinnerWidget.spinner())
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

  Widget _buildContent(BuildContext context, ProductDetailsState state) {
    final item = state.item!;
    final product = item.product;

    // Calculate quantities
    final totalUnits = item.stockEntries?.quantity ?? 0;
    final unitsPerBulk = product.unitsPerBulk.toDouble();
    final bulkQty = (totalUnits / unitsPerBulk).floor();
    final remainingUnits = item.stockEntries?.quantity.toInt() ?? 0;

    return Stack(
      children: [
        SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStockOverview(context, bulkQty, remainingUnits, product),
              const SizedBox(height: 24),
              _buildPricingSection(context, state),
              const SizedBox(height: 24),
              _buildProfitCard(context, state),
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
    ProductData product,
  ) {
    final FColors colors = context.theme.colors;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 24),
      decoration: BoxDecoration(
        color: colors.card,
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

  Widget _buildPricingSection(BuildContext context, ProductDetailsState state) {
    final colors = context.theme.colors;

    final product = state.item!.product;
    final batchItem = state.item!.batches.firstOrNull;

    final costPricePerUnit =
        batchItem != null && batchItem.initialQuantity > 0
            ? batchItem.costPricePerUnit / batchItem.initialQuantity
            : 0;

    

    return Row(
      children: [
        Expanded(
          child: _buildPriceCard(
            context,
            'COST PRICE',
            formatCurrency(costPricePerUnit),
            colors.primaryForeground,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildPriceCard(
            context,
            'SELLING PRICE',
            formatCurrency(product.sellingPricePerPiece),
            colors.primary,
          ),
        ),
      ],
    );
  }

  Widget _buildPriceCard(BuildContext context, String label, String price, Color priceColor) {
    final FColors colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: colors.secondaryForeground,
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

  Widget _buildProfitCard(BuildContext context, ProductDetailsState state) {
    final product = state.item!.product;
    final batchItem = state.item!.batches.firstOrNull;

    final costPricePerUnit = batchItem != null && batchItem.initialQuantity > 0
        ? batchItem.costPricePerUnit / batchItem.initialQuantity
        : 0;
    final sellingPrice = product.sellingPricePerPiece;
    final margin = sellingPrice > 0
    ? (((sellingPrice - costPricePerUnit) / sellingPrice) * 100).round()
    : 0;
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
                  formatCurrency(product.sellingPricePerPiece - costPricePerUnit.toInt()),
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
    SpineBatchData batch,
    double unitsPerBulk,
  ) {
    final qty = batch.remainingQuantity;
    final bulk = (qty / unitsPerBulk).floor();
    final pieces = (qty % unitsPerBulk).toInt();
    final expiry = batch.expiryDate;
    final formattedExpiry = expiry != null ? toDateTime(expiry.toString()) : '';

    final FColors colors = context.theme.colors;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.secondaryForeground,
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
                      toEllipsis(batch.batchNumber),
                      style: TextStyle(
                        color: colors.primaryForeground,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
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
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
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
    ProductData product,
    int totalUnits,
  ) {
    // Calculate total stock value
    final piecePrice = product.sellingPricePerPiece.toDouble();
    final totalValue = piecePrice * totalUnits;
    final FColors colors = context.theme.colors;

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
            color: colors.secondaryForeground,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              _buildDetailRow(context,'Category', product.category, true),
              _buildDetailRow(
                context,
                'Stock Code',
                 'N/A',
                true,
              ),
              _buildDetailRow(
                context,
                'Total Stock Value',
                formatCurrency(totalValue),
                false,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(BuildContext context, String label, String value, bool showBorder) {
    final FColors colors = context.theme.colors;
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
            style: TextStyle(
              color: colors.primaryForeground,
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
                context,
                'TRANSFER',
                Icons.swap_horiz,
                Colors.teal,
                onTap: () => context.push(
                  '${Routes.inventory}/${Routes.productDetails}/${productId}/${Routes.stockTransfer}',
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildActionButton(context,'ADJUST', Icons.tune, Colors.redAccent),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(BuildContext context, String label, IconData icon, Color color, {VoidCallback? onTap}) {
    final FColors colors = context.theme.colors;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 56,
        decoration: BoxDecoration(
          color: colors.secondaryForeground,
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
              style: TextStyle(
                color: colors.primaryForeground,
                fontWeight: FontWeight.w900,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
