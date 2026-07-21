import 'package:spine/drift/database.dart';

enum SaleUnit { piece, bulk }

enum CartItemType { product, manual }

enum PaymentMethodType { cash, transfer, mixWallet, payLater, multiPay }

class Payments {
  final PaymentMethodType method;
  final int amount;
  final String? reference;

  Payments({required this.method, required this.amount, this.reference});

  Payments copyWith({
    PaymentMethodType? method,
    int? amount,
    String? reference,
  }) {
    return Payments(
      method: method ?? this.method,
      amount: amount ?? this.amount,
      reference: reference ?? this.reference,
    );
  }
}

class PaymentMethod {
  final PaymentMethodType type;
  final List<Payments> payments;

  PaymentMethod({required this.type, required this.payments});

  PaymentMethod copyWith({PaymentMethodType? type, List<Payments>? payments}) {
    return PaymentMethod(
      type: type ?? this.type,
      payments: payments ?? this.payments,
    );
  }
}

class CartItem {
  final String id;
  final ProductData? product;
  final String? manualName;
  final int? manualPrice;
  final int quantity;
  final CartItemType type;
  final SaleUnit unit;

  CartItem({
    required this.id,
    this.product,
    this.manualName,
    this.type = CartItemType.product,
    this.manualPrice,
    this.quantity = 1,
    this.unit = SaleUnit.piece,
  }) : assert(
         (product != null) != (manualName != null && manualPrice != null),
         'CartItem must be either a product item or a manual charge.',
       );

  int get unitPrice {
    if (product != null) {
      return unit == SaleUnit.piece
          ? product!.sellingPricePerPiece
          : product!.sellingPricePerBulk;
    }
    return manualPrice ?? 0;
  }

  bool get isManual => type == CartItemType.manual;

  bool get isProduct => type == CartItemType.product;

  int get total => quantity * unitPrice;

  CartItem copyWith({
    ProductData? product,
    String? manualName,
    int? manualPrice,
    int? quantity,
    SaleUnit? unit,
  }) {
    return CartItem(
      id: id,
      product: product ?? this.product,
      manualName: manualName ?? this.manualName,
      manualPrice: manualPrice ?? this.manualPrice,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
    );
  }
}

class CreateSaleState {
  final List<CartItem> cartItems;
  final List<ProductData> quickPicks;
  final bool isLoading;
  final String? errorMessage;
  final PaymentMethod? selectedPaymentMethod;
  final List<BankDetail> branchBankDetails;
  final BankDetail? selectedBankDetail;
  final CustomerData? selectedCustomer;
  final List<CustomerData> customers;

  CreateSaleState({
    this.cartItems = const [],
    this.quickPicks = const [],
    this.isLoading = false,
    this.errorMessage,
    this.selectedPaymentMethod,
    this.branchBankDetails = const [],
    this.selectedBankDetail,
    this.selectedCustomer,
    this.customers = const [],
  });

  int get grandTotal => cartItems.fold(0, (sum, item) => sum + item.total);
  int get totalPaid {
    if (selectedPaymentMethod == null) return 0;

    return selectedPaymentMethod!.payments.fold(
      0,
      (sum, payment) => sum + payment.amount,
    );
  }

  int get balance => grandTotal - totalPaid;

  bool get hasTransferPayment =>
      selectedPaymentMethod?.type == PaymentMethodType.transfer ||
      (selectedPaymentMethod?.type == PaymentMethodType.multiPay &&
          selectedPaymentMethod!.payments.any(
            (payment) => payment.method == PaymentMethodType.transfer,
          ));

  bool get requiresBankSelection =>
      hasTransferPayment && branchBankDetails.isNotEmpty;

  bool get canCheckout => checkoutValidationMessage == null;

  String? get checkoutValidationMessage {
    if (cartItems.isEmpty) {
      return 'Cart is empty';
    }
    if (selectedPaymentMethod == null) {
      return 'No payment method selected';
    }
    if (requiresBankSelection && selectedBankDetail == null) {
      return 'Select a bank account for transfer payments';
    }
    if (selectedPaymentMethod!.payments.any((payment) => payment.amount < 0)) {
      return 'Payment amounts cannot be negative';
    }
    if (selectedPaymentMethod!.payments.any((payment) => payment.amount == 0)) {
      return 'Payment amount cannot be zero';
    }
    if (totalPaid > grandTotal) {
      return 'Payment total cannot exceed the sale total';
    }
    if (selectedPaymentMethod!.type != PaymentMethodType.payLater &&
        balance > 0) {
      return 'Payment total must cover the sale total';
    }
    if (selectedPaymentMethod!.type == PaymentMethodType.payLater &&
        totalPaid > 0) {
      return 'Pay later sales should not collect payment now';
    }

    return null;
  }

  CreateSaleState copyWith({
    List<CartItem>? cartItems,
    List<ProductData>? quickPicks,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
    PaymentMethod? selectedPaymentMethod,
    List<BankDetail>? branchBankDetails,
    BankDetail? selectedBankDetail,
    CustomerData? selectedCustomer,
    List<CustomerData>? customers,
  }) {
    return CreateSaleState(
      cartItems: cartItems ?? this.cartItems,
      quickPicks: quickPicks ?? this.quickPicks,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
      selectedPaymentMethod:
          selectedPaymentMethod ?? this.selectedPaymentMethod,
      branchBankDetails: branchBankDetails ?? this.branchBankDetails,
      selectedBankDetail: selectedBankDetail ?? this.selectedBankDetail,
      selectedCustomer: selectedCustomer ?? this.selectedCustomer,
      customers: customers ?? this.customers,
    );
  }
}
