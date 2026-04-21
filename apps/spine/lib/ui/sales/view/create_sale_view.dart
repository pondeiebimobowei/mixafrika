import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/data/repositories/inventory/inventory_repository.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/sales/state/create_sale_state.dart';
import 'package:spine/ui/sales/view/customer_selection_sheet.dart';
import 'package:spine/ui/sales/view_model/create_sale_view_model.dart';
import 'package:spine/ui/sales/widget/sale_calculator_sheet.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';
import 'package:spine/widget/icon_widget.dart';

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
            IconWidget(
              icon: Icons.arrow_back_ios_new_rounded,
              size: 18,
              onTap: () => context.pop(),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Create Sale',
                  style: TextStyle(
                    fontSize: 22,
                    color: colors.primaryForeground,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                  ),
                ),
                Text(
                  'Transaction setup',
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
            Column(
              children: [
                // Unified Search Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                  child: GestureDetector(
                    onTap: () => _showSearchSheet(context, ref),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 18,
                        vertical: 14,
                      ),
                      decoration: BoxDecoration(
                        color: colors.secondaryForeground.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: colors.primary.withValues(alpha: 0.05),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.search_rounded,
                            color: colors.primary.withValues(alpha: 0.6),
                            size: 22,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Search products...',
                              style: TextStyle(
                                color: colors.mutedForeground,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Premium Quick Picks
                if (state.quickPicks.isNotEmpty) ...[
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      children: [
                        Text(
                          'QUICK ADD',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.5,
                            color: colors.primary.withValues(alpha: 0.7),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(child: Divider(color: colors.primary.withValues(alpha: 0.1))),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 120,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: state.quickPicks.length,
                      itemBuilder: (context, index) {
                        final product = state.quickPicks[index];
                        return GestureDetector(
                          onTap: () => viewModel.addToCart(product),
                          child: Container(
                            width: 110,
                            margin: const EdgeInsets.only(right: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  colors.secondaryForeground.withValues(alpha: 0.8),
                                  colors.secondaryForeground.withValues(alpha: 0.4),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: colors.primary.withValues(alpha: 0.08),
                              ),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.add_circle_outline_rounded,
                                  color: colors.primary.withValues(alpha: 0.4),
                                  size: 20,
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  product.name,
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: colors.primaryForeground,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 32),
                ],

                  // Translucent Cart Header
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      children: [
                        Text(
                          'CART',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.5,
                            color: colors.primary.withValues(alpha: 0.7),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: colors.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            state.cartItems.length.toString(),
                            style: TextStyle(
                              color: colors.primary,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                        const Spacer(),
                        if (state.cartItems.isNotEmpty)
                          GestureDetector(
                            // onTap: () => viewModel.clearCart(),
                            child: Text(
                              'Clear All',
                              style: TextStyle(
                                color: colors.destructive.withValues(alpha: 0.6),
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Cart Items
                  Expanded(
                    child: state.cartItems.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Opacity(
                                  opacity: 0.2,
                                  child: Icon(
                                    Icons.shopping_bag_rounded,
                                    size: 80,
                                    color: colors.primary,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'Your basket is empty',
                                  style: TextStyle(
                                    color: colors.mutedForeground,
                                    fontWeight: FontWeight.w500,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            itemCount: state.cartItems.length,
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            itemBuilder: (context, index) {
                              final item = state.cartItems[index];
                              return Dismissible(
                                key: UniqueKey(),
                                direction: DismissDirection.endToStart,
                                background: Container(
                                  alignment: Alignment.centerRight,
                                  padding: const EdgeInsets.only(right: 24),
                                  margin: const EdgeInsets.only(bottom: 12),
                                  decoration: BoxDecoration(
                                    color: colors.destructive.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(24),
                                  ),
                                  child: Icon(Icons.delete_sweep_rounded, color: colors.destructive),
                                ),
                                onDismissed: (_) => viewModel.removeFromCart(item.id),
                                child: _buildCartItem(item, viewModel, colors),
                              );
                            },
                          ),
                  ),

                  const SizedBox(height: 120), // Spacing for Dock
                ],
              ),

              // --- FLOATING ACTION DOCK ---
              Positioned(
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
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Customer Selection Row
                      GestureDetector(
                        onTap: () => _showCustomerSelection(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          decoration: BoxDecoration(
                            border: Border(
                              bottom: BorderSide(
                                color: colors.primary.withValues(alpha: 0.05),
                              ),
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                state.selectedCustomer != null 
                                  ? Icons.person_rounded 
                                  : Icons.person_add_rounded,
                                size: 18,
                                color: state.selectedCustomer != null 
                                  ? colors.primary 
                                  : colors.mutedForeground,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  state.selectedCustomer?.name ?? 'Select Customer (Optional)',
                                  style: TextStyle(
                                    color: state.selectedCustomer != null 
                                      ? colors.primaryForeground 
                                      : colors.mutedForeground,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              Icon(
                                Icons.chevron_right_rounded,
                                size: 18,
                                color: colors.mutedForeground.withValues(alpha: 0.5),
                              ),
                            ],
                          ),
                        ),
                      ),
                      
                      // Totals and Checkout Row
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 16, 12, 16),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'TOTAL',
                                    style: TextStyle(
                                      color: colors.primary.withValues(alpha: 0.7),
                                      fontSize: 9,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '₦${state.grandTotal}',
                                    style: TextStyle(
                                      color: colors.primaryForeground,
                                      fontSize: 24,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: -1,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            FButton(
                              // size: FButtonSize.large,
                              onPress: state.cartItems.isEmpty
                                  ? null
                                  : () => _showCheckoutSheet(context, ref),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Text('Checkout'),
                                  const SizedBox(width: 12),
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: Colors.black26,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.arrow_forward_ios_rounded,
                                      size: 12,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Calculator FAB (Minimized/Repositioned)
              Positioned(
                bottom: 150,
                right: 24,
                child: GestureDetector(
                  onTap: () => _showCalculatorSheet(context, viewModel),
                  child: Container(
                    height: 50,
                    width: 50,
                    decoration: BoxDecoration(
                      color: colors.secondaryForeground,
                      shape: BoxShape.circle,
                      border: Border.all(color: colors.primary.withValues(alpha: 0.15)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Icon(
                      Icons.calculate_rounded,
                      color: colors.primary,
                      size: 22,
                    ),
                  ),
                ),
              )          ],
        ),
      ),
    );
  }

  void _showCustomerSelection(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const CustomerSelectionSheet(),
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
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: colors.primary.withValues(alpha: 0.05),
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  isManual ? Icons.calculate_rounded : Icons.inventory_2_rounded,
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
                      isManual ? item.manualName! : item.product!.name,
                      style: TextStyle(
                        color: colors.primaryForeground,
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      isManual
                          ? 'Manual Entry'
                          : '${item.unit == SaleUnit.piece ? item.product!.pieceUnitName : item.product!.bulkUnitName} • ₦${item.unitPrice}',
                      style: TextStyle(
                        color: colors.primaryForeground.withValues(alpha: 0.4),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '₦${item.total}',
                style: TextStyle(
                  color: colors.primary,
                  fontWeight: FontWeight.w900,
                  fontSize: 18,
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
          if (!isManual) ...[
            const SizedBox(height: 20),
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
                      colors: colors,
                    ),
                    const SizedBox(width: 8),
                    _buildUnitToggle(
                      label: item.product!.bulkUnitName,
                      isSelected: item.unit == SaleUnit.bulk,
                      onTap: () => viewModel.toggleUnit(item.product!.id),
                      colors: colors,
                    ),
                  ],
                ),

                // Quantity Controls
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: colors.background,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      _buildQuantityButton(
                        icon: Icons.remove_rounded,
                        onTap: () {
                          if (item.quantity > 1) {
                            viewModel.updateQuantity(item.product!.id, item.quantity - 1);
                          }
                        },
                        colors: colors,
                      ),
                      const SizedBox(width: 16),
                      Text(
                        item.quantity.toString(),
                        style: TextStyle(
                          color: colors.primaryForeground,
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(width: 16),
                      _buildQuantityButton(
                        icon: Icons.add_rounded,
                        onTap: () => viewModel.updateQuantity(item.product!.id, item.quantity + 1),
                        colors: colors,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildQuantityButton({
    required IconData icon,
    required VoidCallback onTap,
    required FColors colors,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 32,
        width: 32,
        decoration: BoxDecoration(
          color: colors.secondaryForeground,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, size: 16, color: colors.primaryForeground),
      ),
    );
  }

  Widget _buildUnitToggle({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
    required FColors colors,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? colors.primary : colors.secondaryForeground.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? colors.primary : colors.primary.withValues(alpha: 0.1),
          ),
        ),
        child: Text(
          label.toUpperCase(),
          style: TextStyle(
            color: isSelected ? Colors.black : colors.primaryForeground,
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }

  void _showManualQuantityInput(
    BuildContext context,
    CartItem item,
    CreateSaleViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    final controller = TextEditingController(text: item.quantity.toString());
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: colors.secondaryForeground,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
        title: Text(
          'Update Quantity',
          style: TextStyle(
            color: colors.primaryForeground,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.5,
          ),
        ),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          style: TextStyle(color: colors.primaryForeground, fontWeight: FontWeight.w700),
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Enter quantity',
            hintStyle: TextStyle(color: colors.mutedForeground),
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: colors.primary.withValues(alpha: 0.2)),
            ),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: colors.primary, width: 2),
            ),
          ),
        ),
        actions: [
          FButton(
            variant: FButtonVariant.ghost,
            onPress: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FButton(
            onPress: () {
              final val = double.tryParse(controller.text);
              if (val != null && val > 0 && item.product != null) {
                viewModel.updateQuantity(item.product!.id, val.toInt());
              }
              Navigator.pop(context);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showSearchSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
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
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: colors.background,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(36)),
        border: Border.all(color: colors.primary.withValues(alpha: 0.1)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(bottom: 24),
            decoration: BoxDecoration(
              color: colors.primaryForeground.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Search Products',
                    style: TextStyle(
                      color: colors.primaryForeground,
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                    ),
                  ),
                  Text(
                    'Find items to add to cart',
                    style: TextStyle(
                      fontSize: 12,
                      color: colors.primaryForeground.withValues(alpha: 0.4),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              IconWidget(
                icon: Icons.close_rounded,
                onTap: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _searchController,
            onChanged: _onSearchChanged,
            style: TextStyle(color: colors.primaryForeground, fontWeight: FontWeight.w700),
            decoration: InputDecoration(
              hintText: 'Type product name...',
              hintStyle: TextStyle(color: colors.mutedForeground),
              prefixIcon: Icon(Icons.search_rounded, color: colors.primary),
              filled: true,
              fillColor: colors.secondaryForeground.withValues(alpha: 0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
                // borderSide: Border.all(color: colors.primary, width: 2),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: _searchResults.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off_rounded, size: 48, color: colors.primary.withValues(alpha: 0.2)),
                        const SizedBox(height: 16),
                        Text(
                          'No products found',
                          style: TextStyle(color: colors.mutedForeground, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: _searchResults.length,
                    itemBuilder: (context, index) {
                      final product = _searchResults[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: colors.secondaryForeground.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          leading: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: colors.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(Icons.inventory_2_rounded, color: colors.primary, size: 22),
                          ),
                          title: Text(
                            product.name,
                            style: TextStyle(
                              color: colors.primaryForeground,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          subtitle: Text(
                            '₦${product.sellingPricePerPiece}',
                            style: TextStyle(color: colors.primary, fontWeight: FontWeight.w900),
                          ),
                          trailing: Icon(Icons.add_circle_outline_rounded, color: colors.primary),
                          onTap: () {
                            widget.ref
                                .read(createSaleViewModelProvider.notifier)
                                .addToCart(product);
                            Navigator.pop(context);
                          },
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
