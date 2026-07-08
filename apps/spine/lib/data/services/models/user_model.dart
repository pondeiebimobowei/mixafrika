
import 'package:spine/data/services/models/base_model.dart';
import 'package:spine/drift/database.dart';

class User extends BaseModel{
  final String id;
  final String? avatar;
  final String? userName;
  final String firstName;
  final String lastName;
  final String email;
  final String password;
  final String role;
  final bool isEmailVerified;
  final bool isVerified;
  final int creditScore;
  final String creditScoreStaus;
  final String? syncDate;
  final String syncStatus;

  final String createdAt;
  final String updatedAt;
  final String? deletedAt;

  User({
    required this.id,
    required this.avatar,
    required this.userName,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
    required this.role,
    required this.isEmailVerified,
    required this.isVerified,
    required this.creditScore,
    required this.creditScoreStaus,
    required this.syncStatus,
    required this.syncDate,

    required this.createdAt,
    required this.updatedAt,
    required this.deletedAt,
  }): super(id: id, createdAt: createdAt, deletedAt: deletedAt, syncDate: syncDate, syncStatus: syncStatus, updatedAt: updatedAt);

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      avatar: json['avatar'] ?? '',
      userName: json['user_name'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      email: json['email'] ?? '',
      password: json['password'] ?? '',
      role: json['role'] ?? '',
      isEmailVerified: json['is_email_verified'] ?? false,
      isVerified: json['is_verified'] ?? false,
      creditScore: int.tryParse(json['credit_score'] ?? '0') ?? 0,
      creditScoreStaus: json['credit_score_staus'] ?? '',
      syncDate: json['sync_date'] ?? '',
      syncStatus: json['sync_status'] ?? '',
      
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      deletedAt: json['deleted_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'avatar': avatar,
    'user_name': userName, 
    'first_name': firstName,
    'last_name': lastName,
    'email': email,
    'password': password,
    'role': role,
    'is_email_verified': isEmailVerified,
    'is_verified': isVerified,
    'credit_score': creditScore,
    'credit_score_staus': creditScoreStaus,
    'sync_date': syncDate,
    'sync_status': syncStatus,

    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };

  UserData toData() {
    return UserData(
      id: id,
      avatar: avatar,
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: role,
      isEmailVerified: isEmailVerified,
      isVerified: isVerified,
      creditScore: int.tryParse(creditScore as String) ?? 0,
      creditScoreStatus: creditScoreStaus,
      syncStatus: syncStatus,
      syncDate: syncDate == null ? null : DateTime.tryParse(syncDate!),
      createdAt: DateTime.tryParse(createdAt) ?? DateTime.now(),
      updatedAt: DateTime.tryParse(updatedAt) ?? DateTime.now(),
      deletedAt: deletedAt == null ? null : DateTime.tryParse(deletedAt!),
    );
  }
}
