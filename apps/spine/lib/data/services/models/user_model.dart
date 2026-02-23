
import 'package:spine/data/services/models/base_model.dart';

class User extends BaseModel{
  final String id;
  final String image;
  final String userName;
  final String firstName;
  final String lastName;
  final String email;
  final String password;
  final String role;
  final bool isEmailVerified;
  final String creditScore;
  final String creditScoreStaus;
  final String? verification;
  final String? businessVerification;
  final String? trader;
  final String syncDate;
  final String syncStatus;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  User({
    required this.id,
    // required this.userId,
    required this.image,
    required this.userName,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
    required this.role,
    required this.isEmailVerified,
    required this.creditScore,
    required this.creditScoreStaus,
    required this.verification,
    required this.businessVerification,
    required this.trader,
    required this.syncStatus,
    required this.syncDate,

    required this.createdAt,
    required this.updatedAt,
    required this.deletedAt,
  }): super(id: id, createdAt: createdAt, deletedAt: deletedAt, syncDate: syncDate, syncStatus: syncStatus, updatedAt: updatedAt);

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      image: json['image'] ?? '',
      userName: json['user_name'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      email: json['email'] ?? '',
      password: json['password'] ?? '',
      role: json['role'] ?? '',
      isEmailVerified: json['is_email_verified'] ?? false,
      creditScore: json['credit_score'] ?? '',
      creditScoreStaus: json['credit_score_staus'] ?? '',
      verification: json['verification'] ?? '',
      businessVerification: json['business_verification'] ?? '',
      trader: json['trader'] ?? '',
      syncDate: json['sync_date'] ?? '',
      syncStatus: json['sync_status'] ?? '',
      
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      deletedAt: json['deleted_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'image': image,
    'user_name': userName,
    'first_name': firstName,
    'last_name': lastName,
    'email': email,
    'password': password,
    'role': role,
    'is_email_verified': isEmailVerified,
    'credit_score': creditScore,
    'credit_score_staus': creditScoreStaus,
    'verification': verification,
    'business_verification': businessVerification,
    'trader': trader,
    'sync_date': syncDate,
    'sync_status': syncStatus,

    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };
}
