import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/user_business/state/active_user_business_provider.dart';

class ShopManagementState {
  final List<BranchData> branch;
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
    required this.branch,
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
    List<BranchData>? branch,
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
      branch: branch ?? this.branch,
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
    : super(ShopManagementState(branch: [])) {
    loadBranches();
  }

  Future<void> loadBranches() async {
    state = state.copyWith(isLoading: true);
    try {
      final branch = await ref
          .read(branchRepositoryProvider)
          .getBranches();
      state = state.copyWith(branch: branch, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> createBranch(BranchCompanion branch) async {
    final result = await ref
        .read(branchRepositoryProvider)
        .createBranch(branch);
    if (result.success) {
      await loadBranches();
    } else {
      state = state.copyWith(error: result.message);
    }
  }

  Future<void> updateBranch(BranchData branch) async {
    final result = await ref
        .read(branchRepositoryProvider)
        .updateBranch(branch);
    if (result.success) {
      await loadBranches();
      // Update active branch if it was the one updated
      final activeBiz = ref.read(activeBranchProvider);
      if (activeBiz?.id == branch.id) {
        ref.read(activeBranchProvider.notifier).setBranch(branch);
      }
    } else {
      state = state.copyWith(error: result.message);
    }
  }

  Future<void> deleteBranch(String id) async {
    await ref.read(branchRepositoryProvider).deleteBranch(id);
    await loadBranches();
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
