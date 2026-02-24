
import 'package:spine/data/services/models/base_model.dart';

class UserBusiness extends BaseModel{
  final String id;
  final String userId;
  final String collectionId;
  final String name;
  final String type;
  final String phone;
  final String streetAddress;
  final String city;
  final String state;
  final String country;
  final String verification;

  final String syncDate;
  final String syncStatus;


  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  UserBusiness({
    required this.id,
    required this.userId,
    required this.collectionId,
    required this.name,
    required this.type,
    required this.phone,
    required this.streetAddress,
    required this.city,
    required this.state,
    required this.country,
    required this.verification,
    
    required this.syncStatus,
    required this.syncDate,


    required this.createdAt,
    required this.updatedAt,
    required this.deletedAt,
  }): super(id: id, createdAt: createdAt, deletedAt: deletedAt, syncDate: syncDate, syncStatus: syncStatus, updatedAt: updatedAt);

  factory UserBusiness.fromJson(Map<String, dynamic> json) {
    return UserBusiness(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      collectionId: json['collection_id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      phone: json['phone'] ?? '',
      streetAddress: json['street_address'] ?? '',
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      country: json['country'] ?? '',
      verification: json['verification'] ?? '',
      
      syncStatus: json['sync_status'] ?? '',
      syncDate: json['sync_date'] ?? '',

      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      deletedAt: json['deleted_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'user_id': userId,
    'collection_id': collectionId,
    'name': name,
    'type': type,
    'phone': phone,
    'street_address': streetAddress,
    'city': city,
    'state': state,
    'country': country,
    'verification': verification,

    'sync_status': syncStatus,
    'sync_date': syncDate,

    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };
}
