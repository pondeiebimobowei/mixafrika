import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/auth/auth_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/shared_preference.dart';

class SignupViewModel extends Notifier<void> {

  @override
  void build() {
    return;
  }

  Future<ApiResponse<AuthResponse>> signup({required String firstName, required String lastName, required String phone, required String email, required String password}) async {
    final res = await ref.read(authRepositoryProvider).signUp(firstName, lastName, phone, email, password);
    if (res.success) {
      await TokenManager.saveToken(res.data.token);
    }
    return res;


  }
}

final signupViewModelProvider =
    NotifierProvider<SignupViewModel, void>(
      SignupViewModel.new,
    );