
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/screens/dashboard_screen.dart';
import 'package:spine/screens/login_screen.dart';
import 'package:spine/screens/signup_screen.dart';
import 'package:spine/screens/splash_screen.dart';

final router = GoRouter(
  initialLocation: Routes.splash,
  routes: [
    GoRoute(
      path: Routes.splash,
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: Routes.login,
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: Routes.signup,
      builder: (context, state) => const SignupScreen(),
    ),
    GoRoute(
      path: Routes.dashboard,
      builder: (context, state) => const DashboardScreen(),
    ),
  ]
);