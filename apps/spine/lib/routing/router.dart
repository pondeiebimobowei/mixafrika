import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/screens/business_details_screen.dart';
import 'package:spine/screens/splash_screen.dart';
import 'package:spine/ui/auth/view/login_view.dart';
import 'package:spine/ui/auth/view/signup_view.dart';
import 'package:spine/ui/home/view/home_screen.dart';
import 'package:spine/ui/inventory/view/add_product_view.dart';
import 'package:spine/ui/inventory/view/add_stock_view.dart';
import 'package:spine/ui/calculator/view/calculator_view.dart';
import 'package:spine/ui/sales/view/create_sale_view.dart';
import 'package:spine/ui/inventory/view/edit_product_view.dart';
import 'package:spine/ui/inventory/view/inventory_screen.dart';
import 'package:spine/ui/inventory/view/product_details_view.dart';
import 'package:spine/ui/inventory/view/stock_transfer_view.dart';
import 'package:spine/ui/sales/view/checkout_view.dart';
import 'package:spine/ui/shop_management/view/shop_management_view.dart';

import 'package:spine/ui/sales/view/sale_receipt_view.dart';
import 'package:spine/ui/sales/view/sales_log_view.dart';

GoRouter router() => GoRouter(
  initialLocation: Routes.dashboard,
  routes: [
    GoRoute(
      path: Routes.splash,
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: Routes.login,
      builder: (context, state) {
        return LoginView();
      },
    ),
    GoRoute(
      path: Routes.signup,
      builder: (context, state) => SignupView(),
    ),
    GoRoute(
      path: Routes.businessDetails,
      builder: (context, state) => const BusinessDetailsScreen(),
    ),
    GoRoute(path: Routes.dashboard, builder: (context, state) => HomeView()),
    GoRoute(
      path: Routes.inventory,
      builder: (context, state) => const InventoryView(),
      routes: [
        GoRoute(
          path: '${Routes.productDetails}/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ProductDetailsView(productId: id);
          },
          routes: [
            GoRoute(
              path: Routes.stockTransfer,
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return StockTransferView(productId: id);
              },
            ),

            GoRoute(
              path: Routes.stockTransferSuccess,
              builder: (context, state) {
                final extra = state.extra as Map<String, dynamic>?;
                return StockTransferSuccessView(
                  productName: extra?['productName'] ?? 'Product',
                  quantity: extra?['quantity'] ?? '0',
                  destination: extra?['destination'] ?? 'Branch',
                );
              },
            ),
          ],
        ),
        GoRoute(
          path: '${Routes.editProduct}/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return EditProductView(productId: id);
          },
        ),

        GoRoute(
          path: Routes.addProduct,
          builder: (context, state) => const AddProductView(),
        ),
        GoRoute(
          path: Routes.addStock,
          builder: (context, state) => const AddStockView(),
        ),
      ]
    ),
    
    GoRoute(
      path: Routes.calculator,
      builder: (context, state) => const CalculatorView(),
    ),
    GoRoute(
      path: Routes.createSale,
      builder: (context, state) => const CreateSaleView(),
    ),
    GoRoute(
      path: Routes.checkout,
      builder: (context, state) => const CheckoutView(),
    ),
    GoRoute(
      path: Routes.salesLog,
      builder: (context, state) => const SalesLogView(),
    ),
    GoRoute(
      path: '${Routes.saleReceipt}/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return SaleReceiptView(saleId: id);
      },
    ),
    GoRoute(
      path: Routes.shopManagement,
      builder: (context, state) => const ShopManagementView(),
    ),
  ],
);
