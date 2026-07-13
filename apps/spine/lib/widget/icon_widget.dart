import 'package:flutter/cupertino.dart';
import 'package:forui/forui.dart';

class IconWidget extends StatelessWidget {
  final IconData icon;
  final double? size;
  final Color? color;
  final VoidCallback? onTap;
  const IconWidget({
    super.key,
    required this.icon,
    this.size,
    this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final FColors colors = context.theme.colors;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
        decoration: BoxDecoration(
          color: colors.background,
          shape: BoxShape.rectangle,
          border: Border.all(color: colors.primaryForeground.withValues(alpha: 0.1), ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          color: color ?? colors.primaryForeground,
          size: size ?? 18,
        ),
      ),
    );
  }
}