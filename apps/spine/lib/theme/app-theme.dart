import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:spine/theme/theme.dart';

class AppTheme {
  static final light = greenLight;
  static final dark = greenDark;
}

final themeProvider = StateNotifierProvider<ThemeNotifier, FThemeData>((ref) => ThemeNotifier());

class ThemeNotifier extends StateNotifier<FThemeData> {
  static const _themeKey = 'isDarkTheme';

  ThemeNotifier() : super(AppTheme.dark) {
    _loadTheme(); // Load persisted theme on initialization
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDark = prefs.getBool(_themeKey) ?? true;
    state = isDark ? AppTheme.dark : AppTheme.light;
  }

  Future<void> toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    if (state == AppTheme.dark) {
      state = AppTheme.light;
      await prefs.setBool(_themeKey, false);
    } else {
      state = AppTheme.dark;
      await prefs.setBool(_themeKey, true);
    }
  }
}
