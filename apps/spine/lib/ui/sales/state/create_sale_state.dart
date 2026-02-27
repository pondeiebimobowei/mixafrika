import 'package:spine/drift/database.dart';

enum SaleUnit { piece, bulk }

enum PaymentMethod { cash, transfer, mixWallet, payLater, multiPay }

class CartItem {
  final ProductData? product;
  final String? manualName;
  final int? manualPrice;
  final int quantity;
  final SaleUnit unit;

  CartItem({
    this.product,
    this.manualName,
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

  int get subtotal => cartItems.fold(0, (sum, item) => sum + item.total);

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
