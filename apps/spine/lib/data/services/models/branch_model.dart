import 'package:spine/data/services/models/base_model.dart';
import 'package:spine/drift/database.dart';

class BranchMapper extends BaseModel {
  final String id;
  final String name;
  final String phone;
  final String streetAddress;
  final String city;
  final String state;
  final String country;

  final String collectionId;
  final String businessId;

  final String syncDate;
  final String syncStatus;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  BranchMapper({
    required this.id,
    required this.name,
    required this.phone,
    required this.streetAddress,
    required this.city,
    required this.state,
    required this.country,

    required this.collectionId,
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

  factory BranchMapper.fromJson(Map<String, dynamic> json) {
    return BranchMapper(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      streetAddress: json['street_address'] ?? '',
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      country: json['country'] ?? '',
      
      collectionId: json['collection_id'] ?? '',
      businessId: json['business_id'] ?? '',

      syncStatus: json['sync_status'] ?? '',
      syncDate: json['sync_date'] ?? '',

      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      deletedAt: json['deleted_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'phone': phone,
    'street_address': streetAddress,
    'city': city,
    'state': state,
    'country': country,

    'collection_id': collectionId,
    'business_id': businessId,

    'sync_status': syncStatus,
    'sync_date': syncDate,

    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };

  BranchData toData() {
    return BranchData(
      id: id,
      name: name,
      phone: phone,
      streetAddress: streetAddress,
      city: city,
      state: state,
      country: country,
      businessId: businessId,
      collectionId: collectionId.isEmpty ? null : collectionId,
      isHeadOffice: false, // Defaulting as it's not in the service model yet
      syncStatus: syncStatus,
      syncDate: DateTime.tryParse(syncDate),
      createdAt: DateTime.tryParse(createdAt ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(updatedAt ?? '') ?? DateTime.now(),
    );
  }
}