class SyncRunState {
  const SyncRunState({
    required this.pendingCount,
    this.isSyncing = false,
    this.appliedCount = 0,
    this.conflictCount = 0,
    this.failureCount = 0,
    this.pulledCount = 0,
    this.message = '',
    this.lastSyncedAt,
  });

  final int pendingCount;
  final bool isSyncing;
  final int appliedCount;
  final int conflictCount;
  final int failureCount;
  final int pulledCount;
  final String message;
  final DateTime? lastSyncedAt;

  bool get hasIssues => conflictCount > 0 || failureCount > 0;

  SyncRunState copyWith({
    int? pendingCount,
    bool? isSyncing,
    int? appliedCount,
    int? conflictCount,
    int? failureCount,
    int? pulledCount,
    String? message,
    DateTime? lastSyncedAt,
  }) {
    return SyncRunState(
      pendingCount: pendingCount ?? this.pendingCount,
      isSyncing: isSyncing ?? this.isSyncing,
      appliedCount: appliedCount ?? this.appliedCount,
      conflictCount: conflictCount ?? this.conflictCount,
      failureCount: failureCount ?? this.failureCount,
      pulledCount: pulledCount ?? this.pulledCount,
      message: message ?? this.message,
      lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
    );
  }
}
