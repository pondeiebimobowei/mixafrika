import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/sales/state/create_sale_state.dart';
import 'package:spine/ui/sales/view_model/create_sale_view_model.dart';

class CheckoutView extends ConsumerWidget {
  const CheckoutView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(createSaleViewModelProvider);
    final viewModel = ref.read(createSaleViewModelProvider.notifier);
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const Icon(Icons.arrow_back, color: Colors.white),
            ),
            const SizedBox(width: 16),
            const Text('Confirm Purchase'),
          ],
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'PURCHASE SUMMARY',
                style: TextStyle(
                  color: colors.mutedForeground,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 16),
              FCard(
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: state.cartItems.length,
                  separatorBuilder: (context, index) =>
                      Divider(color: colors.border),
                  itemBuilder: (context, index) {
                    final item = state.cartItems[index];
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.product.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  '${item.quantity} x ₦${item.unitPrice}',
                                  style: TextStyle(
                                    color: colors.mutedForeground,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            '₦${item.total}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Total Amount',
                    style: TextStyle(fontSize: 18, color: Colors.white),
                  ),
                  Text(
                    '₦${state.subtotal}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1DB978),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              Text(
                'SELECT PAYMENT METHOD',
                style: TextStyle(
                  color: colors.mutedForeground,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 2.5,
                ),
                itemCount: PaymentMethod.values.length,
                itemBuilder: (context, index) {
                  final method = PaymentMethod.values[index];
                  final isSelected = state.selectedPaymentMethod == method;
                  return GestureDetector(
                    onTap: () => viewModel.selectPaymentMethod(method),
                    child: Container(
                      decoration: BoxDecoration(
                        color: isSelected
                            ? const Color(0xFF1DB978)
                            : const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(16),
                        border: isSelected
                            ? Border.all(color: Colors.white, width: 2)
                            : null,
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        _getPaymentMethodName(method),
                        style: TextStyle(
                          color: isSelected ? Colors.black : Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 48),
              SizedBox(
                width: double.infinity,
                child: FButton(
                  onPress:
                      state.selectedPaymentMethod == null || state.isLoading
                      ? null
                      : () async {
                          final success = await viewModel.checkout();
                          if (context.mounted) {
                            print('success');
                            print(success);
                            if (success) {
                              context.go(Routes.dashboard);
                            } else {
                            }
                          }
                        },
                  child: state.isLoading
                      ? const CircularProgressIndicator()
                      : const Text('Complete Purchase'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getPaymentMethodName(PaymentMethod method) {
    switch (method) {
      case PaymentMethod.cash:
        return 'CASH';
      case PaymentMethod.transfer:
        return 'TRANSFER';
      case PaymentMethod.mixWallet:
        return 'MIX WALLET';
      case PaymentMethod.payLater:
        return 'PAY LATER';
      case PaymentMethod.multiPay:
        return 'MULTIPAY';
    }
  }
}
