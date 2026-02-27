import 'package:spine/drift/database.dart';

enum SaleUnit { piece, bulk }

enum PaymentMethod { cash, transfer, mixWallet, payLater, multiPay }

class CartItem {
  final ProductData product;
  final double quantity;
  final SaleUnit unit;

  CartItem({
    required this.product,
    this.quantity = 1,
    this.unit = SaleUnit.piece,
  });

  double get unitPrice {
    return unit == SaleUnit.piece
        ? double.tryParse(product.sellingPricePerPiece) ?? 0
        : double.tryParse(product.sellingPricePerBulk) ?? 0;
  }

  double get total => quantity * unitPrice;

  CartItem copyWith({ProductData? product, double? quantity, SaleUnit? unit}) {
    return CartItem(
      product: product ?? this.product,
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

  double get subtotal => cartItems.fold(0, (sum, item) => sum + item.total);

  CreateSaleState copyWith({
    List<CartItem>? cartItems,
    List<ProductData>? quickPicks,
    bool? isLoading,
    String? errorMessage,
    PaymentMethod? selectedPaymentMethod,
  }) {
    return CreateSaleState(
      cartItems: cartItems ?? this.cartItems,
      quickPicks: quickPicks ?? this.quickPicks,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
      selectedPaymentMethod:
          selectedPaymentMethod ?? this.selectedPaymentMethod,
    );
  }
}
