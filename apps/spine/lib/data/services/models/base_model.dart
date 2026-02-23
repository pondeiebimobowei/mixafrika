
class BaseModel {
  final String id;

  final String syncStatus;
  final String syncDate;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  BaseModel({
    required this.id,

    required this.syncDate,
    required this.syncStatus,

    required this.createdAt,
    required this.updatedAt,
    required this.deletedAt,
  });

  factory BaseModel.fromJson(Map<String, dynamic> json) {
    return BaseModel(
      id: json['id'],
      syncDate: json['sync_date'],
      syncStatus: json['sync_status'],

      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      deletedAt: json['deleted_at'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'sync_date': syncStatus,
    'syncStatus': syncStatus,
  };
}

