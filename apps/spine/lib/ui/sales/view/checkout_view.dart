import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/sales/state/create_sale_state.dart';
import 'package:spine/ui/sales/view/customer_selection_sheet.dart';
import 'package:spine/ui/sales/view_model/create_sale_view_model.dart';
import 'package:spine/widget/toast_widget.dart';
import 'package:spine/widget/spinner_widget.dart';

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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              Center(
                child: Column(
                  children: [
                    Text(
                      'FINAL TOTAL',
                      style: TextStyle(
                        color: colors.mutedForeground,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '₦${state.grandTotal}',
                      style: const TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'CUSTOMER LINK',
                style: TextStyle(
                  color: colors.mutedForeground,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 16),
              GestureDetector(
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                    builder: (context) => const CustomerSelectionSheet(),
                  );
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: state.selectedCustomer != null
                          ? const Color(0xFF1DB978)
                          : colors.border,
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        state.selectedCustomer != null
                            ? Icons.person
                            : Icons.person_add_outlined,
                        color: state.selectedCustomer != null
                            ? const Color(0xFF1DB978)
                            : colors.mutedForeground,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          state.selectedCustomer?.name ??
                              'Tag a Customer (Optional)',
                          style: TextStyle(
                            color: state.selectedCustomer != null
                                ? Colors.white
                                : colors.mutedForeground,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      if (state.selectedCustomer != null)
                        GestureDetector(
                          onTap: () => viewModel.selectCustomer(null),
                          child: const Icon(
                            Icons.close,
                            color: Colors.redAccent,
                            size: 20,
                          ),
                        )
                      else
                        Icon(
                          Icons.chevron_right,
                          color: colors.mutedForeground,
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),
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
                  childAspectRatio: 1.8,
                ),
                itemCount: PaymentMethodType.values.length,
                itemBuilder: (context, index) {
                  final method = PaymentMethodType.values[index];
                  final isSelected =
                      state.selectedPaymentMethod?.type == method;
                  return GestureDetector(
                    onTap: () => viewModel.selectPaymentMethodType(method),
                    child: Container(
                      decoration: BoxDecoration(
                        color: isSelected
                            ? const Color(0xFF1DB978)
                            : const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      alignment: Alignment.center,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _getPaymentMethodIcon(method, isSelected),
                            color: isSelected
                                ? Colors.white
                                : colors.mutedForeground,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            getPaymentMethodName(method),
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : colors.mutedForeground,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),
              if (state.selectedPaymentMethod != null) ...[
                if (state.selectedPaymentMethod!.type ==
                    PaymentMethodType.multiPay) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'MULTI-PAY OPTIONS',
                        style: TextStyle(
                          color: colors.mutedForeground,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                      if (state.balance > 0 &&
                          state.selectedPaymentMethod!.payments.length < 3)
                        TextButton(
                          onPressed: () {
                            viewModel.addMultiPaymentMethod();
                          },
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(50, 30),
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: const Text(
                            'Add Method',
                            style: TextStyle(
                              color: Color(0xFF1DB978),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: state.selectedPaymentMethod!.payments.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final payment =
                          state.selectedPaymentMethod!.payments[index];
                      final usedMethods = state.selectedPaymentMethod!.payments
                          .map((p) => p.method)
                          .where((m) => m != payment.method)
                          .toSet();

                      return PaymentItemEditor(
                        payment: payment,
                        isMultiPay: true,
                        usedMethods: usedMethods,
                        onAmountChanged: (val) {
                          viewModel.updatePaymentAmount(index, val);
                        },
                        onMethodChanged: (method) {
                          viewModel.updatePaymentMethod(index, method);
                        },
                        onRemove: index > 0
                            ? () => viewModel.removeMultiPaymentMethod(index)
                            : null,
                      );
                    },
                  ),
                ] else if (state
                    .selectedPaymentMethod!
                    .payments
                    .isNotEmpty) ...[
                  Text(
                    'AMOUNT PAID (${getPaymentMethodName(state.selectedPaymentMethod!.payments.first.method)})',
                    style: TextStyle(
                      color: colors.mutedForeground,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 16),
                  PaymentItemEditor(
                    payment: state.selectedPaymentMethod!.payments.first,
                    isMultiPay: false,
                    onAmountChanged: (val) {
                      viewModel.updatePaymentAmount(0, val);
                    },
                  ),
                ],
                const SizedBox(height: 24),
                if (state.selectedPaymentMethod?.type ==
                        PaymentMethodType.transfer ||
                    (state.selectedPaymentMethod?.type ==
                            PaymentMethodType.multiPay &&
                        state.selectedPaymentMethod!.payments.any(
                          (p) => p.method == PaymentMethodType.transfer,
                        ))) ...[
                  Text(
                    'BUSINESS BRANCH BANK DETAILS',
                    style: TextStyle(
                      color: colors.mutedForeground,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (state.branchBankDetails.isEmpty)
                    const Text(
                      'No bank details available for this branch.',
                      style: TextStyle(color: Colors.redAccent, fontSize: 13),
                    )
                  else ...[
                    if (state.branchBankDetails.length > 1)
                      SizedBox(
                        height: 100,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: state.branchBankDetails.length,
                          separatorBuilder: (context, index) =>
                              const SizedBox(width: 12),
                          itemBuilder: (context, index) {
                            final bank = state.branchBankDetails[index];
                            final isSelected =
                                state.selectedBankDetail?.id == bank.id;
                            return GestureDetector(
                              onTap: () => viewModel.selectBankDetail(bank),
                              child: BankDetailCard(
                                bank: bank,
                                isSelected: isSelected,
                                colors: colors,
                              ),
                            );
                          },
                        ),
                      )
                    else if (state.selectedBankDetail != null)
                      BankDetailCard(
                        bank: state.selectedBankDetail!,
                        isSelected: true,
                        colors: colors,
                        width: double.infinity,
                      ),
                  ],
                  const SizedBox(height: 24),
                ],
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Balance Remaining',
                      style: TextStyle(
                        color: colors.mutedForeground,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      '₦${state.balance}',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: state.balance == 0
                            ? const Color(0xFF1DB978)
                            : state.balance < 0
                            ? Colors.red
                            : Colors.white,
                      ),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: Material(
                  color: state.selectedPaymentMethod == null || state.isLoading
                      ? const Color(0xFF334155)
                      : const Color(0xFF475569),
                  borderRadius: BorderRadius.circular(12),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap:
                        state.selectedPaymentMethod == null || state.isLoading
                        ? null
                        : () async {
                            final res = await viewModel.checkout();
                            if (context.mounted) {
                              if (res.success) {
                                ToastWidget.makeToast(
                                  context: context,
                                  title: res.message,
                                  icon: FLucideIcons.circleCheck,
                                );
                                context.go(Routes.dashboard);
                              } else {
                                ToastWidget.makeToast(
                                  context: context,
                                  title: res.message,
                                  icon: FLucideIcons.circleX,
                                );
                              }
                            }
                          },
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      child: Center(
                        child: state.isLoading
                            ? SpinnerWidget.spinner()
                            : const Text(
                                'Finish & Record Sale',
                                style: TextStyle(
                                  color: Colors.white54,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getPaymentMethodIcon(PaymentMethodType method, bool isSelected) {
    switch (method) {
      case PaymentMethodType.cash:
        return Icons.money_outlined;
      case PaymentMethodType.transfer:
        return Icons.account_balance_outlined;
      case PaymentMethodType.mixWallet:
        return Icons.account_balance_wallet_outlined;
      case PaymentMethodType.payLater:
        return Icons.person_search_outlined;
      case PaymentMethodType.multiPay:
        return Icons.call_split_outlined;
    }
  }
}

String getPaymentMethodName(PaymentMethodType method) {
  switch (method) {
    case PaymentMethodType.cash:
      return 'CASH';
    case PaymentMethodType.transfer:
      return 'TRANSFER';
    case PaymentMethodType.mixWallet:
      return 'MIX WALLET';
    case PaymentMethodType.payLater:
      return 'PAY LATER';
    case PaymentMethodType.multiPay:
      return 'MULTIPAY';
  }
}

class PaymentItemEditor extends StatefulWidget {
  final Payments payment;
  final bool isMultiPay;
  final Set<PaymentMethodType>? usedMethods;
  final ValueChanged<int> onAmountChanged;
  final ValueChanged<PaymentMethodType>? onMethodChanged;
  final VoidCallback? onRemove;

  const PaymentItemEditor({
    super.key,
    required this.payment,
    required this.isMultiPay,
    this.usedMethods,
    required this.onAmountChanged,
    this.onMethodChanged,
    this.onRemove,
  });

  @override
  State<PaymentItemEditor> createState() => _PaymentItemEditorState();
}

class _PaymentItemEditorState extends State<PaymentItemEditor> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.payment.amount.toString());
  }

  @override
  void didUpdateWidget(PaymentItemEditor oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.payment.amount != widget.payment.amount) {
      if (int.tryParse(_controller.text) != widget.payment.amount) {
        _controller.text = widget.payment.amount.toString();
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colors.border),
      ),
      child: Row(
        children: [
          if (widget.isMultiPay) ...[
            Expanded(
              flex: 2,
              child: DropdownButtonHideUnderline(
                child: DropdownButton<PaymentMethodType>(
                  value: widget.payment.method,
                  isExpanded: true,
                  dropdownColor: const Color(0xFF1E293B),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  icon: const Icon(Icons.arrow_drop_down, color: Colors.white),
                  items:
                      [
                            PaymentMethodType.cash,
                            PaymentMethodType.transfer,
                            PaymentMethodType.mixWallet,
                          ]
                          .where(
                            (m) => !(widget.usedMethods?.contains(m) ?? false),
                          )
                          .map((method) {
                            return DropdownMenuItem(
                              value: method,
                              child: Text(getPaymentMethodName(method)),
                            );
                          })
                          .toList(),
                  onChanged: (val) {
                    if (val != null && widget.onMethodChanged != null) {
                      widget.onMethodChanged!(val);
                    }
                  },
                ),
              ),
            ),
            Container(
              width: 1,
              height: 30,
              color: colors.border,
              margin: const EdgeInsets.symmetric(horizontal: 12),
            ),
          ],
          Expanded(
            flex: 3,
            child: TextField(
              controller: _controller,
              keyboardType: TextInputType.number,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              decoration: InputDecoration(
                prefixText: '₦ ',
                prefixStyle: const TextStyle(
                  color: Color(0xFF1DB978),
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
                border: InputBorder.none,
                hintText: '0',
                hintStyle: TextStyle(color: colors.mutedForeground),
              ),
              onChanged: (val) {
                final amount = int.tryParse(val) ?? 0;
                widget.onAmountChanged(amount);
              },
            ),
          ),
          if (widget.isMultiPay && widget.onRemove != null) ...[
            IconButton(
              icon: const Icon(Icons.close, color: Colors.red, size: 20),
              onPressed: widget.onRemove,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
          ],
        ],
      ),
    );
  }
}

class BankDetailCard extends StatelessWidget {
  final BankDetail bank;
  final bool isSelected;
  final FColors colors;
  final double? width;

  const BankDetailCard({
    super.key,
    required this.bank,
    required this.isSelected,
    required this.colors,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width ?? 280,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isSelected
            ? const Color(0xFF1DB978).withOpacity(0.1)
            : const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected ? const Color(0xFF1DB978) : colors.border,
          width: isSelected ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Text(
                bank.bankName.toUpperCase(),
                style: TextStyle(
                  color: isSelected
                      ? const Color(0xFF1DB978)
                      : colors.mutedForeground,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              const Spacer(),
              if (isSelected)
                const Icon(
                  Icons.check_circle,
                  color: Color(0xFF1DB978),
                  size: 16,
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            bank.accountNumber,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            bank.accountName,
            style: TextStyle(color: colors.mutedForeground, fontSize: 12),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
