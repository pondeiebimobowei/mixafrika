import 'package:flutter/cupertino.dart';
import 'package:forui/forui.dart';

class IconWidget extends StatelessWidget {
  final IconData icon;
  final double? size;
  final Color? color;
  const IconWidget({super.key, required this.icon, this.size, this.color});

  @override
  Widget build(BuildContext context) {
    final FColors colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: colors.secondaryForeground.withValues(alpha: 0.7),
        shape: BoxShape.circle,
        border: Border.all(color: colors.background.withValues(alpha: 0.05)),
      ),
      child: Icon(icon, color: color ?? colors.primaryForeground, size: size ?? 20),
    );
  }
}