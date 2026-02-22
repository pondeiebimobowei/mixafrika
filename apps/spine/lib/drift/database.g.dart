// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// ignore_for_file: type=lint
class $ProductTable extends Product with TableInfo<$ProductTable, ProductData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ProductTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncStatusMeta = const VerificationMeta(
    'syncStatus',
  );
  @override
  late final GeneratedColumn<String> syncStatus = GeneratedColumn<String>(
    'sync_status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _syncDateMeta = const VerificationMeta(
    'syncDate',
  );
  @override
  late final GeneratedColumn<DateTime> syncDate = GeneratedColumn<DateTime>(
    'sync_date',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
    defaultValue: currentDateAndTime,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
    defaultValue: currentDateAndTime,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
    defaultValue: currentDateAndTime,
  );
  static const VerificationMeta _deletedAtMeta = const VerificationMeta(
    'deletedAt',
  );
  @override
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
    'deleted_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
    defaultValue: currentDateAndTime,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _bulkUnitNameMeta = const VerificationMeta(
    'bulkUnitName',
  );
  @override
  late final GeneratedColumn<String> bulkUnitName = GeneratedColumn<String>(
    'bulk_unit_name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _pieceUnitNameMeta = const VerificationMeta(
    'pieceUnitName',
  );
  @override
  late final GeneratedColumn<String> pieceUnitName = GeneratedColumn<String>(
    'piece_unit_name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _unitsPerBulkMeta = const VerificationMeta(
    'unitsPerBulk',
  );
  @override
  late final GeneratedColumn<String> unitsPerBulk = GeneratedColumn<String>(
    'units_per_bulk',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _costPricePerPieceMeta = const VerificationMeta(
    'costPricePerPiece',
  );
  @override
  late final GeneratedColumn<String> costPricePerPiece =
      GeneratedColumn<String>(
        'cost_price_per_piece',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      );
  static const VerificationMeta _sellingPricePerPieceMeta =
      const VerificationMeta('sellingPricePerPiece');
  @override
  late final GeneratedColumn<String> sellingPricePerPiece =
      GeneratedColumn<String>(
        'selling_price_per_piece',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      );
  static const VerificationMeta _sellingPricePerBulkMeta =
      const VerificationMeta('sellingPricePerBulk');
  @override
  late final GeneratedColumn<String> sellingPricePerBulk =
      GeneratedColumn<String>(
        'selling_price_per_bulk',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      );
  static const VerificationMeta _categoryMeta = const VerificationMeta(
    'category',
  );
  @override
  late final GeneratedColumn<String> category = GeneratedColumn<String>(
    'category',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _serialNumberMeta = const VerificationMeta(
    'serialNumber',
  );
  @override
  late final GeneratedColumn<String> serialNumber = GeneratedColumn<String>(
    'serial_number',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _stockBalancesMeta = const VerificationMeta(
    'stockBalances',
  );
  @override
  late final GeneratedColumn<String> stockBalances = GeneratedColumn<String>(
    'stock_balances',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _batchesMeta = const VerificationMeta(
    'batches',
  );
  @override
  late final GeneratedColumn<String> batches = GeneratedColumn<String>(
    'batches',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _bulkQuantityMeta = const VerificationMeta(
    'bulkQuantity',
  );
  @override
  late final GeneratedColumn<String> bulkQuantity = GeneratedColumn<String>(
    'bulk_quantity',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _pieceQuantityMeta = const VerificationMeta(
    'pieceQuantity',
  );
  @override
  late final GeneratedColumn<String> pieceQuantity = GeneratedColumn<String>(
    'piece_quantity',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _imageUrlMeta = const VerificationMeta(
    'imageUrl',
  );
  @override
  late final GeneratedColumn<String> imageUrl = GeneratedColumn<String>(
    'image_url',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _imagesMeta = const VerificationMeta('images');
  @override
  late final GeneratedColumn<String> images = GeneratedColumn<String>(
    'images',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _reviewsMeta = const VerificationMeta(
    'reviews',
  );
  @override
  late final GeneratedColumn<String> reviews = GeneratedColumn<String>(
    'reviews',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    syncStatus,
    syncDate,
    createdAt,
    updatedAt,
    deletedAt,
    name,
    bulkUnitName,
    pieceUnitName,
    unitsPerBulk,
    costPricePerPiece,
    sellingPricePerPiece,
    sellingPricePerBulk,
    category,
    serialNumber,
    stockBalances,
    batches,
    bulkQuantity,
    pieceQuantity,
    imageUrl,
    images,
    reviews,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'product';
  @override
  VerificationContext validateIntegrity(
    Insertable<ProductData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('sync_status')) {
      context.handle(
        _syncStatusMeta,
        syncStatus.isAcceptableOrUnknown(data['sync_status']!, _syncStatusMeta),
      );
    } else if (isInserting) {
      context.missing(_syncStatusMeta);
    }
    if (data.containsKey('sync_date')) {
      context.handle(
        _syncDateMeta,
        syncDate.isAcceptableOrUnknown(data['sync_date']!, _syncDateMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    }
    if (data.containsKey('deleted_at')) {
      context.handle(
        _deletedAtMeta,
        deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta),
      );
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('bulk_unit_name')) {
      context.handle(
        _bulkUnitNameMeta,
        bulkUnitName.isAcceptableOrUnknown(
          data['bulk_unit_name']!,
          _bulkUnitNameMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_bulkUnitNameMeta);
    }
    if (data.containsKey('piece_unit_name')) {
      context.handle(
        _pieceUnitNameMeta,
        pieceUnitName.isAcceptableOrUnknown(
          data['piece_unit_name']!,
          _pieceUnitNameMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_pieceUnitNameMeta);
    }
    if (data.containsKey('units_per_bulk')) {
      context.handle(
        _unitsPerBulkMeta,
        unitsPerBulk.isAcceptableOrUnknown(
          data['units_per_bulk']!,
          _unitsPerBulkMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_unitsPerBulkMeta);
    }
    if (data.containsKey('cost_price_per_piece')) {
      context.handle(
        _costPricePerPieceMeta,
        costPricePerPiece.isAcceptableOrUnknown(
          data['cost_price_per_piece']!,
          _costPricePerPieceMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_costPricePerPieceMeta);
    }
    if (data.containsKey('selling_price_per_piece')) {
      context.handle(
        _sellingPricePerPieceMeta,
        sellingPricePerPiece.isAcceptableOrUnknown(
          data['selling_price_per_piece']!,
          _sellingPricePerPieceMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_sellingPricePerPieceMeta);
    }
    if (data.containsKey('selling_price_per_bulk')) {
      context.handle(
        _sellingPricePerBulkMeta,
        sellingPricePerBulk.isAcceptableOrUnknown(
          data['selling_price_per_bulk']!,
          _sellingPricePerBulkMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_sellingPricePerBulkMeta);
    }
    if (data.containsKey('category')) {
      context.handle(
        _categoryMeta,
        category.isAcceptableOrUnknown(data['category']!, _categoryMeta),
      );
    } else if (isInserting) {
      context.missing(_categoryMeta);
    }
    if (data.containsKey('serial_number')) {
      context.handle(
        _serialNumberMeta,
        serialNumber.isAcceptableOrUnknown(
          data['serial_number']!,
          _serialNumberMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_serialNumberMeta);
    }
    if (data.containsKey('stock_balances')) {
      context.handle(
        _stockBalancesMeta,
        stockBalances.isAcceptableOrUnknown(
          data['stock_balances']!,
          _stockBalancesMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_stockBalancesMeta);
    }
    if (data.containsKey('batches')) {
      context.handle(
        _batchesMeta,
        batches.isAcceptableOrUnknown(data['batches']!, _batchesMeta),
      );
    } else if (isInserting) {
      context.missing(_batchesMeta);
    }
    if (data.containsKey('bulk_quantity')) {
      context.handle(
        _bulkQuantityMeta,
        bulkQuantity.isAcceptableOrUnknown(
          data['bulk_quantity']!,
          _bulkQuantityMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_bulkQuantityMeta);
    }
    if (data.containsKey('piece_quantity')) {
      context.handle(
        _pieceQuantityMeta,
        pieceQuantity.isAcceptableOrUnknown(
          data['piece_quantity']!,
          _pieceQuantityMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_pieceQuantityMeta);
    }
    if (data.containsKey('image_url')) {
      context.handle(
        _imageUrlMeta,
        imageUrl.isAcceptableOrUnknown(data['image_url']!, _imageUrlMeta),
      );
    } else if (isInserting) {
      context.missing(_imageUrlMeta);
    }
    if (data.containsKey('images')) {
      context.handle(
        _imagesMeta,
        images.isAcceptableOrUnknown(data['images']!, _imagesMeta),
      );
    } else if (isInserting) {
      context.missing(_imagesMeta);
    }
    if (data.containsKey('reviews')) {
      context.handle(
        _reviewsMeta,
        reviews.isAcceptableOrUnknown(data['reviews']!, _reviewsMeta),
      );
    } else if (isInserting) {
      context.missing(_reviewsMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => const {};
  @override
  ProductData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ProductData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      syncStatus: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_status'],
      )!,
      syncDate: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}sync_date'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      deletedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}deleted_at'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      bulkUnitName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}bulk_unit_name'],
      )!,
      pieceUnitName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}piece_unit_name'],
      )!,
      unitsPerBulk: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}units_per_bulk'],
      )!,
      costPricePerPiece: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}cost_price_per_piece'],
      )!,
      sellingPricePerPiece: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}selling_price_per_piece'],
      )!,
      sellingPricePerBulk: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}selling_price_per_bulk'],
      )!,
      category: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}category'],
      )!,
      serialNumber: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}serial_number'],
      )!,
      stockBalances: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}stock_balances'],
      )!,
      batches: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}batches'],
      )!,
      bulkQuantity: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}bulk_quantity'],
      )!,
      pieceQuantity: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}piece_quantity'],
      )!,
      imageUrl: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}image_url'],
      )!,
      images: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}images'],
      )!,
      reviews: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}reviews'],
      )!,
    );
  }

  @override
  $ProductTable createAlias(String alias) {
    return $ProductTable(attachedDatabase, alias);
  }
}

class ProductData extends DataClass implements Insertable<ProductData> {
  final String id;
  final String syncStatus;
  final DateTime syncDate;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime deletedAt;
  final String name;
  final String bulkUnitName;
  final String pieceUnitName;
  final String unitsPerBulk;
  final String costPricePerPiece;
  final String sellingPricePerPiece;
  final String sellingPricePerBulk;
  final String category;
  final String serialNumber;
  final String stockBalances;
  final String batches;
  final String bulkQuantity;
  final String pieceQuantity;
  final String imageUrl;
  final String images;
  final String reviews;
  const ProductData({
    required this.id,
    required this.syncStatus,
    required this.syncDate,
    required this.createdAt,
    required this.updatedAt,
    required this.deletedAt,
    required this.name,
    required this.bulkUnitName,
    required this.pieceUnitName,
    required this.unitsPerBulk,
    required this.costPricePerPiece,
    required this.sellingPricePerPiece,
    required this.sellingPricePerBulk,
    required this.category,
    required this.serialNumber,
    required this.stockBalances,
    required this.batches,
    required this.bulkQuantity,
    required this.pieceQuantity,
    required this.imageUrl,
    required this.images,
    required this.reviews,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['sync_status'] = Variable<String>(syncStatus);
    map['sync_date'] = Variable<DateTime>(syncDate);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['deleted_at'] = Variable<DateTime>(deletedAt);
    map['name'] = Variable<String>(name);
    map['bulk_unit_name'] = Variable<String>(bulkUnitName);
    map['piece_unit_name'] = Variable<String>(pieceUnitName);
    map['units_per_bulk'] = Variable<String>(unitsPerBulk);
    map['cost_price_per_piece'] = Variable<String>(costPricePerPiece);
    map['selling_price_per_piece'] = Variable<String>(sellingPricePerPiece);
    map['selling_price_per_bulk'] = Variable<String>(sellingPricePerBulk);
    map['category'] = Variable<String>(category);
    map['serial_number'] = Variable<String>(serialNumber);
    map['stock_balances'] = Variable<String>(stockBalances);
    map['batches'] = Variable<String>(batches);
    map['bulk_quantity'] = Variable<String>(bulkQuantity);
    map['piece_quantity'] = Variable<String>(pieceQuantity);
    map['image_url'] = Variable<String>(imageUrl);
    map['images'] = Variable<String>(images);
    map['reviews'] = Variable<String>(reviews);
    return map;
  }

  ProductCompanion toCompanion(bool nullToAbsent) {
    return ProductCompanion(
      id: Value(id),
      syncStatus: Value(syncStatus),
      syncDate: Value(syncDate),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      deletedAt: Value(deletedAt),
      name: Value(name),
      bulkUnitName: Value(bulkUnitName),
      pieceUnitName: Value(pieceUnitName),
      unitsPerBulk: Value(unitsPerBulk),
      costPricePerPiece: Value(costPricePerPiece),
      sellingPricePerPiece: Value(sellingPricePerPiece),
      sellingPricePerBulk: Value(sellingPricePerBulk),
      category: Value(category),
      serialNumber: Value(serialNumber),
      stockBalances: Value(stockBalances),
      batches: Value(batches),
      bulkQuantity: Value(bulkQuantity),
      pieceQuantity: Value(pieceQuantity),
      imageUrl: Value(imageUrl),
      images: Value(images),
      reviews: Value(reviews),
    );
  }

  factory ProductData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ProductData(
      id: serializer.fromJson<String>(json['id']),
      syncStatus: serializer.fromJson<String>(json['syncStatus']),
      syncDate: serializer.fromJson<DateTime>(json['syncDate']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      deletedAt: serializer.fromJson<DateTime>(json['deletedAt']),
      name: serializer.fromJson<String>(json['name']),
      bulkUnitName: serializer.fromJson<String>(json['bulkUnitName']),
      pieceUnitName: serializer.fromJson<String>(json['pieceUnitName']),
      unitsPerBulk: serializer.fromJson<String>(json['unitsPerBulk']),
      costPricePerPiece: serializer.fromJson<String>(json['costPricePerPiece']),
      sellingPricePerPiece: serializer.fromJson<String>(
        json['sellingPricePerPiece'],
      ),
      sellingPricePerBulk: serializer.fromJson<String>(
        json['sellingPricePerBulk'],
      ),
      category: serializer.fromJson<String>(json['category']),
      serialNumber: serializer.fromJson<String>(json['serialNumber']),
      stockBalances: serializer.fromJson<String>(json['stockBalances']),
      batches: serializer.fromJson<String>(json['batches']),
      bulkQuantity: serializer.fromJson<String>(json['bulkQuantity']),
      pieceQuantity: serializer.fromJson<String>(json['pieceQuantity']),
      imageUrl: serializer.fromJson<String>(json['imageUrl']),
      images: serializer.fromJson<String>(json['images']),
      reviews: serializer.fromJson<String>(json['reviews']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'syncStatus': serializer.toJson<String>(syncStatus),
      'syncDate': serializer.toJson<DateTime>(syncDate),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'deletedAt': serializer.toJson<DateTime>(deletedAt),
      'name': serializer.toJson<String>(name),
      'bulkUnitName': serializer.toJson<String>(bulkUnitName),
      'pieceUnitName': serializer.toJson<String>(pieceUnitName),
      'unitsPerBulk': serializer.toJson<String>(unitsPerBulk),
      'costPricePerPiece': serializer.toJson<String>(costPricePerPiece),
      'sellingPricePerPiece': serializer.toJson<String>(sellingPricePerPiece),
      'sellingPricePerBulk': serializer.toJson<String>(sellingPricePerBulk),
      'category': serializer.toJson<String>(category),
      'serialNumber': serializer.toJson<String>(serialNumber),
      'stockBalances': serializer.toJson<String>(stockBalances),
      'batches': serializer.toJson<String>(batches),
      'bulkQuantity': serializer.toJson<String>(bulkQuantity),
      'pieceQuantity': serializer.toJson<String>(pieceQuantity),
      'imageUrl': serializer.toJson<String>(imageUrl),
      'images': serializer.toJson<String>(images),
      'reviews': serializer.toJson<String>(reviews),
    };
  }

  ProductData copyWith({
    String? id,
    String? syncStatus,
    DateTime? syncDate,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
    String? name,
    String? bulkUnitName,
    String? pieceUnitName,
    String? unitsPerBulk,
    String? costPricePerPiece,
    String? sellingPricePerPiece,
    String? sellingPricePerBulk,
    String? category,
    String? serialNumber,
    String? stockBalances,
    String? batches,
    String? bulkQuantity,
    String? pieceQuantity,
    String? imageUrl,
    String? images,
    String? reviews,
  }) => ProductData(
    id: id ?? this.id,
    syncStatus: syncStatus ?? this.syncStatus,
    syncDate: syncDate ?? this.syncDate,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    deletedAt: deletedAt ?? this.deletedAt,
    name: name ?? this.name,
    bulkUnitName: bulkUnitName ?? this.bulkUnitName,
    pieceUnitName: pieceUnitName ?? this.pieceUnitName,
    unitsPerBulk: unitsPerBulk ?? this.unitsPerBulk,
    costPricePerPiece: costPricePerPiece ?? this.costPricePerPiece,
    sellingPricePerPiece: sellingPricePerPiece ?? this.sellingPricePerPiece,
    sellingPricePerBulk: sellingPricePerBulk ?? this.sellingPricePerBulk,
    category: category ?? this.category,
    serialNumber: serialNumber ?? this.serialNumber,
    stockBalances: stockBalances ?? this.stockBalances,
    batches: batches ?? this.batches,
    bulkQuantity: bulkQuantity ?? this.bulkQuantity,
    pieceQuantity: pieceQuantity ?? this.pieceQuantity,
    imageUrl: imageUrl ?? this.imageUrl,
    images: images ?? this.images,
    reviews: reviews ?? this.reviews,
  );
  ProductData copyWithCompanion(ProductCompanion data) {
    return ProductData(
      id: data.id.present ? data.id.value : this.id,
      syncStatus: data.syncStatus.present
          ? data.syncStatus.value
          : this.syncStatus,
      syncDate: data.syncDate.present ? data.syncDate.value : this.syncDate,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      deletedAt: data.deletedAt.present ? data.deletedAt.value : this.deletedAt,
      name: data.name.present ? data.name.value : this.name,
      bulkUnitName: data.bulkUnitName.present
          ? data.bulkUnitName.value
          : this.bulkUnitName,
      pieceUnitName: data.pieceUnitName.present
          ? data.pieceUnitName.value
          : this.pieceUnitName,
      unitsPerBulk: data.unitsPerBulk.present
          ? data.unitsPerBulk.value
          : this.unitsPerBulk,
      costPricePerPiece: data.costPricePerPiece.present
          ? data.costPricePerPiece.value
          : this.costPricePerPiece,
      sellingPricePerPiece: data.sellingPricePerPiece.present
          ? data.sellingPricePerPiece.value
          : this.sellingPricePerPiece,
      sellingPricePerBulk: data.sellingPricePerBulk.present
          ? data.sellingPricePerBulk.value
          : this.sellingPricePerBulk,
      category: data.category.present ? data.category.value : this.category,
      serialNumber: data.serialNumber.present
          ? data.serialNumber.value
          : this.serialNumber,
      stockBalances: data.stockBalances.present
          ? data.stockBalances.value
          : this.stockBalances,
      batches: data.batches.present ? data.batches.value : this.batches,
      bulkQuantity: data.bulkQuantity.present
          ? data.bulkQuantity.value
          : this.bulkQuantity,
      pieceQuantity: data.pieceQuantity.present
          ? data.pieceQuantity.value
          : this.pieceQuantity,
      imageUrl: data.imageUrl.present ? data.imageUrl.value : this.imageUrl,
      images: data.images.present ? data.images.value : this.images,
      reviews: data.reviews.present ? data.reviews.value : this.reviews,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ProductData(')
          ..write('id: $id, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('syncDate: $syncDate, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('name: $name, ')
          ..write('bulkUnitName: $bulkUnitName, ')
          ..write('pieceUnitName: $pieceUnitName, ')
          ..write('unitsPerBulk: $unitsPerBulk, ')
          ..write('costPricePerPiece: $costPricePerPiece, ')
          ..write('sellingPricePerPiece: $sellingPricePerPiece, ')
          ..write('sellingPricePerBulk: $sellingPricePerBulk, ')
          ..write('category: $category, ')
          ..write('serialNumber: $serialNumber, ')
          ..write('stockBalances: $stockBalances, ')
          ..write('batches: $batches, ')
          ..write('bulkQuantity: $bulkQuantity, ')
          ..write('pieceQuantity: $pieceQuantity, ')
          ..write('imageUrl: $imageUrl, ')
          ..write('images: $images, ')
          ..write('reviews: $reviews')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hashAll([
    id,
    syncStatus,
    syncDate,
    createdAt,
    updatedAt,
    deletedAt,
    name,
    bulkUnitName,
    pieceUnitName,
    unitsPerBulk,
    costPricePerPiece,
    sellingPricePerPiece,
    sellingPricePerBulk,
    category,
    serialNumber,
    stockBalances,
    batches,
    bulkQuantity,
    pieceQuantity,
    imageUrl,
    images,
    reviews,
  ]);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ProductData &&
          other.id == this.id &&
          other.syncStatus == this.syncStatus &&
          other.syncDate == this.syncDate &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.deletedAt == this.deletedAt &&
          other.name == this.name &&
          other.bulkUnitName == this.bulkUnitName &&
          other.pieceUnitName == this.pieceUnitName &&
          other.unitsPerBulk == this.unitsPerBulk &&
          other.costPricePerPiece == this.costPricePerPiece &&
          other.sellingPricePerPiece == this.sellingPricePerPiece &&
          other.sellingPricePerBulk == this.sellingPricePerBulk &&
          other.category == this.category &&
          other.serialNumber == this.serialNumber &&
          other.stockBalances == this.stockBalances &&
          other.batches == this.batches &&
          other.bulkQuantity == this.bulkQuantity &&
          other.pieceQuantity == this.pieceQuantity &&
          other.imageUrl == this.imageUrl &&
          other.images == this.images &&
          other.reviews == this.reviews);
}

class ProductCompanion extends UpdateCompanion<ProductData> {
  final Value<String> id;
  final Value<String> syncStatus;
  final Value<DateTime> syncDate;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime> deletedAt;
  final Value<String> name;
  final Value<String> bulkUnitName;
  final Value<String> pieceUnitName;
  final Value<String> unitsPerBulk;
  final Value<String> costPricePerPiece;
  final Value<String> sellingPricePerPiece;
  final Value<String> sellingPricePerBulk;
  final Value<String> category;
  final Value<String> serialNumber;
  final Value<String> stockBalances;
  final Value<String> batches;
  final Value<String> bulkQuantity;
  final Value<String> pieceQuantity;
  final Value<String> imageUrl;
  final Value<String> images;
  final Value<String> reviews;
  final Value<int> rowid;
  const ProductCompanion({
    this.id = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.syncDate = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.name = const Value.absent(),
    this.bulkUnitName = const Value.absent(),
    this.pieceUnitName = const Value.absent(),
    this.unitsPerBulk = const Value.absent(),
    this.costPricePerPiece = const Value.absent(),
    this.sellingPricePerPiece = const Value.absent(),
    this.sellingPricePerBulk = const Value.absent(),
    this.category = const Value.absent(),
    this.serialNumber = const Value.absent(),
    this.stockBalances = const Value.absent(),
    this.batches = const Value.absent(),
    this.bulkQuantity = const Value.absent(),
    this.pieceQuantity = const Value.absent(),
    this.imageUrl = const Value.absent(),
    this.images = const Value.absent(),
    this.reviews = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ProductCompanion.insert({
    required String id,
    required String syncStatus,
    this.syncDate = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.deletedAt = const Value.absent(),
    required String name,
    required String bulkUnitName,
    required String pieceUnitName,
    required String unitsPerBulk,
    required String costPricePerPiece,
    required String sellingPricePerPiece,
    required String sellingPricePerBulk,
    required String category,
    required String serialNumber,
    required String stockBalances,
    required String batches,
    required String bulkQuantity,
    required String pieceQuantity,
    required String imageUrl,
    required String images,
    required String reviews,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       syncStatus = Value(syncStatus),
       name = Value(name),
       bulkUnitName = Value(bulkUnitName),
       pieceUnitName = Value(pieceUnitName),
       unitsPerBulk = Value(unitsPerBulk),
       costPricePerPiece = Value(costPricePerPiece),
       sellingPricePerPiece = Value(sellingPricePerPiece),
       sellingPricePerBulk = Value(sellingPricePerBulk),
       category = Value(category),
       serialNumber = Value(serialNumber),
       stockBalances = Value(stockBalances),
       batches = Value(batches),
       bulkQuantity = Value(bulkQuantity),
       pieceQuantity = Value(pieceQuantity),
       imageUrl = Value(imageUrl),
       images = Value(images),
       reviews = Value(reviews);
  static Insertable<ProductData> custom({
    Expression<String>? id,
    Expression<String>? syncStatus,
    Expression<DateTime>? syncDate,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? deletedAt,
    Expression<String>? name,
    Expression<String>? bulkUnitName,
    Expression<String>? pieceUnitName,
    Expression<String>? unitsPerBulk,
    Expression<String>? costPricePerPiece,
    Expression<String>? sellingPricePerPiece,
    Expression<String>? sellingPricePerBulk,
    Expression<String>? category,
    Expression<String>? serialNumber,
    Expression<String>? stockBalances,
    Expression<String>? batches,
    Expression<String>? bulkQuantity,
    Expression<String>? pieceQuantity,
    Expression<String>? imageUrl,
    Expression<String>? images,
    Expression<String>? reviews,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (syncDate != null) 'sync_date': syncDate,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (name != null) 'name': name,
      if (bulkUnitName != null) 'bulk_unit_name': bulkUnitName,
      if (pieceUnitName != null) 'piece_unit_name': pieceUnitName,
      if (unitsPerBulk != null) 'units_per_bulk': unitsPerBulk,
      if (costPricePerPiece != null) 'cost_price_per_piece': costPricePerPiece,
      if (sellingPricePerPiece != null)
        'selling_price_per_piece': sellingPricePerPiece,
      if (sellingPricePerBulk != null)
        'selling_price_per_bulk': sellingPricePerBulk,
      if (category != null) 'category': category,
      if (serialNumber != null) 'serial_number': serialNumber,
      if (stockBalances != null) 'stock_balances': stockBalances,
      if (batches != null) 'batches': batches,
      if (bulkQuantity != null) 'bulk_quantity': bulkQuantity,
      if (pieceQuantity != null) 'piece_quantity': pieceQuantity,
      if (imageUrl != null) 'image_url': imageUrl,
      if (images != null) 'images': images,
      if (reviews != null) 'reviews': reviews,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ProductCompanion copyWith({
    Value<String>? id,
    Value<String>? syncStatus,
    Value<DateTime>? syncDate,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime>? deletedAt,
    Value<String>? name,
    Value<String>? bulkUnitName,
    Value<String>? pieceUnitName,
    Value<String>? unitsPerBulk,
    Value<String>? costPricePerPiece,
    Value<String>? sellingPricePerPiece,
    Value<String>? sellingPricePerBulk,
    Value<String>? category,
    Value<String>? serialNumber,
    Value<String>? stockBalances,
    Value<String>? batches,
    Value<String>? bulkQuantity,
    Value<String>? pieceQuantity,
    Value<String>? imageUrl,
    Value<String>? images,
    Value<String>? reviews,
    Value<int>? rowid,
  }) {
    return ProductCompanion(
      id: id ?? this.id,
      syncStatus: syncStatus ?? this.syncStatus,
      syncDate: syncDate ?? this.syncDate,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
      name: name ?? this.name,
      bulkUnitName: bulkUnitName ?? this.bulkUnitName,
      pieceUnitName: pieceUnitName ?? this.pieceUnitName,
      unitsPerBulk: unitsPerBulk ?? this.unitsPerBulk,
      costPricePerPiece: costPricePerPiece ?? this.costPricePerPiece,
      sellingPricePerPiece: sellingPricePerPiece ?? this.sellingPricePerPiece,
      sellingPricePerBulk: sellingPricePerBulk ?? this.sellingPricePerBulk,
      category: category ?? this.category,
      serialNumber: serialNumber ?? this.serialNumber,
      stockBalances: stockBalances ?? this.stockBalances,
      batches: batches ?? this.batches,
      bulkQuantity: bulkQuantity ?? this.bulkQuantity,
      pieceQuantity: pieceQuantity ?? this.pieceQuantity,
      imageUrl: imageUrl ?? this.imageUrl,
      images: images ?? this.images,
      reviews: reviews ?? this.reviews,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<String>(syncStatus.value);
    }
    if (syncDate.present) {
      map['sync_date'] = Variable<DateTime>(syncDate.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (bulkUnitName.present) {
      map['bulk_unit_name'] = Variable<String>(bulkUnitName.value);
    }
    if (pieceUnitName.present) {
      map['piece_unit_name'] = Variable<String>(pieceUnitName.value);
    }
    if (unitsPerBulk.present) {
      map['units_per_bulk'] = Variable<String>(unitsPerBulk.value);
    }
    if (costPricePerPiece.present) {
      map['cost_price_per_piece'] = Variable<String>(costPricePerPiece.value);
    }
    if (sellingPricePerPiece.present) {
      map['selling_price_per_piece'] = Variable<String>(
        sellingPricePerPiece.value,
      );
    }
    if (sellingPricePerBulk.present) {
      map['selling_price_per_bulk'] = Variable<String>(
        sellingPricePerBulk.value,
      );
    }
    if (category.present) {
      map['category'] = Variable<String>(category.value);
    }
    if (serialNumber.present) {
      map['serial_number'] = Variable<String>(serialNumber.value);
    }
    if (stockBalances.present) {
      map['stock_balances'] = Variable<String>(stockBalances.value);
    }
    if (batches.present) {
      map['batches'] = Variable<String>(batches.value);
    }
    if (bulkQuantity.present) {
      map['bulk_quantity'] = Variable<String>(bulkQuantity.value);
    }
    if (pieceQuantity.present) {
      map['piece_quantity'] = Variable<String>(pieceQuantity.value);
    }
    if (imageUrl.present) {
      map['image_url'] = Variable<String>(imageUrl.value);
    }
    if (images.present) {
      map['images'] = Variable<String>(images.value);
    }
    if (reviews.present) {
      map['reviews'] = Variable<String>(reviews.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ProductCompanion(')
          ..write('id: $id, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('syncDate: $syncDate, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('name: $name, ')
          ..write('bulkUnitName: $bulkUnitName, ')
          ..write('pieceUnitName: $pieceUnitName, ')
          ..write('unitsPerBulk: $unitsPerBulk, ')
          ..write('costPricePerPiece: $costPricePerPiece, ')
          ..write('sellingPricePerPiece: $sellingPricePerPiece, ')
          ..write('sellingPricePerBulk: $sellingPricePerBulk, ')
          ..write('category: $category, ')
          ..write('serialNumber: $serialNumber, ')
          ..write('stockBalances: $stockBalances, ')
          ..write('batches: $batches, ')
          ..write('bulkQuantity: $bulkQuantity, ')
          ..write('pieceQuantity: $pieceQuantity, ')
          ..write('imageUrl: $imageUrl, ')
          ..write('images: $images, ')
          ..write('reviews: $reviews, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $ProductTable product = $ProductTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [product];
}

typedef $$ProductTableCreateCompanionBuilder =
    ProductCompanion Function({
      required String id,
      required String syncStatus,
      Value<DateTime> syncDate,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime> deletedAt,
      required String name,
      required String bulkUnitName,
      required String pieceUnitName,
      required String unitsPerBulk,
      required String costPricePerPiece,
      required String sellingPricePerPiece,
      required String sellingPricePerBulk,
      required String category,
      required String serialNumber,
      required String stockBalances,
      required String batches,
      required String bulkQuantity,
      required String pieceQuantity,
      required String imageUrl,
      required String images,
      required String reviews,
      Value<int> rowid,
    });
typedef $$ProductTableUpdateCompanionBuilder =
    ProductCompanion Function({
      Value<String> id,
      Value<String> syncStatus,
      Value<DateTime> syncDate,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime> deletedAt,
      Value<String> name,
      Value<String> bulkUnitName,
      Value<String> pieceUnitName,
      Value<String> unitsPerBulk,
      Value<String> costPricePerPiece,
      Value<String> sellingPricePerPiece,
      Value<String> sellingPricePerBulk,
      Value<String> category,
      Value<String> serialNumber,
      Value<String> stockBalances,
      Value<String> batches,
      Value<String> bulkQuantity,
      Value<String> pieceQuantity,
      Value<String> imageUrl,
      Value<String> images,
      Value<String> reviews,
      Value<int> rowid,
    });

class $$ProductTableFilterComposer
    extends Composer<_$AppDatabase, $ProductTable> {
  $$ProductTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get syncDate => $composableBuilder(
    column: $table.syncDate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get deletedAt => $composableBuilder(
    column: $table.deletedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get bulkUnitName => $composableBuilder(
    column: $table.bulkUnitName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get pieceUnitName => $composableBuilder(
    column: $table.pieceUnitName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get unitsPerBulk => $composableBuilder(
    column: $table.unitsPerBulk,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get costPricePerPiece => $composableBuilder(
    column: $table.costPricePerPiece,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get sellingPricePerPiece => $composableBuilder(
    column: $table.sellingPricePerPiece,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get sellingPricePerBulk => $composableBuilder(
    column: $table.sellingPricePerBulk,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get category => $composableBuilder(
    column: $table.category,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get serialNumber => $composableBuilder(
    column: $table.serialNumber,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get stockBalances => $composableBuilder(
    column: $table.stockBalances,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get batches => $composableBuilder(
    column: $table.batches,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get bulkQuantity => $composableBuilder(
    column: $table.bulkQuantity,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get pieceQuantity => $composableBuilder(
    column: $table.pieceQuantity,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get imageUrl => $composableBuilder(
    column: $table.imageUrl,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get images => $composableBuilder(
    column: $table.images,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get reviews => $composableBuilder(
    column: $table.reviews,
    builder: (column) => ColumnFilters(column),
  );
}

class $$ProductTableOrderingComposer
    extends Composer<_$AppDatabase, $ProductTable> {
  $$ProductTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get syncDate => $composableBuilder(
    column: $table.syncDate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get deletedAt => $composableBuilder(
    column: $table.deletedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get bulkUnitName => $composableBuilder(
    column: $table.bulkUnitName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get pieceUnitName => $composableBuilder(
    column: $table.pieceUnitName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get unitsPerBulk => $composableBuilder(
    column: $table.unitsPerBulk,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get costPricePerPiece => $composableBuilder(
    column: $table.costPricePerPiece,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get sellingPricePerPiece => $composableBuilder(
    column: $table.sellingPricePerPiece,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get sellingPricePerBulk => $composableBuilder(
    column: $table.sellingPricePerBulk,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get category => $composableBuilder(
    column: $table.category,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get serialNumber => $composableBuilder(
    column: $table.serialNumber,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get stockBalances => $composableBuilder(
    column: $table.stockBalances,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get batches => $composableBuilder(
    column: $table.batches,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get bulkQuantity => $composableBuilder(
    column: $table.bulkQuantity,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get pieceQuantity => $composableBuilder(
    column: $table.pieceQuantity,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get imageUrl => $composableBuilder(
    column: $table.imageUrl,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get images => $composableBuilder(
    column: $table.images,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get reviews => $composableBuilder(
    column: $table.reviews,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$ProductTableAnnotationComposer
    extends Composer<_$AppDatabase, $ProductTable> {
  $$ProductTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get syncDate =>
      $composableBuilder(column: $table.syncDate, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get deletedAt =>
      $composableBuilder(column: $table.deletedAt, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get bulkUnitName => $composableBuilder(
    column: $table.bulkUnitName,
    builder: (column) => column,
  );

  GeneratedColumn<String> get pieceUnitName => $composableBuilder(
    column: $table.pieceUnitName,
    builder: (column) => column,
  );

  GeneratedColumn<String> get unitsPerBulk => $composableBuilder(
    column: $table.unitsPerBulk,
    builder: (column) => column,
  );

  GeneratedColumn<String> get costPricePerPiece => $composableBuilder(
    column: $table.costPricePerPiece,
    builder: (column) => column,
  );

  GeneratedColumn<String> get sellingPricePerPiece => $composableBuilder(
    column: $table.sellingPricePerPiece,
    builder: (column) => column,
  );

  GeneratedColumn<String> get sellingPricePerBulk => $composableBuilder(
    column: $table.sellingPricePerBulk,
    builder: (column) => column,
  );

  GeneratedColumn<String> get category =>
      $composableBuilder(column: $table.category, builder: (column) => column);

  GeneratedColumn<String> get serialNumber => $composableBuilder(
    column: $table.serialNumber,
    builder: (column) => column,
  );

  GeneratedColumn<String> get stockBalances => $composableBuilder(
    column: $table.stockBalances,
    builder: (column) => column,
  );

  GeneratedColumn<String> get batches =>
      $composableBuilder(column: $table.batches, builder: (column) => column);

  GeneratedColumn<String> get bulkQuantity => $composableBuilder(
    column: $table.bulkQuantity,
    builder: (column) => column,
  );

  GeneratedColumn<String> get pieceQuantity => $composableBuilder(
    column: $table.pieceQuantity,
    builder: (column) => column,
  );

  GeneratedColumn<String> get imageUrl =>
      $composableBuilder(column: $table.imageUrl, builder: (column) => column);

  GeneratedColumn<String> get images =>
      $composableBuilder(column: $table.images, builder: (column) => column);

  GeneratedColumn<String> get reviews =>
      $composableBuilder(column: $table.reviews, builder: (column) => column);
}

class $$ProductTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $ProductTable,
          ProductData,
          $$ProductTableFilterComposer,
          $$ProductTableOrderingComposer,
          $$ProductTableAnnotationComposer,
          $$ProductTableCreateCompanionBuilder,
          $$ProductTableUpdateCompanionBuilder,
          (
            ProductData,
            BaseReferences<_$AppDatabase, $ProductTable, ProductData>,
          ),
          ProductData,
          PrefetchHooks Function()
        > {
  $$ProductTableTableManager(_$AppDatabase db, $ProductTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ProductTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ProductTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ProductTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> syncStatus = const Value.absent(),
                Value<DateTime> syncDate = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime> deletedAt = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String> bulkUnitName = const Value.absent(),
                Value<String> pieceUnitName = const Value.absent(),
                Value<String> unitsPerBulk = const Value.absent(),
                Value<String> costPricePerPiece = const Value.absent(),
                Value<String> sellingPricePerPiece = const Value.absent(),
                Value<String> sellingPricePerBulk = const Value.absent(),
                Value<String> category = const Value.absent(),
                Value<String> serialNumber = const Value.absent(),
                Value<String> stockBalances = const Value.absent(),
                Value<String> batches = const Value.absent(),
                Value<String> bulkQuantity = const Value.absent(),
                Value<String> pieceQuantity = const Value.absent(),
                Value<String> imageUrl = const Value.absent(),
                Value<String> images = const Value.absent(),
                Value<String> reviews = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ProductCompanion(
                id: id,
                syncStatus: syncStatus,
                syncDate: syncDate,
                createdAt: createdAt,
                updatedAt: updatedAt,
                deletedAt: deletedAt,
                name: name,
                bulkUnitName: bulkUnitName,
                pieceUnitName: pieceUnitName,
                unitsPerBulk: unitsPerBulk,
                costPricePerPiece: costPricePerPiece,
                sellingPricePerPiece: sellingPricePerPiece,
                sellingPricePerBulk: sellingPricePerBulk,
                category: category,
                serialNumber: serialNumber,
                stockBalances: stockBalances,
                batches: batches,
                bulkQuantity: bulkQuantity,
                pieceQuantity: pieceQuantity,
                imageUrl: imageUrl,
                images: images,
                reviews: reviews,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String syncStatus,
                Value<DateTime> syncDate = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime> deletedAt = const Value.absent(),
                required String name,
                required String bulkUnitName,
                required String pieceUnitName,
                required String unitsPerBulk,
                required String costPricePerPiece,
                required String sellingPricePerPiece,
                required String sellingPricePerBulk,
                required String category,
                required String serialNumber,
                required String stockBalances,
                required String batches,
                required String bulkQuantity,
                required String pieceQuantity,
                required String imageUrl,
                required String images,
                required String reviews,
                Value<int> rowid = const Value.absent(),
              }) => ProductCompanion.insert(
                id: id,
                syncStatus: syncStatus,
                syncDate: syncDate,
                createdAt: createdAt,
                updatedAt: updatedAt,
                deletedAt: deletedAt,
                name: name,
                bulkUnitName: bulkUnitName,
                pieceUnitName: pieceUnitName,
                unitsPerBulk: unitsPerBulk,
                costPricePerPiece: costPricePerPiece,
                sellingPricePerPiece: sellingPricePerPiece,
                sellingPricePerBulk: sellingPricePerBulk,
                category: category,
                serialNumber: serialNumber,
                stockBalances: stockBalances,
                batches: batches,
                bulkQuantity: bulkQuantity,
                pieceQuantity: pieceQuantity,
                imageUrl: imageUrl,
                images: images,
                reviews: reviews,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$ProductTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $ProductTable,
      ProductData,
      $$ProductTableFilterComposer,
      $$ProductTableOrderingComposer,
      $$ProductTableAnnotationComposer,
      $$ProductTableCreateCompanionBuilder,
      $$ProductTableUpdateCompanionBuilder,
      (ProductData, BaseReferences<_$AppDatabase, $ProductTable, ProductData>),
      ProductData,
      PrefetchHooks Function()
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$ProductTableTableManager get product =>
      $$ProductTableTableManager(_db, _db.product);
}
