import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

class ToastWidget {
  static void makeToast({
    required BuildContext context,
    required String title,
    String? description,
    required IconData icon,
     FToastVariant variant = .primary,
  }) {
    showFToast(
      context: context,
      variant: variant,
      icon: Icon(icon),
      title: Text(title),
      description: description != null ? Text(description) : null,
      suffixBuilder: (context, entry) =>
          GestureDetector(onTap: entry.dismiss, child: const Icon(FLucideIcons.x)),
      alignment: .bottomCenter,
      
      swipeToDismiss: const [.right],
      duration: const Duration(seconds: 5),
      onDismiss: () {},
    );
  }
}