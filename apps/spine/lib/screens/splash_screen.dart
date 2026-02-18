import 'dart:async';
import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeIn);

    _controller.forward();

    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        context.go('/');
      }
    });
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
