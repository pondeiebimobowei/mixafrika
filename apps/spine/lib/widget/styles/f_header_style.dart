import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

class FHeaderStyling {
  FHeaderStyleDelta build(BuildContext context) {
    return FHeaderStyleDelta.delta(
      padding: EdgeInsetsGeometryDelta.value(.directional(top: 20, bottom: 20, start: 12, end: 12))
    );
  }
}