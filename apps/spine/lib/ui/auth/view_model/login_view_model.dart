import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/auth/auth_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/ui/auth/state/login_state.dart';
import 'package:spine/ui/sync/sync_view_model.dart';

class LoginViewModel extends Notifier<LoginState> {
  @override
  LoginState build() {
    return const LoginState();
  }

  Future<ApiResponse<AuthResponse>> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    final res = await ref.read(authRepositoryProvider).login(email, password);

    if (res.success) {
      await TokenManager.saveToken(res.data.token);
      await ref.read(syncViewModelProvider.notifier).runSync();
      // await ref.read(authRepositoryProvider).syncData();
      state = state.copyWith(isLoading: false, isSuccess: true);
    } else {
      state = state.copyWith(isLoading: false, errorMessage: res.message);
    }

    return res;
  }
}

final loginViewModelProvider = NotifierProvider<LoginViewModel, LoginState>(
  LoginViewModel.new,
);