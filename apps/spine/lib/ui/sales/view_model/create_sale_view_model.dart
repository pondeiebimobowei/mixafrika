import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/data/repositories/sales/sales_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/sales/state/create_sale_state.dart';
import 'package:uuid/uuid.dart';

class CreateSaleViewModel extends StateNotifier<CreateSaleState> {
  final ProductRepository _productRepository;
  final SalesRepository _salesRepository;

  CreateSaleViewModel({
    required ProductRepository productRepository,
    required SalesRepository salesRepository,
  }) : _productRepository = productRepository,
       _salesRepository = salesRepository,
       super(CreateSaleState()) {
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    state = state.copyWith(isLoading: true);
    try {
      final products = await _productRepository.getProducts();
      // For demo, take first 5 as quick picks
      state = state.copyWith(
        quickPicks: products.take(5).toList(),
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void addToCart(ProductData product) {
    final existingIndex = state.cartItems.indexWhere(
      (item) => item.product.id == product.id,
    );
    if (existingIndex != -1) {
      final existingItem = state.cartItems[existingIndex];
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      state = state.copyWith(
        cartItems: [
          ...state.cartItems,
          CartItem(product: product),
        ],
      );
    }
  }

  void updateQuantity(String productId, int quantity) {
    state = state.copyWith(
      cartItems: state.cartItems.map((item) {
        if (item.product.id == productId) {
          return item.copyWith(quantity: quantity);
        }
        return item;
      }).toList(),
    );
  }

  void toggleUnit(String productId) {
    state = state.copyWith(
      cartItems: state.cartItems.map((item) {
        if (item.product.id == productId) {
          return item.copyWith(
            unit: item.unit == SaleUnit.piece ? SaleUnit.bulk : SaleUnit.piece,
          );
        }
        return item;
      }).toList(),
    );
  }

  void removeFromCart(String productId) {
    state = state.copyWith(
      cartItems: state.cartItems
          .where((item) => item.product.id != productId)
          .toList(),
    );
  }

  void selectPaymentMethod(PaymentMethod method) {
    state = state.copyWith(selectedPaymentMethod: method);
  }

  Future<bool> checkout() async {
    if (state.cartItems.isEmpty || state.selectedPaymentMethod == null) {
      return false;
    }

    state = state.copyWith(isLoading: true);
    try {
      final saleId = const Uuid().v4();
      final sale = Sale(
        id: saleId,
        branchId: 'main', // Placeholder
        totalAmount: state.subtotal,
        paymentMethod: state.selectedPaymentMethod!.name,
        status: 'completed',
        amountPaid: state.subtotal, // Defaulting to full payment for now
        balance: 0,
        businessId: 'main-biz', // Placeholder
        createdBy: '1', // Placeholder
        syncStatus: 'pending',
        syncDate: DateTime.now(),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        deletedAt: DateTime.now(),
      );

      final items = state.cartItems.map((item) {
        return SalesItemData(
          id: const Uuid().v4(),
          saleId: saleId,
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          syncStatus: 'pending',
          syncDate: DateTime.now(),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          deletedAt: DateTime.now(),
        );
      }).toList();

      await _salesRepository.createSale(sale, items);
      state = CreateSaleState(quickPicks: state.quickPicks); // Reset cart
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
      return false;
    }
  }
}

final createSaleViewModelProvider =
    StateNotifierProvider<CreateSaleViewModel, CreateSaleState>((ref) {
      return CreateSaleViewModel(
        productRepository: ref.watch(productRepositoryProvider),
        salesRepository: ref.watch(salesRepositoryProvider),
      );
    });
