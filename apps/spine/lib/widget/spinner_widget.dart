import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

class SpinnerWidget {
  static Widget spinner({double size = 24}) {
    return FCircularProgress(
      style: .delta(iconStyle: .delta(size: size)),
      icon: FIcons.loaderCircle,
      semanticsLabel: 'Loading',
    );
  }
}