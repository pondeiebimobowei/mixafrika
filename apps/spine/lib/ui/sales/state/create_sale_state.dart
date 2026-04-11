import 'package:spine/drift/database.dart';

enum SaleUnit { piece, bulk }

enum PaymentMethodType { cash, transfer, mixWallet, payLater, multiPay }

class Payments {
  final PaymentMethodType method;
  final int amount;
  final String? reference;

  Payments({
    required this.method,
    required this.amount,
    this.reference,
  });

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

  PaymentMethod({
    required this.type, 
    required this.payments
  });

  PaymentMethod copyWith({
    PaymentMethodType? type,
    List<Payments>? payments,
  }) {
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
  final String type;
  final SaleUnit unit;

  CartItem({
    required this.id,
    this.product,
    this.manualName,
    this.type = 'product',
    this.manualPrice,
    this.quantity = 1,
    this.unit = SaleUnit.piece,
  }) : assert(product != null || (manualName != null && manualPrice != null));

  int get unitPrice {
    if (product != null) {
      return unit == SaleUnit.piece
          ? product!.sellingPricePerPiece
          : product!.sellingPricePerBulk;
    }
    return manualPrice ?? 0;
  }

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

  CreateSaleState({
    this.cartItems = const [],
    this.quickPicks = const [],
    this.isLoading = false,
    this.errorMessage,
    this.selectedPaymentMethod,
  });

  int get grandTotal => cartItems.fold(0, (sum, item) => sum + item.total);
  int get totalPaid {
    if (selectedPaymentMethod == null) return 0;

    return selectedPaymentMethod!.payments
        .fold(0, (sum, payment) => sum + payment.amount);
  }

  int get balance => grandTotal - totalPaid;

  CreateSaleState copyWith({
    List<CartItem>? cartItems,
    List<ProductData>? quickPicks,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
    PaymentMethod? selectedPaymentMethod,
  }) {
    return CreateSaleState(
      cartItems: cartItems ?? this.cartItems,
      quickPicks: quickPicks ?? this.quickPicks,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
      selectedPaymentMethod:
          selectedPaymentMethod ?? this.selectedPaymentMethod,
    );
  }
}
