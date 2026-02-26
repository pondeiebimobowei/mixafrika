import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:spine/theme/typography.dart';

class ButtonWidget extends StatelessWidget {
  final String text;
  final IconData? icon;
  final Color? color;
  final Color? textColor;
  final VoidCallback? onPressed;
  final bool? isOutlined;

  const ButtonWidget({
    super.key,
    required this.text,
    this.icon,
    required this.color,
    this.textColor,
    this.onPressed,
    this.isOutlined,
  });

  @override
  Widget build(BuildContext context) {
    return FButton(
      onPress: onPressed,
      prefix: Icon(icon, size: 20, color: color),
      child: Row(
        children: [
          RegularText(title: 'asd', style: TextStyle(
            color: textColor,
            ),),
          SmallText(
            title: text,
            style: TextStyle(
              color: textColor,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
    // return GestureDetector(
    //   onTap: onPressed,
    //   child: Container(
    //     padding: const EdgeInsets.symmetric(vertical: 14),
    //     decoration: BoxDecoration(
    //       color: isOutlined == true ? Colors.transparent : color.primary,
    //       borderRadius: BorderRadius.circular(10),
    //       border: isOutlined == true ? Border.all(color: color.primary ) : null,
    //     ),
    //     child: Row(
    //       mainAxisAlignment: MainAxisAlignment.center,
    //       children: [
    //         Icon(icon, size: 20, color: textColor),
    //         const SizedBox(width: 8),
    //         Text(
    //           text,
    //           style: TextStyle(
    //             color: textColor,
    //             fontWeight: FontWeight.bold,
    //             fontSize: 16,
    //           ),
    //         ),
    //       ],
    //     ),
    //   ),
    // );
  }
}