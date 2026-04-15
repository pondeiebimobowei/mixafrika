import 'package:spine/data/services/models/base_model.dart';
import 'package:spine/drift/database.dart';

class BusinessMapper extends BaseModel {
  final String id;
  final String name;
  final String type;
  final String phone;
  final String streetAddress;
  final String city;
  final String state;
  final String country;
  final bool isVerified;

  final String syncDate;
  final String syncStatus;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  BusinessMapper({
    required this.id,
    required this.name,
    required this.type,
    required this.phone,
    required this.streetAddress,
    required this.city,
    required this.state,
    required this.country,
    required this.isVerified,

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

  factory BusinessMapper.fromJson(Map<String, dynamic> json) {
    return BusinessMapper(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      phone: json['phone'] ?? '',
      streetAddress: json['street_address'] ?? '',
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      country: json['country'] ?? '',
      isVerified: json['is_verified'] ?? false,

      syncStatus: json['sync_status'] ?? '',
      syncDate: json['sync_date'] ?? '',

      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      deletedAt: json['deleted_at'] ?? '',
    );
  }

  /// Mapper → Drift Data
  BusinessesData toData() {
    return BusinessesData(
      id: id,
      name: name,
      type: type,
      phone: phone,
      streetAddress: streetAddress,
      city: city,
      state: state,
      country: country,
      isVerified: isVerified,
      syncStatus: syncStatus,
      // syncDate: DateTime.parse(syncDate),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      // deletedAt: DateTime.parse(deletedAt!),
    );
  }


  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'type': type,
    'phone': phone,
    'street_address': streetAddress,
    'city': city,
    'state': state,
    'country': country,
    'is_verified': isVerified,

    'sync_status': syncStatus,
    'sync_date': syncDate,

    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };
}
