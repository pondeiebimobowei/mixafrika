import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/inventory/state/add_product_state.dart';
import 'package:spine/ui/inventory/view_model/add_product_view_model.dart';
import 'package:spine/ui/inventory/view_model/inventory_view_model.dart';

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
        
        context.go(Routes.dashboard); // Go back to inventory
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
              onTap: () => context.go(Routes.inventory),
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

                  const SizedBox(height: 8),
                  FTextField(
                    control: .managed(
                      onChange: (value) => viewModel.updateName(value.text),
                    ),
                    label: const Text('Item Name'),
                    hint: 'e.g. Bananas',
                  ),
                  const SizedBox(height: 24),

                  const SizedBox(height: 8),
                  FTextField(
                    control: .managed(
                      onChange: (value) => viewModel.updateBarcode(value.text),
                    ),
                    label: const Text('Barcode / Serial Number'),
                    hint: 'Optional Barcode',
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
                            FTextFormField(
                              control: .managed(
                                onChange: (value) => viewModel.updateSellPricePerUnit(value.text),
                              ),
                              label: const Text('Unit Sell Price'),
                              hint: '₦',
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            FTextFormField(
                              control: .managed(
                                onChange: (value) => viewModel.updateSellPricePerBulk(value.text),
                              ),
                              label: const Text('Bulk Sell Price (Optional)'),
                              hint: '₦',
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

    return FCard(
      
      style: FCardStyleDelta.delta(

        contentStyle: FCardContentStyleDelta.delta(
        imageSpacing: 10,
          padding: const .all(24),
          

        ),
        decoration: BoxDecorationDelta.delta(
          borderRadius: BorderRadius.all(.circular(80)),

          
          
        )
      ),
      image: Icon(icon, size: 32, ),
      // title: Text(label),
      child: Text(label, style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),),


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
    final FColors colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: .4),
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
              Text(
                'Unit Conversion Setup',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[400],
                  letterSpacing: 1.0,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // const SizedBox(height: 8),
                    _buildDropdownField(
                      'Bunch',
                      ['Bunch', 'Carton', 'Box'],
                      viewModel.updateBulkUnit,
                      label: Text('Bulk Unit', style: TextStyle(
                        color: colors.primaryForeground,
                        
                      ),),
                      value: state.bulkUnit.isEmpty ? null : state.bulkUnit,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // const SizedBox(height: 8),
                    _buildDropdownField(
                      state.pieceUnit.isEmpty ? 'Finger' : state.pieceUnit,
                      ['Finger', 'Piece', 'Item'],
                      viewModel.updatePieceUnit,
                      label: Text('Retail Unit', style: TextStyle(
                        color: colors.primaryForeground,
                        
                      ),),
                      value: state.pieceUnit.isEmpty ? null : state.pieceUnit,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            decoration: BoxDecoration(
              color: colors.secondaryForeground,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colors.secondaryForeground),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '1 ${state.bulkUnit.isEmpty ? 'BUNCH' : state.bulkUnit.toUpperCase()}',
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
                      state.pieceUnit.isEmpty
                          ? 'FINGER'
                          : state.pieceUnit.toUpperCase(),
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
    Function(String) onChanged, {
    Widget? label,
    String? value,
  }) {
    return FSelect<String>.rich(
        format: (value) => value,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        validator: (v){
          
          return null;
        },
         
        label: label,
        control: FSelectControl.managed(
          onChange: (val) => onChanged(val.toString()),
        ),
        children: [
          for (final item in items)
            FSelectItem(
              value: item,
              title: Text(item),
            ),
        ],
    );
  }
}
