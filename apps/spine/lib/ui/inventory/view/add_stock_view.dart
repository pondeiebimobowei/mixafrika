import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/inventory/state/add_stock_state.dart';
import 'package:spine/ui/inventory/view_model/add_stock_view_model.dart';
import 'package:intl/intl.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/widget/icon_widget.dart';

class AddStockView extends ConsumerStatefulWidget {
  const AddStockView({super.key});

  @override
  ConsumerState<AddStockView> createState() => _AddStockViewState();
}

class _AddStockViewState extends ConsumerState<AddStockView> {
  late TextEditingController _bulkController;
  late TextEditingController _pieceController;

  @override
  void initState() {
    super.initState();
    _bulkController = TextEditingController();
    _pieceController = TextEditingController();
  }

  @override
  void dispose() {
    _bulkController.dispose();
    _pieceController.dispose();
    super.dispose();
  }

  void _showProductSearchSheet(BuildContext context) {
    final colors = context.theme.colors;
    final viewModel = ref.read(addStockViewModelProvider.notifier);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: colors.background,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.8,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          expand: false,
          builder: (context, scrollController) {
            return Consumer(
              builder: (context, ref, _) {
                final state = ref.watch(addStockViewModelProvider);
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
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
                            'Select Product',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: colors.primaryForeground,
                            ),
                          ),
                          const Spacer(),
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: const IconWidget(icon: Icons.close),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        onChanged: viewModel.updateSearchQuery,
                        style: TextStyle(color: colors.primaryForeground),
                        decoration: InputDecoration(
                          hintText: 'Search products...',
                          hintStyle: TextStyle(color: colors.mutedForeground),
                          prefixIcon: Icon(
                            Icons.search,
                            color: colors.mutedForeground,
                          ),
                          filled: true,
                          fillColor: colors.secondaryForeground.withValues(
                            alpha: 0.5,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 16,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: ListView.builder(
                          controller: scrollController,
                          itemCount: state.filteredProducts.length,
                          itemBuilder: (context, index) {
                            final product = state.filteredProducts[index];
                            final isSelected =
                                state.selectedProduct?.id == product.id;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: ListTile(
                                onTap: () {
                                  viewModel.selectProduct(product);
                                  _bulkController.clear();
                                  _pieceController.clear();
                                  Navigator.pop(context);
                                },
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                tileColor: isSelected
                                    ? colors.primary.withValues(alpha: 0.1)
                                    : colors.secondaryForeground.withValues(
                                        alpha: 0.3,
                                      ),
                                leading: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: colors.primary.withValues(
                                      alpha: 0.1,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    Icons.inventory_2_outlined,
                                    color: colors.primary,
                                  ),
                                ),
                                title: Text(
                                  product.name,
                                  style: TextStyle(
                                    color: colors.primaryForeground,
                                    fontWeight: isSelected
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                  ),
                                ),
                                subtitle: Text(
                                  '${product.bulkUnitName} / ${product.pieceUnitName}',
                                  style: TextStyle(
                                    color: colors.mutedForeground,
                                    fontSize: 12,
                                  ),
                                ),
                                trailing: isSelected
                                    ? Icon(
                                        Icons.check_circle,
                                        color: colors.primary,
                                      )
                                    : Icon(
                                        Icons.chevron_right,
                                        color: colors.primaryForeground,
                                      ),
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
    final state = ref.watch(addStockViewModelProvider);
    final viewModel = ref.read(addStockViewModelProvider.notifier);
    final colors = context.theme.colors;

    ref.listen(addStockViewModelProvider, (previous, next) {
      if (next.isSuccess) {
        context.go(Routes.inventory);
        print('donre');
        ref.invalidate(inventoryViewModelProvider);
      }
      if (next.errorMessage != null &&
          next.errorMessage != previous?.errorMessage) {
            print(next.errorMessage);
      }


      // Update controllers if state changes from outside (e.g. conversion logic)
      if (next.bulkQuantity != _bulkController.text &&
          next.bulkQuantity != previous?.bulkQuantity) {
        _bulkController.text = next.bulkQuantity;
      }
      if (next.pieceQuantity != _pieceController.text &&
          next.pieceQuantity != previous?.pieceQuantity) {
        _pieceController.text = next.pieceQuantity;
      }
    });

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            IconButton(
              onPressed: () => context.go(Routes.dashboard),
              icon: const IconWidget( icon: Icons.arrow_back),
            ),
            const SizedBox(width: 20),
            Text(
              'Add New Stock',
              style: TextStyle(
                color: colors.primaryForeground,
                fontSize: 20,
              ),
            ),
          ],
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: Stack(
          children: [
            SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildBanner(context),
                  const SizedBox(height: 32),

                  _buildLabel('SELECT PRODUCT'),
                  const SizedBox(height: 12),
                  _buildProductSelector(context, state),
                  const SizedBox(height: 24),

                  _buildQuantitySection(context, state, viewModel),
                  const SizedBox(height: 24),

                  _buildLabel('BATCH COST PRICE (TOTAL)'),
                  const SizedBox(height: 12),
                  _buildCostInput(context, state, viewModel),
                  if (state.totalCost.isNotEmpty &&
                      state.selectedProduct != null) ...[
                    const SizedBox(height: 12),
                    _buildCostAnalysis(context, state),
                  ],
                  const SizedBox(height: 24),

                  _buildLabel('BATCH EXPIRY DATE'),
                  const SizedBox(height: 12),
                  _buildDatePicker(context, state, viewModel),

                  const SizedBox(height: 120),
                ],
              ),
            ),
            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
                decoration: BoxDecoration(
                  color: colors.background,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 20,
                      offset: const Offset(0, -10),
                    ),
                  ],
                ),
                child: FButton(
                  onPress: state.isLoading ? null : () => viewModel.submit(),
                  style: FButtonStyleDelta.delta(
                    decoration: FVariants.from(
                      BoxDecoration(borderRadius: BorderRadius.circular(16)),
                      variants: {},
                    ),
                  ),
                  child: state.isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          'Record Purchase',
                          style: TextStyle(
                            color: colors.primaryForeground,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBanner(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1DB978), Color(0xFF008E5B)],
        ),
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1DB978).withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            right: -20,
            top: -20,
            child: Icon(
              Icons.inventory_2_rounded,
              size: 140,
              color: Colors.white.withValues(alpha: 0.15),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'RESTOCKING OPERATION',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Record Purchase',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: const TextStyle(
        color: Colors.grey,
        fontSize: 11,
        fontWeight: FontWeight.w800,
        letterSpacing: 1.2,
      ),
    );
  }

  Widget _buildProductSelector(BuildContext context, AddStockState state) {
    final colors = context.theme.colors;
    return GestureDetector(
      onTap: () => _showProductSearchSheet(context),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1E2433).withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: colors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.inventory_2_outlined,
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
                    state.selectedProduct?.name ?? 'Select Product',
                    style: TextStyle(
                      color: state.selectedProduct != null
                          ? Colors.white
                          : Colors.grey,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (state.selectedProduct != null)
                    Text(
                      '${state.selectedProduct!.bulkUnitName} / ${state.selectedProduct!.pieceUnitName}',
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                ],
              ),
            ),
            const Icon(
              Icons.keyboard_arrow_down_rounded,
              color: Colors.grey,
              size: 28,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuantitySection(
    BuildContext context,
    AddStockState state,
    AddStockViewModel viewModel,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E2433).withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'QUANTITY RECEIVED',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.1,
                ),
              ),
              _buildInputModeToggle(context, state, viewModel),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: _buildQtyField(
                  state.selectedProduct?.bulkUnitName.toUpperCase() ?? 'BULK',
                  _bulkController,
                  viewModel.updateBulkQuantity,
                  state.isEnteringBulk,
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: _buildQtyField(
                  state.selectedProduct?.pieceUnitName.toUpperCase() ?? 'ITEM',
                  _pieceController,
                  viewModel.updatePieceQuantity,
                  !state.isEnteringBulk,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInputModeToggle(
    BuildContext context,
    AddStockState state,
    AddStockViewModel viewModel,
  ) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFF0A0F1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildToggleOption(
            'BULK',
            state.isEnteringBulk,
            () => viewModel.toggleEntryMode(true),
          ),
          _buildToggleOption(
            'UNIT',
            !state.isEnteringBulk,
            () => viewModel.toggleEntryMode(false),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleOption(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1DB978) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF1DB978).withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : [],
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected
                ? Colors.white
                : Colors.grey.withValues(alpha: 0.6),
            fontSize: 11,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }

  Widget _buildQtyField(
    String label,
    TextEditingController controller,
    Function(String) onChanged,
    bool isEnabled,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              label,
              style: TextStyle(
                color: isEnabled
                    ? Colors.grey
                    : Colors.grey.withValues(alpha: 0.5),
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.5,
              ),
            ),
            if (!isEnabled) ...[
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.amber.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.auto_awesome,
                      size: 10,
                      color: Colors.amber.withValues(alpha: 0.9),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'AUTO',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: Colors.amber.withValues(alpha: 0.9),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 10),
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: isEnabled
                ? const Color(0xFF0A0F1A)
                : const Color(0xFF0A0F1A).withValues(alpha: 0.4),
            borderRadius: BorderRadius.circular(16),
            border: isEnabled
                ? Border.all(
                    color: const Color(0xFF1DB978).withValues(alpha: 0.3),
                  )
                : Border.all(color: Colors.transparent),
          ),
          child: TextField(
            controller: controller,
            readOnly: !isEnabled,
            style: TextStyle(
              color: isEnabled
                  ? Colors.white
                  : Colors.grey.withValues(alpha: 0.4),
              fontSize: 22,
              fontWeight: FontWeight.w900,
            ),
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: '0',
              hintStyle: TextStyle(color: Colors.grey.withValues(alpha: 0.3)),
              contentPadding: const EdgeInsets.symmetric(vertical: 18),
            ),
            onChanged: isEnabled ? onChanged : null,
          ),
        ),
      ],
    );
  }

  Widget _buildCostInput(
    BuildContext context,
    AddStockState state,
    AddStockViewModel viewModel,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E2433).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: TextField(
        style: const TextStyle(
          color: Colors.white,
          fontSize: 22,
          fontWeight: FontWeight.w900,
        ),
        keyboardType: TextInputType.number,
        decoration: InputDecoration(
          border: InputBorder.none,
          prefixIcon: Padding(
            padding: const EdgeInsets.only(right: 12.0, top: 12),
            child: Text(
              '₦',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          hintText: '0.00',
          hintStyle: const TextStyle(color: Colors.grey),
          contentPadding: const EdgeInsets.symmetric(vertical: 20),
        ),
        onChanged: viewModel.updateTotalCost,
      ),
    );
  }

  Widget _buildCostAnalysis(BuildContext context, AddStockState state) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.teal.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.teal.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          const Icon(Icons.analytics_outlined, color: Colors.teal, size: 18),
          const SizedBox(width: 12),
          Text(
            'EST. PURCHASE COST PER ${state.selectedProduct?.pieceUnitName.toUpperCase() ?? 'UNIT'}:',
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Spacer(),
          Text(
            '₦${state.estCostPerPiece.toStringAsFixed(2)}',
            style: const TextStyle(
              color: Colors.teal,
              fontSize: 14,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDatePicker(
    BuildContext context,
    AddStockState state,
    AddStockViewModel viewModel,
  ) {
    final displayDate = state.expiryDate != null
        ? DateFormat('MM/dd/yyyy').format(state.expiryDate!)
        : 'mm/dd/yyyy';

    return GestureDetector(
      onTap: () async {
        final date = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime.now(),
          lastDate: DateTime.now().add(const Duration(days: 3650)),
          builder: (context, child) {
            return Theme(
              data: Theme.of(context).copyWith(
                colorScheme: ColorScheme.dark(
                  primary: context.theme.colors.primary,
                  onPrimary: context.theme.colors.primaryForeground,
                  surface: const Color(0xFF1E2433),
                  onSurface: Colors.white,
                ),
              ),
              child: child!,
            );
          },
        );
        if (date != null) viewModel.updateExpiryDate(date);
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1E2433).withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Row(
          children: [
            const Icon(
              Icons.calendar_today_outlined,
              color: Colors.redAccent,
              size: 24,
            ),
            const SizedBox(width: 16),
            Text(
              displayDate,
              style: TextStyle(
                color: state.expiryDate != null ? Colors.white : Colors.grey,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            Icon(
              Icons.calendar_month_outlined,
              color: Colors.white.withValues(alpha: 0.3),
              size: 24,
            ),
          ],
        ),
      ),
    );
  }
}
