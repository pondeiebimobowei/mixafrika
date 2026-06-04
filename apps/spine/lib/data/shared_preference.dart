import 'package:shared_preferences/shared_preferences.dart';

class TokenManager {
  static const String _tokenKey = 'auth_token';

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }
}

class AppPreferences {
  static const String _activeBusinessIdKey = 'active_business_id';
  static const String _activeBranchIdKey = 'active_branch_id';
  static const String _syncCursorKey = 'sync_cursor';

  static Future<void> saveActiveBusinessId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_activeBusinessIdKey, id);
  }

  static Future<String?> getActiveBusinessId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_activeBusinessIdKey);
  }

  static Future<void> saveActiveBranchId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_activeBranchIdKey, id);
  }

  static Future<String?> getActiveBranchId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_activeBranchIdKey);
  }

  static Future<void> saveSyncCursor(String cursor) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_syncCursorKey, cursor);
  }

  static Future<String?> getSyncCursor() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_syncCursorKey);
  }

  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_activeBusinessIdKey);
    await prefs.remove(_activeBranchIdKey);
    await prefs.remove(_syncCursorKey);
    await TokenManager.clearToken();
  }
}
