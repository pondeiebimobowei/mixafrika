import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/routing/routes.dart';

class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        duration: const Duration(seconds: 2), vsync: this);
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeIn);

    _controller.forward();

    _handleNavigation();
  }

  Future<void> _handleNavigation() async {
    // Wait for the animation to complete (at least 2 seconds)
    await Future.delayed(const Duration(seconds: 3));

    if (!mounted) return;

    final token = await TokenManager.getToken();
    final activeBusinessId = await AppPreferences.getActiveBusinessId();

    if (token != null && token.isNotEmpty) {
      if (activeBusinessId != null && activeBusinessId.isNotEmpty) {
        context.go(Routes.dashboard);
      } else {
        context.go(Routes.selectBusiness);
      }
    } else {
      context.go(Routes.login);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return const FScaffold(
      child: Center(
        child: SizedBox(
          // opacity: ,
          // opacity: ,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Use a generic icon if asset is missing, or assumed path
              Icon(
                FIcons.package,
                size: 100,
                color:
                    Colors.green, // Fixed color if context.theme is tricky here
              ),
              const SizedBox(height: 24),
              Text(
                'SPINE',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 4,
                  color: Colors.green,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Inventory Management',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
