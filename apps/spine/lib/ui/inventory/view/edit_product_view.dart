import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/ui/inventory/view_model/edit_product_view_model.dart';
import 'package:spine/widget/toast_widget.dart';

class EditProductView extends ConsumerStatefulWidget {
  final String productId;
  const EditProductView({super.key, required this.productId});

  @override
  ConsumerState<EditProductView> createState() => _EditProductViewState();
}

class _EditProductViewState extends ConsumerState<EditProductView> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late TextEditingController _bulkUnitController;
  late TextEditingController _unitsPerBulkController;
  late TextEditingController _costPriceController;
  late TextEditingController _sellingPriceController;
  late TextEditingController _serialNumberController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _descriptionController = TextEditingController();
    _bulkUnitController = TextEditingController();
    _unitsPerBulkController = TextEditingController();
    _costPriceController = TextEditingController();
    _sellingPriceController = TextEditingController();
    _serialNumberController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _bulkUnitController.dispose();
    _unitsPerBulkController.dispose();
    _costPriceController.dispose();
    _sellingPriceController.dispose();
    _serialNumberController.dispose();
    super.dispose();
  }

  bool _initialized = false;

  void _initializeControllers(dynamic state) {
    if (!_initialized && !state.isLoading && state.value!.initialProduct != null) {
      _nameController.text = state.value!.name;
      _descriptionController.text = state.value!.description;
      _bulkUnitController.text = state.value!.bulkUnit;
      _unitsPerBulkController.text = state.value!.unitsPerBulk;
      _costPriceController.text = state.value!.bulkCostPrice;
      _sellingPriceController.text = state.value!.pieceSellingPrice;
      _serialNumberController.text = state.value!.serialNumber;
      _initialized = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(editProductViewModelProvider(widget.productId));
    final viewModel = ref.read(
      editProductViewModelProvider(widget.productId).notifier,
    );
    final colors = context.theme.colors;

    _initializeControllers(state);

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const Icon(Icons.close, size: 24, color: Colors.white),
            ),
            const SizedBox(width: 20),
            Text(
              'Edit Product',
              style: TextStyle(
                fontSize: 20,
                color: colors.primaryForeground,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: state.isLoading
            ? const Center(child: CircularProgressIndicator())
            : Stack(
                children: [
                  SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 24,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildLabel('ITEM NAME'),
                        const SizedBox(height: 8),
                        _buildTextField(
                          controller: _nameController,
                          hint: 'e.g. Bananas',
                          onChanged: viewModel.updateName,
                        ),
                        const SizedBox(height: 24),

                        _buildLabel('DESCRIPTION'),
                        const SizedBox(height: 8),
                        _buildTextField(
                          controller: _descriptionController,
                          hint: 'Product description',
                          onChanged: viewModel.updateDescription,
                        ),
                        const SizedBox(height: 24),

                        _buildLabel('BARCODE / SERIAL NUMBER'),
                        const SizedBox(height: 8),
                        _buildTextField(
                          controller: _serialNumberController,
                          hint: 'Optional Barcode',
                          prefixIcon: Icons.qr_code_scanner,
                          onChanged: viewModel.updateSerialNumber,
                        ),
                        const SizedBox(height: 24),

                        _buildUnitSetup(context, viewModel, state),
                        const SizedBox(height: 24),

                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildLabel('COST PRICE'),
                                  const SizedBox(height: 8),
                                  _buildTextField(
                                    controller: _costPriceController,
                                    hint: '₦',
                                    onChanged: viewModel.updateBulkCostPrice,
                                    keyboardType: TextInputType.number,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildLabel('SELL PRICE'),
                                  const SizedBox(height: 8),
                                  _buildTextField(
                                    controller: _sellingPriceController,
                                    hint: '₦',
                                    onChanged:
                                        viewModel.updatePieceSellingPrice,
                                    keyboardType: TextInputType.number,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      color: colors.background,
                      child: SizedBox(
                        width: double.infinity,
                        child: FButton(
                          onPress: state.value!.isSubmitting
                              ? null
                              : () async {
                                  final router = GoRouter.of(context);
                                  final success = await viewModel.submit();
                                  if (success && mounted) {
                                    ToastWidget.makeToast(
                                      context: context, 
                                      description: 'Product updated successfully', 
                                      icon: FIcons.circleCheck, 
                                      color: Colors.green
                                    );
                                    router.pop();
                                  } else if (mounted) {
                                    ToastWidget.makeToast(
                                      context: context, 
                                      description: 'Failed to update product', 
                                      icon: FIcons.circleX, 
                                      color: Colors.red
                                    );
                                  }
                                },
                          child: state.value!.isSubmitting
                              ? const CircularProgressIndicator(
                                  color: Colors.white,
                                )
                              : Text(
                                  'Update Product',
                                  style: TextStyle(
                                    color: colors.primaryForeground,
                                    fontWeight: FontWeight.bold,
                                  ),
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

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.grey[400],
        letterSpacing: 1.0,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    IconData? prefixIcon,
    required Function(String) onChanged,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        controller: controller,
        onChanged: onChanged,
        keyboardType: keyboardType,
        style: const TextStyle(color: Colors.white, fontSize: 16),
        decoration: InputDecoration(
          prefixIcon: prefixIcon != null
              ? Icon(prefixIcon, color: Colors.grey[500])
              : null,
          hintText: hint,
          hintStyle: TextStyle(
            color: Colors.grey[500],
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),
        ),
      ),
    );
  }

  Widget _buildUnitSetup(
    BuildContext context,
    EditProductViewModel viewModel,
    dynamic state,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildLabel('UNIT CONFIGURATION'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('BULK UNIT'),
                    const SizedBox(height: 8),
                    _buildTextField(
                      controller: _bulkUnitController,
                      hint: 'e.g. Carton',
                      onChanged: viewModel.updateBulkUnit,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('UNIT COUNT'),
                    const SizedBox(height: 8),
                    _buildTextField(
                      controller: _unitsPerBulkController,
                      hint: '12',
                      onChanged: viewModel.updateUnitsPerBulk,
                      keyboardType: TextInputType.number,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
