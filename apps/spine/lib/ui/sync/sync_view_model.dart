import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/data/repositories/sync/sync_repository.dart';
import 'package:spine/ui/sync/sync_state.dart';

class SyncViewModel extends AutoDisposeAsyncNotifier<SyncRunState> {
  @override
  FutureOr<SyncRunState> build() async {
    final pendingCount = await ref.read(syncRepositoryProvider).getPendingCount();
    return SyncRunState(pendingCount: pendingCount);
  }

  Future<void> runSync() async {
    final current = state.value ?? const SyncRunState(pendingCount: 0);
    state = AsyncData(current.copyWith(isSyncing: true, message: 'Syncing'));

    final result = await ref.read(syncRepositoryProvider).runSync();
    final pendingCount = await ref.read(syncRepositoryProvider).getPendingCount();

    state = AsyncData(
      SyncRunState(
        pendingCount: pendingCount,
        isSyncing: false,
        appliedCount: result.data.appliedCount,
        conflictCount: result.data.conflictCount,
        failureCount: result.data.failureCount,
        pulledCount: result.data.pulledCount,
        message: result.message,
        lastSyncedAt: DateTime.now(),
      ),
    );
  }
}

final syncViewModelProvider =
    AsyncNotifierProvider.autoDispose<SyncViewModel, SyncRunState>(
      SyncViewModel.new,
    );
