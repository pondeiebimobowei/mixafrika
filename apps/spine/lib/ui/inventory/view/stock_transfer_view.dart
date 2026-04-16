import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/inventory/state/stock_transfer_state.dart';
import 'package:spine/ui/inventory/view_model/stock_transfer_view_model.dart';
import 'package:spine/widget/icon_widget.dart';

class StockTransferView extends ConsumerStatefulWidget {
  final String productId;
  const StockTransferView({super.key, required this.productId});

  @override
  ConsumerState<StockTransferView> createState() => _StockTransferViewState();
}

class _StockTransferViewState extends ConsumerState<StockTransferView> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(stockTransferViewModelProvider(widget.productId));
    final viewModel = ref.read(
      stockTransferViewModelProvider(widget.productId).notifier,
    );
    final FColors colors = context.theme.colors;

    ref.listen(stockTransferViewModelProvider(widget.productId), (
      previous,
      next,
    ) {
      if (next.isSuccess && (previous == null || !previous.isSuccess)) {
        context.push(
          '${Routes.inventory}/${Routes.productDetails}/${widget.productId}/${Routes.stockTransferSuccess}',
          extra: {
            'productName': next.product?.name ?? 'Product',
            'quantity': next.quantity,
            'destination': next.selectedBranch?.name ?? 'Branch',
          },
        );
      }
      if (next.errorMessage != null &&
          (previous == null || previous.errorMessage != next.errorMessage)) {
        print(next.errorMessage);
      }
    });

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const IconWidget(icon: Icons.arrow_back),
            ),
            const SizedBox(width: 20),
            Text(
              'Stock Movement',
              style: TextStyle(
                fontSize: 20,
                color: colors.primaryForeground,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
      child: state.isLoading && state.product == null
          ? const Center(child: CircularProgressIndicator())
          : Material(
              color: Colors.transparent,
              child: Stack(
                children: [
                  SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 24,
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildTransferHeader(context, state),
                          const SizedBox(height: 32),
                          _buildBranchSelection(context, state, viewModel),
                          const SizedBox(height: 24),
                          _buildQuantityInput(context, state, viewModel),
                          const SizedBox(height: 24),
                          _buildReasonInput(context, viewModel),
                          const SizedBox(height: 100), // Space for button
                        ],
                      ),
                    ),
                  ),
                  _buildBottomButton(context, state, viewModel),
                ],
              ),
            ),
    );
  }

  Widget _buildTransferHeader(BuildContext context, StockTransferState state) {
    final colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: colors.foreground,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildBranchNode(
                context,
                'CURRENT STORE',
                'Main Warehouse',
                Icons.storefront,
              ),
              _buildTransferArrow(context),
              _buildBranchNode(
                context,
                'DESTINATION',
                state.selectedBranch?.name ?? 'Select branch',
                Icons.location_on_outlined,
                isActive: state.selectedBranch != null,
              ),
            ],
          ),
          const SizedBox(height: 24),
          Divider(color: Colors.white.withValues(alpha: 0.05)),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.inventory_2_outlined, color: colors.primary),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      state.product?.name ?? 'Loading...',
                      style: TextStyle(
                        color: colors.primaryForeground,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      'Available: ${state.inventoryItem?.totalRemainingQuantity ?? 0} units',
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
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

  Widget _buildBranchNode(
    BuildContext context,
    String label,
    String name,
    IconData icon, {
    bool isActive = false,
  }) {
    final colors = context.theme.colors;
    return Expanded(
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isActive
                  ? colors.primary.withValues(alpha: 0.1)
                  : colors.secondaryForeground,
              shape: BoxShape.circle,
              border: Border.all(
                color: isActive
                    ? colors.primary
                    : Colors.white.withValues(alpha: 0.05),
              ),
            ),
            child: Icon(
              icon,
              color: isActive ? colors.primary : Colors.grey,
              size: 24,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            name,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: isActive ? colors.primaryForeground : Colors.grey,
              fontSize: 13,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransferArrow(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Icon(
        Icons.arrow_forward,
        color: Colors.white.withValues(alpha: 0.2),
        size: 20,
      ),
    );
  }

  Widget _buildBranchSelection(
    BuildContext context,
    StockTransferState state,
    StockTransferViewModel viewModel,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'CHOOSE DESTINATION',
          style: TextStyle(
            color: Colors.grey,
            fontSize: 11,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        FSelect<BranchData>.rich(
          format: (value) => value.name,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (v) => v == null ? 'Please select a branch' : null,
          hint: 'Select the receiving branch',
          control: FSelectControl.managed(
            onChange: (val) => viewModel.selectBranch(val!),
          ),
          children: state.branches.map<FSelectItem<BranchData>>((branch) {
            return FSelectItem(
              value: branch,
              title: Text(branch.name),
              subtitle: Text('${branch.city}, ${branch.state}'),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildQuantityInput(
    BuildContext context,
    StockTransferState state,
    StockTransferViewModel viewModel,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'AMOUNT TO TRANSFER',
          style: TextStyle(
            color: Colors.grey,
            fontSize: 11,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        FTextField(
          hint: 'Enter quantity',
          keyboardType: TextInputType.number,
          control: FTextFieldControl.managed(
            onChange: (value) => viewModel.updateQuantity(value.text),
          ),
        ),
      ],
    );
  }

  Widget _buildReasonInput(
    BuildContext context,
    StockTransferViewModel viewModel,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'NOTES (OPTIONAL)',
          style: TextStyle(
            color: Colors.grey,
            fontSize: 11,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        FTextField(
          hint: 'Add a reason for this movement',
          maxLines: 3,
          control: FTextFieldControl.managed(
            onChange: (value) => viewModel.updateReason(value.text),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomButton(
    BuildContext context,
    StockTransferState state,
    StockTransferViewModel viewModel,
  ) {
    final colors = context.theme.colors;
    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: colors.background,
          border: Border(
            top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
          ),
        ),
        child: SizedBox(
          width: double.infinity,
          height: 56,
          child: FButton(
            onPress: state.isLoading ? null : () => viewModel.submit(),
            child: state.isLoading
                ? const SizedBox(
                    height: 24,
                    width: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Text(
                    'Initiate Movement',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
          ),
        ),
      ),
    );
  }
}

class StockTransferSuccessView extends StatelessWidget {
  final String productName;
  final String quantity;
  final String destination;

  const StockTransferSuccessView({
    super.key,
    required this.productName,
    required this.quantity,
    required this.destination,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    return Scaffold(
      backgroundColor: colors.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: const Color(0xFF1DB978).withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(
                    Icons.check_circle,
                    color: Color(0xFF1DB978),
                    size: 80,
                  ),
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                'Movement Complete',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 16),
              RichText(
                textAlign: TextAlign.center,
                text: TextSpan(
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 16,
                    height: 1.5,
                  ),
                  children: [
                    const TextSpan(text: 'Successfully moved '),
                    TextSpan(
                      text: '$quantity units',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const TextSpan(text: ' of '),
                    TextSpan(
                      text: productName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const TextSpan(text: ' to '),
                    TextSpan(
                      text: destination,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const TextSpan(text: '.'),
                  ],
                ),
              ),
              const SizedBox(height: 64),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: FButton(
                  onPress: () => context.go(Routes.inventory),
                  child: const Text(
                    'Return to Inventory',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
