import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

class ToastWidget {
  static void makeToast({
    required BuildContext context,
    String title = 'Alert',
    required String description,
    required IconData? icon,
    required Color? color,
  }) {
    showFToast(
      context: context,
      icon: Icon(icon),
      title: Text(title),
      description: Text(description),
      suffixBuilder: (context, entry) =>
          GestureDetector(onTap: entry.dismiss, child: const Icon(FIcons.x)),
      alignment: .bottomCenter,
      
      swipeToDismiss: const [.right],
      duration: const Duration(seconds: 5),
      onDismiss: () {},
    );
  }
}