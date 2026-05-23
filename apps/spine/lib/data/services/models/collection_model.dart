import 'package:spine/data/services/models/base_model.dart';
import 'package:spine/drift/database.dart';

class CollectionModel extends BaseModel {
  final String id;
  final String name;
  final String description;
  final int totalTraders;
  final String about;
  final String coverImage;
  final String roi;
  final String minInvestment;
  final String city;
  final String state;
  final String country;

  final String syncStatus;
  final String syncDate;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  CollectionModel({
    required this.id,
    required this.name,
    required this.description,
    required this.totalTraders,
    required this.about,
    required this.coverImage,
    required this.roi,
    required this.minInvestment,
    required this.city,
    required this.state,
    required this.country,
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

  factory CollectionModel.fromJson(Map<String, dynamic> json) {
    return CollectionModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      totalTraders: json['total_traders'] ?? 0,
      about: json['about'] ?? '',
      coverImage: json['cover_image'] ?? '',
      roi: json['roi'] ?? '0',
      minInvestment: (json['min_investment']) ?? 0,
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      country: json['country'] ?? '',
      syncStatus: json['sync_status'] ?? '',
      syncDate: json['sync_date'] ?? '',
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      deletedAt: json['deleted_at'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'total_traders': totalTraders,
    'about': about,
    'cover_image': coverImage,
    'roi': roi,
    'min_investment': minInvestment,
    'city': city,
    'state': state,
    'country': country,
    'sync_status': syncStatus,
    'sync_date': syncDate,
    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };

  CollectionData toData() {
    return CollectionData(
      id: id,
      name: name,
      description: description,
      totalTraders: totalTraders,
      about: about,
      coverImage: coverImage,
      roi: int.tryParse(roi) ?? 0,
      minInvestment: int.tryParse(minInvestment) ?? 0,
      city: city,
      state: state,
      country: country,
      syncStatus: syncStatus,
      syncDate: DateTime.tryParse(syncDate),
      createdAt: DateTime.tryParse(createdAt ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(updatedAt ?? '') ?? DateTime.now(),
    );
  }
}
