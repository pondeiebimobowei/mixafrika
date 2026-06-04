class SyncMutation {
  SyncMutation({
    required this.entity,
    required this.localId,
    required this.data,
    this.action = 'upsert',
  });

  final String entity;
  final String localId;
  final String action;
  final Map<String, dynamic> data;

  Map<String, dynamic> toJson() {
    return {
      'entity': entity,
      'localId': localId,
      'action': action,
      'data': _jsonSafe(data),
    };
  }
}

class SyncAck {
  SyncAck({
    required this.entity,
    required this.localId,
    required this.serverId,
    required this.status,
    this.serverUpdatedAt,
  });

  final String entity;
  final String localId;
  final String serverId;
  final String status;
  final String? serverUpdatedAt;

  factory SyncAck.fromJson(Map<String, dynamic> json) {
    return SyncAck(
      entity: json['entity'] ?? '',
      localId: json['localId'] ?? json['local_id'] ?? '',
      serverId: json['serverId'] ?? json['server_id'] ?? '',
      status: json['status'] ?? '',
      serverUpdatedAt: json['serverUpdatedAt'] ?? json['server_updated_at'],
    );
  }
}

class SyncConflict {
  SyncConflict({
    required this.entity,
    required this.localId,
    required this.reason,
    this.serverRecord,
  });

  final String entity;
  final String localId;
  final String reason;
  final Map<String, dynamic>? serverRecord;

  factory SyncConflict.fromJson(Map<String, dynamic> json) {
    final record = json['serverRecord'] ?? json['server_record'];

    return SyncConflict(
      entity: json['entity'] ?? '',
      localId: json['localId'] ?? json['local_id'] ?? '',
      reason: json['reason'] ?? 'conflict',
      serverRecord: record is Map
          ? Map<String, dynamic>.from(record)
          : null,
    );
  }
}

class SyncFailure {
  SyncFailure({
    required this.entity,
    required this.localId,
    required this.reason,
  });

  final String entity;
  final String localId;
  final String reason;

  factory SyncFailure.fromJson(Map<String, dynamic> json) {
    return SyncFailure(
      entity: json['entity'] ?? '',
      localId: json['localId'] ?? json['local_id'] ?? '',
      reason: json['reason'] ?? 'failed',
    );
  }
}

class SyncPayload {
  SyncPayload({
    required this.cursor,
    required this.serverTime,
    required this.applied,
    required this.conflicts,
    required this.failures,
    required this.changes,
  });

  final String cursor;
  final String serverTime;
  final List<SyncAck> applied;
  final List<SyncConflict> conflicts;
  final List<SyncFailure> failures;
  final Map<String, List<Map<String, dynamic>>> changes;

  factory SyncPayload.empty() {
    return SyncPayload(
      cursor: '',
      serverTime: '',
      applied: [],
      conflicts: [],
      failures: [],
      changes: const {},
    );
  }

  factory SyncPayload.fromJson(Map<String, dynamic> json) {
    final changesJson = json['changes'] as Map<String, dynamic>? ?? {};
    final changes = changesJson.map((key, value) {
      final rows = value is List
          ? value
              .whereType<Map>()
              .map((row) => Map<String, dynamic>.from(row))
              .toList()
          : <Map<String, dynamic>>[];

      return MapEntry(key, rows);
    });

    return SyncPayload(
      cursor: json['cursor'] ?? '',
      serverTime: json['serverTime'] ?? json['server_time'] ?? '',
      applied: (json['applied'] as List? ?? [])
          .whereType<Map>()
          .map((item) => SyncAck.fromJson(Map<String, dynamic>.from(item)))
          .toList(),
      conflicts: (json['conflicts'] as List? ?? [])
          .whereType<Map>()
          .map((item) => SyncConflict.fromJson(Map<String, dynamic>.from(item)))
          .toList(),
      failures: (json['failures'] as List? ?? [])
          .whereType<Map>()
          .map((item) => SyncFailure.fromJson(Map<String, dynamic>.from(item)))
          .toList(),
      changes: changes,
    );
  }
}

Map<String, dynamic> _jsonSafe(Map<String, dynamic> data) {
  return data.map((key, value) {
    if (value is DateTime) {
      return MapEntry(key, value.toIso8601String());
    }

    return MapEntry(key, value);
  });
}
