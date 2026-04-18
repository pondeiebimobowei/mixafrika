import 'package:spine/data/services/models/base_model.dart';
import 'package:spine/drift/database.dart';

class BusinessUserModel extends BaseModel {
  final String id;
  final String role;
  final bool isActive;
  final bool hasFullAccess;
  final String? joinedAt;
  final String userId;
  final String businessId;

  final String syncStatus;
  final String syncDate;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  BusinessUserModel({
    required this.id,
    required this.role,
    required this.isActive,
    required this.hasFullAccess,
    required this.joinedAt,
    required this.userId,
    required this.businessId,
    required this.syncStatus,
    required this.syncDate,
    required this.createdAt,
    required this.updatedAt,
    required this.deletedAt,
  }) : super(
          id: id,
          createdAt: createdAt,
          deletedAt: deletedAt,
          syncDate: syncDate,
          syncStatus: syncStatus,
          updatedAt: updatedAt,
        );

  factory BusinessUserModel.fromJson(Map<String, dynamic> json) {
    return BusinessUserModel(
      id: json['id'] ?? '',
      role: json['role'] ?? '',
      isActive: json['is_active'] ?? false,
      hasFullAccess: json['has_full_access'] ?? false,
      joinedAt: json['joined_at'],
      userId: json['user_id'] ?? '',
      businessId: json['business_id'] ?? '',
      syncStatus: json['sync_status'] ?? '',
      syncDate: json['sync_date'] ?? '',
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      deletedAt: json['deleted_at'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'role': role,
    'is_active': isActive,
    'has_full_access': hasFullAccess,
    'joined_at': joinedAt,
    'user_id': userId,
    'business_id': businessId,
    'sync_status': syncStatus,
    'sync_date': syncDate,
    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };

  BusinessUserData toData() {
    return BusinessUserData(
      id: id,
      role: role,
      isActive: isActive,
      hasFullAccess: hasFullAccess,
      joinedAt: DateTime.tryParse(joinedAt ?? ''),
      userId: userId,
      businessId: businessId,
      syncStatus: syncStatus,
      syncDate: DateTime.tryParse(syncDate),
      createdAt: DateTime.tryParse(createdAt ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(updatedAt ?? '') ?? DateTime.now(),
    );
  }
}




