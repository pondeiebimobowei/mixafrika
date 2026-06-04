import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/customer/customer_repository.dart';
import 'package:spine/data/repositories/product/product_repository.dart';
import 'package:spine/data/repositories/sales/sales_repository.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/sales/state/create_sale_state.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';
import 'package:uuid/uuid.dart';

class CreateSaleViewModel extends StateNotifier<CreateSaleState> {
  final ProductRepository _productRepository;
  final SalesRepository _salesRepository;
  final BranchRepository _branchRepository;
  final CustomerRepository _customerRepository;
  final BranchData? _activeBranch;

  CreateSaleViewModel({
    required ProductRepository productRepository,
    required SalesRepository salesRepository,
    required BranchRepository branchRepository,
    required CustomerRepository customerRepository,
    required BranchData? activeBranch,
  }) : _productRepository = productRepository,
       _salesRepository = salesRepository,
       _branchRepository = branchRepository,
       _customerRepository = customerRepository,
       _activeBranch = activeBranch,
       super(CreateSaleState()) {
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    state = state.copyWith(isLoading: true);
    try {
      final products = await _productRepository.getProductsByBranchId(
        _activeBranch?.id ?? '',
      );
      final bankDetails = await _branchRepository
          .getBankDetailsByBranchId(_activeBranch?.id ?? '');
      final customers = await _customerRepository.getCustomers(
        _activeBranch?.id ?? '',
      );

      // For demo, take first 5 as quick picks
      state = state.copyWith(
        quickPicks: products.take(5).toList(),
        branchBankDetails: bankDetails,
        customers: customers,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void addToCart(ProductData product) {
    final existingIndex = state.cartItems.indexWhere(
      (item) => item.id == product.id,
    );
    if (existingIndex != -1) {
      final existingItem = state.cartItems[existingIndex];
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      state = state.copyWith(
        cartItems: [
          ...state.cartItems,
          CartItem(id: product.id, product: product),
        ],
      );
    }
  }

  void addManualCharge(int amount, String name) {
    state = state.copyWith(
      cartItems: [
        ...state.cartItems,
        CartItem(
          id: Uuid().v4(),
          manualName: name,
          type: 'manual',
          manualPrice: amount,
          quantity: 1,
        ),
      ],
    );
  }

  void updateQuantity(String productId, int quantity) {
    state = state.copyWith(
      cartItems: state.cartItems.map((item) {
        if (item.id == productId) {
          return item.copyWith(quantity: quantity);
        }
        return item;
      }).toList(),
    );
  }

  void toggleUnit(String productId) {
    state = state.copyWith(
      cartItems: state.cartItems.map((item) {
        if (item.id == productId) {
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
      cartItems: state.cartItems.where((item) => item.id != productId).toList(),
    );
  }

  void selectPaymentMethodType(PaymentMethodType method) {
    List<Payments> initialPayments;
    if (method == PaymentMethodType.multiPay) {
      initialPayments = [
        Payments(method: PaymentMethodType.cash, amount: 0),
        Payments(method: PaymentMethodType.transfer, amount: 0),
      ];
    } else {
      initialPayments = [Payments(method: method, amount: state.grandTotal)];
    }

    BankDetail? selectedBank = state.selectedBankDetail;
    final hasTransfer =
        method == PaymentMethodType.transfer ||
        initialPayments.any((p) => p.method == PaymentMethodType.transfer);

    if (hasTransfer &&
        selectedBank == null &&
        state.branchBankDetails.isNotEmpty) {
      selectedBank = state.branchBankDetails.first;
    }

    state = state.copyWith(
      selectedPaymentMethod: PaymentMethod(
        type: method,
        payments: initialPayments,
      ),
      selectedBankDetail: selectedBank,
    );
  }

  void selectBankDetail(BankDetail bankDetail) {
    state = state.copyWith(selectedBankDetail: bankDetail);
  }

  void updatePaymentAmount(int index, int amount) {
    if (state.selectedPaymentMethod == null) return;

    final payments = List<Payments>.from(state.selectedPaymentMethod!.payments);
    if (index >= 0 && index < payments.length) {
      payments[index] = payments[index].copyWith(amount: amount);
      state = state.copyWith(
        selectedPaymentMethod: state.selectedPaymentMethod!.copyWith(
          payments: payments,
        ),
      );
    }
  }

  void updatePaymentMethod(int index, PaymentMethodType method) {
    if (state.selectedPaymentMethod == null) return;

    final payments = List<Payments>.from(state.selectedPaymentMethod!.payments);
    if (index >= 0 && index < payments.length) {
      payments[index] = payments[index].copyWith(method: method);
      state = state.copyWith(
        selectedPaymentMethod: state.selectedPaymentMethod!.copyWith(
          payments: payments,
        ),
      );

      if (method == PaymentMethodType.transfer &&
          state.selectedBankDetail == null &&
          state.branchBankDetails.isNotEmpty) {
        state = state.copyWith(
          selectedBankDetail: state.branchBankDetails.first,
        );
      }
    }
  }

  void addMultiPaymentMethod() {
    if (state.selectedPaymentMethod?.type != PaymentMethodType.multiPay) return;
    final payments = List<Payments>.from(state.selectedPaymentMethod!.payments);

    final usedMethods = payments.map((p) => p.method).toSet();
    final availableMethods = [
      PaymentMethodType.cash,
      PaymentMethodType.transfer,
      PaymentMethodType.mixWallet,
    ].where((m) => !usedMethods.contains(m)).toList();

    if (availableMethods.isEmpty) return;

    final remaining = state.balance;
    payments.add(
      Payments(
        method: availableMethods.first,
        amount: remaining > 0 ? remaining : 0,
      ),
    );
    state = state.copyWith(
      selectedPaymentMethod: state.selectedPaymentMethod!.copyWith(
        payments: payments,
      ),
    );

    if (availableMethods.isNotEmpty &&
        availableMethods.first == PaymentMethodType.transfer &&
        state.selectedBankDetail == null &&
        state.branchBankDetails.isNotEmpty) {
      state = state.copyWith(
        selectedBankDetail: state.branchBankDetails.first,
      );
    }
  }

  void removeMultiPaymentMethod(int index) {
    if (state.selectedPaymentMethod?.type != PaymentMethodType.multiPay) return;
    final payments = List<Payments>.from(state.selectedPaymentMethod!.payments);
    if (index >= 0 && index < payments.length) {
      payments.removeAt(index);
      state = state.copyWith(
        selectedPaymentMethod: state.selectedPaymentMethod!.copyWith(
          payments: payments,
        ),
      );
    }
  }

  void searchCustomers(String query) async {
    final customers = await _customerRepository.searchCustomers(
      _activeBranch?.id ?? '',
      query,
    );
    state = state.copyWith(customers: customers);
  }

  void selectCustomer(CustomerData? customer) {
    print('Selecting customer: ${customer?.name}');
    state = state.copyWith(selectedCustomer: customer);
  }

  void addCustomer(String name, String phone) async {
    final customer = CustomerCompanion(
      id: Value(const Uuid().v4()),
      name: Value(name),
      phone: Value(phone),
      branchId: Value(_activeBranch?.id ?? ''),
      syncStatus: const Value('pending'),
      createdAt: Value(DateTime.now()),
      updatedAt: Value(DateTime.now()),
    );
    await _customerRepository.addCustomer(customer);
    final customers = await _customerRepository.getCustomers(
      _activeBranch?.id ?? '',
    );
    state = state.copyWith(customers: customers);
  }

  void deleteCustomer(String id) async {
    await _customerRepository.deleteCustomer(id);
    final customers = await _customerRepository.getCustomers(
      _activeBranch?.id ?? '',
    );
    state = state.copyWith(customers: customers);
  }

  Future<ApiResponse<void>> checkout() async {
    if (state.cartItems.isEmpty) {
      return ApiResponse(success: false, message: 'Cart is empty', data: null);
    }

    if (state.selectedPaymentMethod == null) {
      return ApiResponse(success: false, message: 'No payment method selected', data: null);
    }

    state = state.copyWith(isLoading: true);
    try {
      final saleId = const Uuid().v4();
      final sale = Sale(
        id: saleId,
        totalAmount: state.grandTotal,
        paymentMethod: state.selectedPaymentMethod!.type.name,
        status: state.balance > 0 ? 'partial' : 'completed',
        amountPaid: state.totalPaid,
        balance: state.balance,
        customerId: state.selectedCustomer?.id,
        branchId: _activeBranch?.id ?? '',
        syncStatus: 'pending',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final items = state.cartItems.map((item) {
        return SalesItemData(
          id: const Uuid().v4(),
          saleId: saleId,
          batchId: item.product?.id,
          costPrice: item.product?.sellingPricePerPiece ?? 0,
          name: item.product?.name ?? item.manualName ?? 'none',
          productId: item.product?.id,
          quantity: item.unit == SaleUnit.piece ? item.quantity : item.quantity * (item.product?.unitsPerBulk ?? 1),
          type: item.type,
          description: '',
          unitPrice: item.unitPrice,
          total: item.total,
          syncStatus: 'pending',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );
      }).toList();

      final paymentsList = state.selectedPaymentMethod!.payments.map((payment) {
        return Payment(
          id: const Uuid().v4(),
          syncStatus: 'pending',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          saleId: saleId,
          status: 'pending',
          amount: payment.amount,
          paymentMethod: payment.method.name,
          reference: payment.reference,
        );
      }).toList();
      final res = await _salesRepository.createSale(sale, items, paymentsList);
      state = CreateSaleState(quickPicks: state.quickPicks); // Reset cart
      return res;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
      return ApiResponse(success: false, message: e.toString(), data: null);
    }
  }
}

final createSaleViewModelProvider =
    StateNotifierProvider<CreateSaleViewModel, CreateSaleState>((ref) {
      return CreateSaleViewModel(
        productRepository: ref.watch(productRepositoryProvider),
        salesRepository: ref.watch(salesRepositoryProvider),
        branchRepository: ref.watch(branchRepositoryLocalProvider),
        customerRepository: ref.watch(customerRepositoryProvider),
        activeBranch: ref.read(activeBranchProvider),
      );
    });
