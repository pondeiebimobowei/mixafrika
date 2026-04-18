import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/auth/auth_repository.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/repositories/business/business_repository.dart';
import 'package:spine/data/shared_preference.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/business/state/active_business_provider.dart';

class ShopManagementState {
  final List<BranchData> branch;
  final List<BusinessesData> businesses;
  final String? activeBusinessId;
  final bool isLoading;
  final String? error;

  final bool batchTrackingEnabled;
  final bool expiryTrackingEnabled;
  final String defaultUnit;
  final bool cashPaymentEnabled;
  final bool cardPaymentEnabled;
  final bool transferPaymentEnabled;
  final bool notificationEnabled;

  ShopManagementState({
    required this.branch,
    this.businesses = const [],
    this.activeBusinessId,
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
    List<BusinessesData>? businesses,
    String? activeBusinessId,
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
      businesses: businesses ?? this.businesses,
      activeBusinessId: activeBusinessId ?? this.activeBusinessId,
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
    init();
  }

  Future<void> init() async {
    final activeId = await AppPreferences.getActiveBusinessId();
    state = state.copyWith(activeBusinessId: activeId);
    await loadBusinesses();
    await loadBranches();
  }

  Future<void> loadBusinesses() async {
    state = state.copyWith(isLoading: true);
    try {
      final businesses = await ref.read(businessRepositoryProvider).getBusinesses();
      state = state.copyWith(businesses: businesses, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadBranches() async {
    state = state.copyWith(isLoading: true);
    final businessId = await AppPreferences.getActiveBusinessId();
    if (businessId == null) return;

    try {
      final branch = await ref
          .read(branchRepositoryLocalProvider)
          .getBranchesByBusinessId(businessId);
      state = state.copyWith(branch: branch, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> switchBusiness(String businessId) async {
    state = state.copyWith(isLoading: true, activeBusinessId: businessId);
    try {
      // 1. Save active business
      await AppPreferences.saveActiveBusinessId(businessId);

      // 2. Load branches for this business
      final branches = await ref
          .read(branchRepositoryLocalProvider)
          .getBranchesByBusinessId(businessId);
      
      // 3. Set default branch (head office or first)
      if (branches.isNotEmpty) {
        final headOffice = branches.where((b) => b.isHeadOffice).firstOrNull ?? branches.first;
        await AppPreferences.saveActiveBranchId(headOffice.id);
        ref.read(activeBranchProvider.notifier).setBranch(headOffice);
      } else {
        ref.read(activeBranchProvider.notifier).setBranch(null);
      }

      // 4. Update state
      state = state.copyWith(branch: branches, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> createBusiness(BusinessesData business) async {
    final result = await ref
        .read(businessRepositoryProvider)
        .createBusiness(business);
    if (result.success) {
      await loadBusinesses();
    } else {
      state = state.copyWith(error: result.message);
    }
  }

  Future<void> updateBusiness(BusinessesData business) async {
    final result = await ref
        .read(businessRepositoryProvider)
        .updateBusiness(business);
    if (result.success) {
      await loadBusinesses();
    } else {
      state = state.copyWith(error: result.message);
    }
  }

  Future<void> deleteBusiness(String id) async {
    await ref.read(businessRepositoryProvider).deleteBusiness(id);
    await loadBusinesses();
    
    // If deleted business was active, switch to first available or logout
    final activeId = await AppPreferences.getActiveBusinessId();
    if (activeId == id) {
      if (state.businesses.isNotEmpty) {
        await switchBusiness(state.businesses.first.id);
      } else {
        await logout();
      }
    }
  }

  Future<void> createBranch(BranchData branch) async {
    final result = await ref
        .read(branchRepositoryLocalProvider)
        .createBranch(branch);
    if (result.success) {
      await loadBranches();
    } else {
      state = state.copyWith(error: result.message);
    }
  }

  Future<void> updateBranch(BranchData branch) async {
    final result = await ref
        .read(branchRepositoryLocalProvider)
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
    await ref.read(branchRepositoryLocalProvider).deleteBranch(id);
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

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logOut();

    ref.read(activeBranchProvider.notifier).setBranch(null);
  }
}

final shopManagementViewModelProvider =
    StateNotifierProvider<ShopManagementViewModel, ShopManagementState>((ref) {
      return ShopManagementViewModel(ref);
    });
