import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

class FHeaderStyling {
  FHeaderStyleDelta build(BuildContext context) {
    return FHeaderStyleDelta.delta(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
    );
  }
}