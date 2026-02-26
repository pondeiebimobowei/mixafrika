import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/inventory/view_model/add_product_view_model.dart';

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
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(
        //     content: Text(
        //       'Product added successfully!',
        //       style: TextStyle(color: Colors.white),
        //     ),
        //     backgroundColor: Colors.green,
        //   ),
        // );
        context.go(Routes.inventory); // Go back to inventory
      }
      if (next.errorMessage != null &&
          (previous == null || previous.errorMessage != next.errorMessage)) {
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(
        //     content: Text(
        //       next.errorMessage!,
        //       style: TextStyle(color: Colors.white),
        //     ),
        //     backgroundColor: Colors.redAccent,
        //   ),
        // );
      }
    });

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
              'New Product',
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
        child: Stack(
          children: [
            SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildActionButtons(),
                  const SizedBox(height: 32),

                  _buildLabel('ITEM NAME'),
                  const SizedBox(height: 8),
                  _buildTextField(
                    hint: 'e.g. Bananas',
                    onChanged: viewModel.updateName,
                  ),
                  const SizedBox(height: 24),

                  _buildLabel('BARCODE / SERIAL NUMBER'),
                  const SizedBox(height: 8),
                  _buildTextField(
                    hint: 'Optional Barcode',
                    prefixIcon: Icons.qr_code_scanner,
                    onChanged: viewModel.updateBarcode,
                  ),
                  const SizedBox(height: 24),

                  _buildUnitConversionSetup(context, viewModel, state),
                  const SizedBox(height: 24),

                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildLabel('SELL PRICE / FINGER'),
                            const SizedBox(height: 8),
                            _buildTextField(
                              hint: '₦',
                              onChanged: viewModel.updateSellPricePerRetail,
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
                            _buildLabel('SELL PRICE / BUNCH'),
                            const SizedBox(height: 8),
                            _buildTextField(
                              hint: '₦  Optional',
                              onChanged: viewModel.updateSellPricePerBulk,
                              keyboardType: TextInputType.number,
                              hintColor: Colors.teal,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 100), // spacing for bottom button
                ],
              ),
            ),

            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                padding: const EdgeInsets.all(16),
                color: context.theme.colors.background,
                child: SizedBox(
                  width: double.infinity,
                  child: FButton(
                    onPress: state.isLoading
                        ? null
                        : () => viewModel.submitProduct(),
                    child: state.isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : Text(
                            'Save Product',
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
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: Colors.grey[500], size: 32),
        ),
        const SizedBox(height: 12),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: Colors.grey[500],
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
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
    required String hint,
    IconData? prefixIcon,
    required Function(String) onChanged,
    TextInputType keyboardType = TextInputType.text,
    Color? hintColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        onChanged: onChanged,
        keyboardType: keyboardType,
        style: const TextStyle(color: Colors.white, fontSize: 16),
        decoration: InputDecoration(
          prefixIcon: prefixIcon != null
              ? Icon(prefixIcon, color: Colors.grey[500])
              : null,
          hintText: hint,
          hintStyle: TextStyle(
            color: hintColor ?? Colors.grey[500],
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

  Widget _buildUnitConversionSetup(
    BuildContext context,
    AddProductViewModel viewModel,
    state,
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
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Colors.tealAccent,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              _buildLabel('UNIT CONVERSION SETUP'),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('BULK UNIT'),
                    const SizedBox(height: 8),
                    _buildDropdownField('Bunch', [
                      'Bunch',
                      'Carton',
                      'Box',
                    ], viewModel.updateBulkUnit),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('RETAIL UNIT'),
                    const SizedBox(height: 8),
                    _buildDropdownField('Finger', [
                      'Finger',
                      'Piece',
                      'Item',
                    ], viewModel.updateRetailUnit),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '1 BUNCH',
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.tealAccent.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Text(
                    '=',
                    style: TextStyle(
                      color: Colors.tealAccent,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Column(
                  children: [
                    Container(
                      width: 60,
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: TextField(
                          onChanged: viewModel.updateConversionFactor,
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.tealAccent,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                          decoration: const InputDecoration(
                            hintText: '12',
                            hintStyle: TextStyle(color: Colors.teal),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'FINGER',
                      style: TextStyle(
                        color: Colors.grey[400],
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDropdownField(
    String hint,
    List<String> items,
    Function(String) onChanged,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: null,
          hint: Text(
            hint,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          icon: Icon(Icons.keyboard_arrow_down, color: Colors.grey[400]),
          isExpanded: true,
          dropdownColor: const Color(0xFF1E293B),
          items: items.map((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value, style: const TextStyle(color: Colors.white)),
            );
          }).toList(),
          onChanged: (val) {
            if (val != null) {
              onChanged(val);
            }
          },
        ),
      ),
    );
  }
}
