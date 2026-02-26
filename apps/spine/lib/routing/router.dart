import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/screens/signup_screen.dart';
import 'package:spine/screens/splash_screen.dart';
import 'package:spine/ui/auth/view/login_view.dart';
import 'package:spine/ui/home/widget/home_screen.dart';
import 'package:spine/ui/inventory/view/inventory_screen.dart';
import 'package:spine/ui/inventory/view/add_product_view.dart';

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
      builder: (context, state) => const SignupScreen(),
    ),
    GoRoute(path: Routes.dashboard, builder: (context, state) => HomeView()),
    GoRoute(
      path: Routes.inventory,
      builder: (context, state) => const InventoryView(),
    ),
    GoRoute(
      path: Routes.addProduct,
      builder: (context, state) => const AddProductView(),
    ),
  ],
);
