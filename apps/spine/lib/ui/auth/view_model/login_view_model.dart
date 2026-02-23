import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/auth/auth_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/shared_preference.dart';

class LoginViewModel extends AsyncNotifier<void> {

  @override
  Future<void> build() async {
    return;
  }

  Future<ApiResponse<AuthResponse>> login({required String email, required String password}) async {
    final res = await ref.read(authRepositoryProvider).login(email, password);
    if (res.success) {
      await TokenManager.saveToken(res.data.token);
    }
    return res;


  }
}

final loginViewModelProvider =
    AsyncNotifierProvider<LoginViewModel, void>(
      LoginViewModel.new,
    );