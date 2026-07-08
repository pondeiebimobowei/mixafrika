import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/inventory/state/add_product_state.dart';
import 'package:spine/ui/inventory/view_model/add_product_view_model.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/widget/toast_widget.dart';
import 'package:spine/widget/spinner_widget.dart';

class AddProductView extends ConsumerWidget {
  const AddProductView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(addProductViewModelProvider);
    final viewModel = ref.read(addProductViewModelProvider.notifier);
    final FColors colors = context.theme.colors;

    // Handle Success Navigation and Toaster in a listener if needed
    ref.listen(addProductViewModelProvider, (previous, next) {
      if (next.isSuccess && (previous == null || !previous.isSuccess)) {
        ref.invalidate(inventoryViewModelProvider);
        ToastWidget.makeToast(
          context: context,
          title: 'Product created successfully',
          icon: FLucideIcons.circleCheck,
        );
        context.go(Routes.dashboard); // Go back to inventory
      }
      if (next.errorMessage != null &&
          (previous == null || previous.errorMessage != next.errorMessage)) {
        ToastWidget.makeToast(
          context: context,
          title: next.errorMessage ?? 'Failed to create product',
          icon: FLucideIcons.circleX,
        );
      }
    });

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            IconWidget(
              icon: Icons.arrow_back_ios_new_rounded,
              size: 18,
              onTap: () => context.go(Routes.inventory),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'New Product',
                  style: TextStyle(
                    fontSize: 22,
                    color: colors.primaryForeground,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                  ),
                ),
                Text(
                  'Catalog expansion',
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
        child: Stack(
          children: [
            _buildContent(context, viewModel, state),
            _buildBottomDock(context, state, viewModel),
          ],
        ),
      ),
    );
  }

  Widget _buildContent(
    BuildContext context,
    AddProductViewModel viewModel,
    AddProductState state,
  ) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          _buildGlassCard(
            context,
            'BASIC INFORMATION',
            Column(
              children: [
                FTextField(
                  control: .managed(
                    onChange: (value) => viewModel.updateName(value.text),
                  ),
                  label: const Text('Item Name'),
                  hint: 'e.g. Bananas',
                ),
                const SizedBox(height: 24),
                FTextField(
                  control: .managed(
                    onChange: (value) => viewModel.updateBarcode(value.text),
                  ),
                  label: const Text('Barcode / Serial Number'),
                  hint: 'Optional Barcode',
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildUnitConversionSetup(context, viewModel, state),
          const SizedBox(height: 24),
          _buildFinancialsSection(context, viewModel, state),
          const SizedBox(height: 140), // Spacing for Dock
        ],
      ),
    );
  }

  Widget _buildGlassCard(BuildContext context, String title, Widget child) {
    final colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: colors.primary.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  color: colors.primary.withValues(alpha: 0.7),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Divider(color: colors.primary.withValues(alpha: 0.05)),
              ),
            ],
          ),
          const SizedBox(height: 24),
          child,
        ],
      ),
    );
  }

  Widget _buildFinancialsSection(
    BuildContext context,
    AddProductViewModel viewModel,
    AddProductState state,
  ) {
    return _buildGlassCard(
      context,
      'PRICING',
      Row(
        children: [
          Expanded(
            child: FTextFormField(
              control: .managed(
                onChange: (value) =>
                    viewModel.updateSellPricePerUnit(value.text),
              ),
              label: Text(
                'Unit Price (${state.pieceUnit.isEmpty ? 'Item' : state.pieceUnit})',
              ),
              hint: '₦',
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: FTextFormField(
              control: .managed(
                onChange: (value) =>
                    viewModel.updateSellPricePerBulk(value.text),
              ),
              label: Text(
                'Bulk Price (${state.bulkUnit.isEmpty ? 'Bulk' : state.bulkUnit})',
              ),
              hint: '₦',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomDock(
    BuildContext context,
    AddProductState state,
    AddProductViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    return Positioned(
      left: 16,
      right: 16,
      bottom: 30,
      child: Container(
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
        child: FButton(
          onPress: state.isLoading ? null : () => viewModel.submitProduct(),
          child: state.isLoading
              ? SpinnerWidget.spinner()
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Save Product'),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Colors.black26,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.check_rounded,
                        size: 14,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildActionButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildCircularButton(Icons.mic_none, 'VOICE ENTRY'),
        const SizedBox(width: 24),
        _buildCircularButton(Icons.qr_code_scanner, 'SCAN ITEM'),
      ],
    );
  }

  Widget _buildCircularButton(IconData icon, String label) {
    return FCard(
      style: FCardStyleDelta.delta(
        contentStyle: FCardContentStyleDelta.delta(
          imageSpacing: 10,
          // padding: const .all(24),
        ),
        // decoration: BoxDecorationDelta.delta(
        //   borderRadius: BorderRadius.all(.circular(80)),
        // ),
      ),
      image: Icon(icon, size: 32),
      // title: Text(label),
      child: Text(
        label,
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
    // return Column(
    //   children: [
    //     Container(
    //       width: 80,
    //       height: 80,
    //       decoration: BoxDecoration(
    //         color: const Color(0xFF1E293B),
    //         shape: BoxShape.circle,
    //       ),
    //       child: Icon(icon, color: Colors.grey[500], size: 32),
    //     ),
    //     const SizedBox(height: 12),
    //     Text(
    //       label,
    //       style: TextStyle(
    //         fontSize: 10,
    //         color: Colors.grey[500],
    //         fontWeight: FontWeight.bold,
    //       ),
    //     ),
    //   ],
    // );
  }

  Widget _buildUnitConversionSetup(
    BuildContext context,
    AddProductViewModel viewModel,
    AddProductState state,
  ) {
    final colors = context.theme.colors;
    return _buildGlassCard(
      context,
      'UNIT LOGIC',
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: _buildDropdownField(
                  'Bulk Unit',
                  ['Bunch', 'Carton', 'Box', 'Pack', 'Sack'],
                  viewModel.updateBulkUnit,
                  label: Text(
                    'Major Unit',
                    style: TextStyle(color: colors.primaryForeground),
                  ),
                  value: state.bulkUnit.isEmpty ? null : state.bulkUnit,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildDropdownField(
                  'Retail Unit',
                  ['Piece', 'Item', 'Finger', 'Bottle', 'Sachet'],
                  viewModel.updatePieceUnit,
                  label: Text(
                    'Minor Unit',
                    style: TextStyle(color: colors.primaryForeground),
                  ),
                  value: state.pieceUnit.isEmpty ? null : state.pieceUnit,
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          // Blueprint representation
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: colors.background,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: colors.primary.withValues(alpha: 0.05)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildBlueprintUnit(
                      context,
                      '1',
                      state.bulkUnit.isEmpty
                          ? 'BULK'
                          : state.bulkUnit.toUpperCase(),
                      isHighLighted: true,
                    ),
                    const SizedBox(width: 16),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: colors.primary.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '=',
                        style: TextStyle(
                          color: colors.primary,
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        children: [
                          TextField(
                            onChanged: viewModel.updateConversionFactor,
                            keyboardType: TextInputType.number,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: colors.primary,
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -1,
                            ),
                            decoration: InputDecoration(
                              hintText: '12',
                              hintStyle: TextStyle(
                                color: colors.primary.withValues(alpha: 0.3),
                              ),
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(
                                vertical: 8,
                              ),
                              border: UnderlineInputBorder(
                                borderSide: BorderSide(
                                  color: colors.primary.withValues(alpha: 0.2),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            state.pieceUnit.isEmpty
                                ? 'RETAIL UNITS'
                                : state.pieceUnit.toUpperCase() + 'S',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1,
                              color: colors.primaryForeground.withValues(
                                alpha: 0.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  'This tells us how many pieces make a bulk unit for inventory tracking.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 10,
                    color: colors.primaryForeground.withValues(alpha: 0.3),
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBlueprintUnit(
    BuildContext context,
    String value,
    String label, {
    bool isHighLighted = false,
  }) {
    final colors = context.theme.colors;
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: isHighLighted ? colors.primaryForeground : colors.primary,
            letterSpacing: -1,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.w900,
            letterSpacing: 1,
            color: colors.primaryForeground.withValues(alpha: 0.4),
          ),
        ),
      ],
    );
  }

  Widget _buildDropdownField(
    String hint,
    List<String> items,
    Function(String) onChanged, {
    Widget? label,
    String? value,
  }) {
    return FSelect<String>.rich(
      format: (value) => value,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      validator: (v) {
        return null;
      },

      label: label,
      control: FSelectControl.managed(
        onChange: (val) => onChanged(val.toString()),
      ),
      children: [
        for (final item in items) FSelectItem(value: item, title: Text(item)),
      ],
    );
  }
}
