import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/sales/state/create_sale_state.dart';
import 'package:spine/ui/sales/view_model/create_sale_view_model.dart';
import 'package:spine/ui/sales/widget/sale_calculator_sheet.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class CreateSaleView extends ConsumerStatefulWidget {
  const CreateSaleView({super.key});

  @override
  ConsumerState<CreateSaleView> createState() => _CreateSaleViewState();
}

class _CreateSaleViewState extends ConsumerState<CreateSaleView> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(createSaleViewModelProvider);
    final viewModel = ref.read(createSaleViewModelProvider.notifier);
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const Icon(
                Icons.arrow_back,
                size: 24,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 20),
            Text(
              'Create Sale',
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
        child: Material(
          color: Colors.transparent,
          child: Stack(
            children: [
              Column(
                children: [
                  // Search Bar
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: GestureDetector(
                      onTap: () => _showSearchSheet(context, ref),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.search, color: colors.mutedForeground),
                            const SizedBox(width: 12),
                            Text(
                              'Search products...',
                              style: TextStyle(color: colors.mutedForeground),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Quick Picks
                  // if (state.quickPicks.isNotEmpty) ...[
                  //   const Padding(
                  //     padding: EdgeInsets.symmetric(horizontal: 16),
                  //     child: Text(
                  //       'Quick Picks',
                  //       style: TextStyle(
                  //         color: Colors.white,
                  //         fontSize: 14,
                  //         fontWeight: FontWeight.bold,
                  //       ),
                  //     ),
                  //   ),
                  //   const SizedBox(height: 12),
                  //   SizedBox(
                  //     height: 100,
                  //     child: ListView.builder(
                  //       scrollDirection: Axis.horizontal,
                  //       padding: const EdgeInsets.symmetric(horizontal: 16),
                  //       itemCount: state.quickPicks.length,
                  //       itemBuilder: (context, index) {
                  //         final product = state.quickPicks[index];
                  //         return GestureDetector(
                  //           onTap: () => viewModel.addToCart(product),
                  //           child: Container(
                  //             width: 80,
                  //             margin: const EdgeInsets.only(right: 12),
                  //             decoration: BoxDecoration(
                  //               color: const Color(0xFF0F172A),
                  //               borderRadius: BorderRadius.circular(16),
                  //               border: Border.all(
                  //                 color: Colors.white.withValues(alpha: 0.05),
                  //               ),
                  //             ),
                  //             child: Column(
                  //               mainAxisAlignment: MainAxisAlignment.center,
                  //               children: [
                  //                 const Icon(
                  //                   Icons.inventory_2,
                  //                   color: Color(0xFF1DB978),
                  //                   size: 24,
                  //                 ),
                  //                 const SizedBox(height: 8),
                  //                 Padding(
                  //                   padding: const EdgeInsets.symmetric(
                  //                     horizontal: 4,
                  //                   ),
                  //                   child: Text(
                  //                     product.name,
                  //                     textAlign: TextAlign.center,
                  //                     maxLines: 2,
                  //                     overflow: TextOverflow.ellipsis,
                  //                     style: const TextStyle(
                  //                       color: Colors.white,
                  //                       fontSize: 10,
                  //                     ),
                  //                   ),
                  //                 ),
                  //               ],
                  //             ),
                  //           ),
                  //         );
                  //       },
                  //     ),
                  //   ),
                  //   const SizedBox(height: 24),
                  // ],

                  // Cart Label
                  const SizedBox(height: 24),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        Text(
                          'Cart Items (${state.cartItems.length})',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Cart Items
                  Expanded(
                    child: state.cartItems.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.shopping_cart_outlined,
                                  size: 64,
                                  color: colors.mutedForeground,
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'Cart is empty',
                                  style: TextStyle(
                                    color: colors.mutedForeground,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            itemCount: state.cartItems.length,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemBuilder: (context, index) {
                              final item = state.cartItems[index];
                              return Dismissible(
                                key: UniqueKey(),
                                direction: DismissDirection.endToStart,
                                background: Container(
                                  alignment: Alignment.centerRight,
                                  padding: const EdgeInsets.only(right: 20),
                                  decoration: BoxDecoration(
                                    color: colors.destructive,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(
                                    Icons.delete,
                                    color: Colors.white,
                                  ),
                                ),
                                onDismissed: (_) {
                                  viewModel.removeFromCart(item.id);
                                },
                                child: _buildCartItem(item, viewModel, colors),
                              );
                            },
                          ),
                  ),

                  // Bottom Bar
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(32),
                      ),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Total',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              '₦${state.grandTotal}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          width: double.infinity,
                          child: FButton(
                            onPress: state.cartItems.isEmpty
                                ? null
                                : () => _showCheckoutSheet(context, ref),
                            child: const Text('Checkout'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Positioned(
                bottom: 160,
                right: 16,
                child: GestureDetector(
                  onTap: () => _showCalculatorSheet(context, viewModel),
                  child: Container(
                    height: 56,
                    width: 56,
                    decoration: BoxDecoration(
                      color: colors.primary,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: colors.primary.withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.calculate_outlined,
                      color: Colors.white,
                      size: 28,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCartItem(
    CartItem item,
    CreateSaleViewModel viewModel,
    FColors colors,
  ) {
    final bool isManual = item.product == null;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isManual ? item.manualName! : item.product!.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      isManual
                          ? 'Manual Charge'
                          : '₦${item.unitPrice} / ${item.unit == SaleUnit.piece ? item.product!.pieceUnitName : item.product!.bulkUnitName}',
                      style: TextStyle(
                        color: colors.mutedForeground,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '₦${item.total.toStringAsFixed(2)}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          if (!isManual) ...[
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Unit Switch
                Row(
                  children: [
                    _buildUnitToggle(
                      label: item.product!.pieceUnitName,
                      isSelected: item.unit == SaleUnit.piece,
                      onTap: () => viewModel.toggleUnit(item.product!.id),
                    ),
                    const SizedBox(width: 8),
                    _buildUnitToggle(
                      label: item.product!.bulkUnitName,
                      isSelected: item.unit == SaleUnit.bulk,
                      onTap: () => viewModel.toggleUnit(item.product!.id),
                    ),
                  ],
                ),

                // Quantity Controls
                Row(
                  children: [
                    _buildCircleButton(
                      icon: Icons.remove,
                      onTap: () {
                        if (item.quantity > 1) {
                          viewModel.updateQuantity(
                            item.product!.id,
                            item.quantity - 1,
                          );
                        }
                      },
                    ),
                    const SizedBox(width: 12),
                    GestureDetector(
                      onTap: () =>
                          _showManualQuantityInput(context, item, viewModel),
                      child: Text(
                        item.quantity.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    _buildCircleButton(
                      icon: Icons.add,
                      onTap: () => viewModel.updateQuantity(
                        item.product!.id,
                        item.quantity + 1,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildUnitToggle({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1DB978) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected
                ? Colors.transparent
                : Colors.white.withValues(alpha: 0.2),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.black : Colors.white,
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildCircleButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
        ),
        child: Icon(icon, color: Colors.white, size: 16),
      ),
    );
  }

  void _showManualQuantityInput(
    BuildContext context,
    CartItem item,
    CreateSaleViewModel viewModel,
  ) {
    final controller = TextEditingController(text: item.quantity.toString());
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        title: const Text(
          'Update Quantity',
          style: TextStyle(color: Colors.white),
        ),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          style: const TextStyle(color: Colors.white),
          autofocus: true,
          decoration: const InputDecoration(
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white24),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              final val = double.tryParse(controller.text);
              if (val != null && val > 0 && item.product != null) {
                viewModel.updateQuantity(item.product!.id, val.toInt());
              }
              Navigator.pop(context);
            },
            child: const Text('Updates'),
          ),
        ],
      ),
    );
  }

  void _showSearchSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      builder: (context) => _SearchSheet(ref: ref),
    );
  }

  void _showCheckoutSheet(BuildContext context, WidgetRef ref) {
    context.push(Routes.checkout);
  }

  void _showCalculatorSheet(
    BuildContext context,
    CreateSaleViewModel viewModel,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => SaleCalculatorSheet(
        onAdd: (amount, name) => viewModel.addManualCharge(amount, name),
      ),
    );
  }
}

class _SearchSheet extends ConsumerStatefulWidget {
  final WidgetRef ref;
  const _SearchSheet({required this.ref});

  @override
  ConsumerState<_SearchSheet> createState() => _SearchSheetState();
}

class _SearchSheetState extends ConsumerState<_SearchSheet> {
  final TextEditingController _searchController = TextEditingController();
  List<ProductData> _searchResults = [];

  @override
  void initState() {
    super.initState();
    _loadAllProducts();
  }

  Future<void> _loadAllProducts() async {
    final activeBranch = ref.read(activeBranchProvider);
    final inventoryProvider = await ref
        .read(inventoryRepositoryProvider)
        .getInventoryItems(activeBranch?.id ?? '');
    setState(
      () => _searchResults = inventoryProvider.map((e) => e.product).toList(),
    );
  }

  void _onSearchChanged(String query) async {
    final activeBranch = ref.read(activeBranchProvider);
    final inventoryProvider = await ref
        .read(inventoryRepositoryProvider)
        .getInventoryItems(activeBranch?.id ?? '');
    final products = inventoryProvider.map((e) => e.product).toList();

    setState(() {
      _searchResults = products
          .where((p) => p.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Search Products',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close, color: Colors.white24),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _searchController,
            onChanged: _onSearchChanged,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Type product name...',
              hintStyle: TextStyle(color: colors.mutedForeground),
              prefixIcon: Icon(Icons.search, color: colors.mutedForeground),
              filled: true,
              fillColor: const Color(0xFF1E293B),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Expanded(
            child: ListView.builder(
              itemCount: _searchResults.length,
              itemBuilder: (context, index) {
                final product = _searchResults[index];
                return ListTile(
                  title: Text(
                    product.name,
                    style: const TextStyle(color: Colors.white),
                  ),
                  subtitle: Text(
                    '₦${product.sellingPricePerPiece}',
                    style: TextStyle(color: colors.mutedForeground),
                  ),
                  onTap: () {
                    widget.ref
                        .read(createSaleViewModelProvider.notifier)
                        .addToCart(product);
                    Navigator.pop(context);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
