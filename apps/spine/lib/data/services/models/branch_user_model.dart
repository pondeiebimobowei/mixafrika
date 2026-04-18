import 'package:spine/data/services/models/base_model.dart';
import 'package:spine/drift/database.dart';

class BranchUserModel extends BaseModel {
  final String id;
  final String role;
  final bool isActive;
  final String? assignedAt;
  final String userId;
  final String branchId;

  final String syncStatus;
  final String syncDate;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  BranchUserModel({
    required this.id,
    required this.role,
    required this.isActive,
    required this.assignedAt,
    required this.userId,
    required this.branchId,
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

  factory BranchUserModel.fromJson(Map<String, dynamic> json) {
    return BranchUserModel(
      id: json['id'] ?? '',
      role: json['role'] ?? '',
      isActive: json['is_active'] ?? false,
      assignedAt: json['assigned_at'],
      userId: json['user_id'] ?? '',
      branchId: json['branch_id'] ?? '',
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
    'assigned_at': assignedAt,
    'user_id': userId,
    'branch_id': branchId,
    'sync_status': syncStatus,
    'sync_date': syncDate,
    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };

  BranchUserData toData() {
    return BranchUserData(
      id: id,
      role: role,
      isActive: isActive,
      assignedAt: DateTime.tryParse(assignedAt ?? ''),
      userId: userId,
      branchId: branchId,
      syncStatus: syncStatus,
      syncDate: DateTime.tryParse(syncDate),
      createdAt: DateTime.tryParse(createdAt ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(updatedAt ?? '') ?? DateTime.now(),
    );
  }
}


class BranchUserWithUser {
  final BranchUserData branchUser;
  final UserData user;

  BranchUserWithUser({
    required this.branchUser,
    required this.user,
  });
}