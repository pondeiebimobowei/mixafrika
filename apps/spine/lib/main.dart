import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/theme/app-theme.dart';
import 'package:spine/screens/splash_screen.dart';
import 'package:spine/screens/dashboard_screen.dart';
import 'package:spine/screens/login_screen.dart';
import 'package:spine/screens/signup_screen.dart';
import 'package:spine/screens/business_details_screen.dart';

void main() {
  runApp(const Application());
}

final GoRouter _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/splash', builder: (context, state) => const SplashScreen()),
    GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    GoRoute(path: '/signup', builder: (context, state) => const SignupScreen()),
    GoRoute(
      path: '/business-details',
      builder: (context, state) {
        final userData = state.extra as Map<String, dynamic>;
        return BusinessDetailsScreen(userData: userData);
      },
    ),
    GoRoute(path: '/', builder: (context, state) => const DashboardScreen()),
  ],
);

class Application extends StatelessWidget {
  const Application({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = AppTheme.dark;

    return MaterialApp.router(
      title: 'SpineS',
      debugShowCheckedModeBanner: false,
      routerConfig: _router,
      supportedLocales: FLocalizations.supportedLocales,
      localizationsDelegates: const [...FLocalizations.localizationsDelegates],
      theme: theme.toApproximateMaterialTheme(),
      themeMode: ThemeMode.dark,
      builder: (_, child) => FTheme(
        data: theme,
        child: FToaster(child: FTooltipGroup(child: child!)),
      ),
    );
  }
}

class Example extends StatefulWidget {
  const Example({super.key});

  @override
  State<Example> createState() => _ExampleState();
}

class _ExampleState extends State<Example> {
  int _count = 0;

  @override
  Widget build(BuildContext context) => FScaffold(
    child: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        spacing: 10,
        children: [
          Text('Count: $_count'),
          FButton(
            onPress: () => setState(() => _count++),
            suffix: const Icon(FIcons.chevronsUp),
            child: Text(
              'Increases',
              style: TextStyle(color: context.theme.colors.primary),
            ),
          ),
          const SizedBox(height: 20),
          FButton(
            onPress: () => context.go('/splash'),
            child: const Text('Go to Splash'),
          ),
        ],
      ),
    ),
  );
}
