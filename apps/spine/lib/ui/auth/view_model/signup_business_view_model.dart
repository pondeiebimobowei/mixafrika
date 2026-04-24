import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/business/business_repository_remote.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/data/services/models/business_model.dart';
import 'package:spine/drift/database.dart';
import 'package:uuid/uuid.dart';

class SignupBusinessViewModel extends Notifier<void> {

  @override
  void build() {
    return;
  }

  Future<ApiResponse<BusinessWithBranch>> createBusiness({
    required String name,
    required String type,
    required String streetAddress,
    required String city,
    required String state,
    required String country,
    required String phone,
  }) async {
    final businessRepo = ref.read(businessRepositoryRemoteProvider);
    
    final business = BusinessesData(
      id: const Uuid().v4(),
      name: name,
      type: type,
      phone: phone,
      streetAddress: streetAddress,
      city: city,
      state: state,
      country: country,
      isVerified: false,
      syncStatus: 'synced',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    final res = await businessRepo.createBusiness(business);
    
    // We expect the type returned inside ApiResponse.data to be BusinessesData or similar
    if (res.success) {
      return ApiResponse(success: true, message: res.message, data: res.data);
    } else {
      return ApiResponse(success: false, message: res.message, data: res.data);
    }
  }
}

final signupBusinessViewModelProvider =
    NotifierProvider<SignupBusinessViewModel, void>(
      SignupBusinessViewModel.new,
    );
