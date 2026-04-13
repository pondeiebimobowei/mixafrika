import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/user_business/user_business_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class ShopManagementState {
  final List<BusinessesData> businesses;
  final bool isLoading;
  final String? error;

  // Non-functional settings state (simulated)
  final bool batchTrackingEnabled;
  final bool expiryTrackingEnabled;
  final String defaultUnit;
  final bool cashPaymentEnabled;
  final bool cardPaymentEnabled;
  final bool transferPaymentEnabled;
  final bool notificationEnabled;

  ShopManagementState({
    required this.businesses,
    this.isLoading = false,
    this.error,
    this.batchTrackingEnabled = false,
    this.expiryTrackingEnabled = false,
    this.defaultUnit = 'Pcs',
    this.cashPaymentEnabled = true,
    this.cardPaymentEnabled = false,
    this.transferPaymentEnabled = true,
    this.notificationEnabled = true,
  });

  ShopManagementState copyWith({
    List<BusinessesData>? businesses,
    bool? isLoading,
    String? error,
    bool? batchTrackingEnabled,
    bool? expiryTrackingEnabled,
    String? defaultUnit,
    bool? cashPaymentEnabled,
    bool? cardPaymentEnabled,
    bool? transferPaymentEnabled,
    bool? notificationEnabled,
  }) {
    return ShopManagementState(
      businesses: businesses ?? this.businesses,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      batchTrackingEnabled: batchTrackingEnabled ?? this.batchTrackingEnabled,
      expiryTrackingEnabled:
          expiryTrackingEnabled ?? this.expiryTrackingEnabled,
      defaultUnit: defaultUnit ?? this.defaultUnit,
      cashPaymentEnabled: cashPaymentEnabled ?? this.cashPaymentEnabled,
      cardPaymentEnabled: cardPaymentEnabled ?? this.cardPaymentEnabled,
      transferPaymentEnabled:
          transferPaymentEnabled ?? this.transferPaymentEnabled,
      notificationEnabled: notificationEnabled ?? this.notificationEnabled,
    );
  }
}

class ShopManagementViewModel extends StateNotifier<ShopManagementState> {
  final Ref ref;

  ShopManagementViewModel(this.ref)
    : super(ShopManagementState(businesses: [])) {
    loadBusinesses();
  }

  Future<void> loadBusinesses() async {
    state = state.copyWith(isLoading: true);
    try {
      final businesses = await ref
          .read(businessesRepositoryProvider)
          .getBusinesses();
      state = state.copyWith(businesses: businesses, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> createBusiness(BusinessesCompanion business) async {
    final result = await ref
        .read(businessesRepositoryProvider)
        .createBusinesses(business);
    if (result.success) {
      await loadBusinesses();
    } else {
      state = state.copyWith(error: result.message);
    }
  }

  Future<void> updateBusiness(BusinessesData business) async {
    final result = await ref
        .read(businessesRepositoryProvider)
        .updateBusinesses(business);
    if (result.success) {
      await loadBusinesses();
      // Update active business if it was the one updated
      final activeBiz = ref.read(activeBusinessesProvider);
      if (activeBiz?.id == business.id) {
        ref.read(activeBusinessesProvider.notifier).setBusiness(business);
      }
    } else {
      state = state.copyWith(error: result.message);
    }
  }

  Future<void> deleteBusiness(String id) async {
    await ref.read(businessesRepositoryProvider).deleteBusinesses(id);
    await loadBusinesses();
  }

  // UI Toggles (Simulated)
  void toggleBatchTracking(bool value) =>
      state = state.copyWith(batchTrackingEnabled: value);
  void toggleExpiryTracking(bool value) =>
      state = state.copyWith(expiryTrackingEnabled: value);
  void setDefaultUnit(String unit) => state = state.copyWith(defaultUnit: unit);
  void toggleCashPayment(bool value) =>
      state = state.copyWith(cashPaymentEnabled: value);
  void toggleCardPayment(bool value) =>
      state = state.copyWith(cardPaymentEnabled: value);
  void toggleTransferPayment(bool value) =>
      state = state.copyWith(transferPaymentEnabled: value);
  void toggleNotification(bool value) =>
      state = state.copyWith(notificationEnabled: value);
}

final shopManagementViewModelProvider =
    StateNotifierProvider<ShopManagementViewModel, ShopManagementState>((ref) {
      return ShopManagementViewModel(ref);
    });
