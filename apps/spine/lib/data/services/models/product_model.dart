import 'package:spine/data/services/models/base_model.dart';

class Product extends BaseModel {
  final String id;
  final String name;
  final String description;
  final String bulkUnitName;
  final String pieceUnitName;
  final int unitsPerBulk;
  final int costPrice;
  final int sellingPricePerPiece;
  final int sellingPricePerBulk;
  final String category;
  final String serialNumber;
  final String imageUrl;
  final String reviews;

  final String syncDate;
  final String syncStatus;

  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  Product({
    required this.id,
    // required this.userId,
    required this.name,
    required this.description,
    required this.bulkUnitName,
    required this.pieceUnitName,
    required this.unitsPerBulk,
    required this.costPrice,
    required this.sellingPricePerPiece,
    required this.sellingPricePerBulk,
    required this.category,
    required this.serialNumber,
    required this.imageUrl,
    required this.reviews,
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

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      bulkUnitName: json['bulk_unit_name'] ?? '',
      pieceUnitName: json['piece_unit_name'] ?? '',
      unitsPerBulk: json['units_per_bulk'] is int
          ? json['units_per_bulk']
          : int.tryParse(json['units_per_bulk']?.toString() ?? '') ?? 0,
      costPrice: json['cost_price'] is int
          ? json['cost_price']
          : int.tryParse(json['cost_price']?.toString() ?? '') ?? 0,
      sellingPricePerPiece: json['selling_price_per_piece'] is int
          ? json['selling_price_per_piece']
          : int.tryParse(json['selling_price_per_piece']?.toString() ?? '') ??
                0,
      sellingPricePerBulk: json['selling_price_per_bulk'] is int
          ? json['selling_price_per_bulk']
          : int.tryParse(json['selling_price_per_bulk']?.toString() ?? '') ?? 0,
      category: json['category'] ?? '',
      serialNumber: json['serial_number'] ?? '',
      imageUrl: json['image_url'] ?? '',
      reviews: json['reviews'] ?? '',
      syncDate: json['sync_date'] ?? '',
      syncStatus: json['sync_status'] ?? '',

      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      deletedAt: json['deleted_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'bulk_unit_name': bulkUnitName,
    'piece_unit_name': pieceUnitName,
    'units_per_bulk': unitsPerBulk,
    'cost_price': costPrice,
    'selling_price_per_piece': sellingPricePerPiece,
    'selling_price_per_bulk': sellingPricePerBulk,
    'category': category,
    'serial_number': serialNumber,
    'image_url': imageUrl,
    'reviews': reviews,
    'sync_date': syncDate,
    'sync_status': syncStatus,

    'created_at': createdAt,
    'updated_at': updatedAt,
    'deleted_at': deletedAt,
  };
}
