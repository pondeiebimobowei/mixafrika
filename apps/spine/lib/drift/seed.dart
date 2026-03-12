import 'package:spine/drift/database.dart';
import 'package:uuid/uuid.dart';

final product1 = ProductData(
  id: Uuid().v4(),
  name: 'Pack of Milk',
  description: 'Clean surface',
  bulkUnitName: 'Carton',
  pieceUnitName: 'Pack',
  unitsPerBulk: 10,
  costPricePerUnit: 3000,
  sellingPricePerPiece: 4000,
  sellingPricePerBulk: 20000,
  category: 'Food',
  serialNumber: '345567567',
  imageUrl: 'avatar.png',
  businessId: userBiz1.id,
  reviews: 'Reviews',

  syncStatus: 'Sync status',
  syncDate: DateTime.now(),


  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);
final product2 = ProductData(
  id: Uuid().v4(),
  name: 'A product Two',
  description: '',
  bulkUnitName: 'Bunch',
  pieceUnitName: 'Finger',
  unitsPerBulk: 5,
  costPricePerUnit: 1500,
  sellingPricePerPiece: 2000,
  sellingPricePerBulk: 10000,
  category: 'Food',
  serialNumber: '123450987',
  imageUrl: 'image.png',
  businessId: userBiz1.id,
  reviews: 'no review',

  syncStatus: 'pending',
  syncDate: DateTime.now(),


  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);

final batch1 = SpineBatchData(
  id: Uuid().v4(),
  batchNumber: '123456789',
  costPricePerBulk: 1500,
  costPricePerPiece: 1800,
  initialQuantity: 10,
  remainingQuantity: 10,
  expiryDate: DateTime.now(),
  productId: product1.id,
  businessId: userBiz1.id,
  
  syncStatus: 'Sync status',
  syncDate: DateTime.now(),


  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);

final inventory1 = InventoryData(
  id: Uuid().v4(),
  quantity: 50,
  productId: product1.id,
  businessId: userBiz1.id,
  batchId: batch1.id,
  
  syncStatus: 'pending',
  syncDate: DateTime.now(),


  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);

final inventory2 = InventoryData(
  id: Uuid().v4(),
  quantity: 30,
  productId: product2.id,
  businessId: userBiz1.id,
  batchId: batch1.id,

  syncStatus: 'pending',
  syncDate: DateTime.now(),
  
  
  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);

final userBiz1 = UserBusinessData(
  id: Uuid().v4(),
  userId: 'sdedede',
  collectionId: '1',
  name: 'Chicken Republic',
  type: 'business',
  phone: '08023467856',
  streetAddress: '123 Main St',
  city: 'Gwarimpa',
  state: 'Abuja',
  country: 'Nigeria',
  verification: 'not verified',

  syncStatus: 'pending',
  syncDate: DateTime.now(),


  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);

final userBiz2 = UserBusinessData(
  id: Uuid().v4(),
  userId: '1',
  collectionId: '1',
  name: 'Blessed Obaino',
  type: 'business',
  phone: '08023467856',
  streetAddress: '123 Main St',
  city: 'Gwarimpa',
  state: 'Abuja',
  country: 'Nigeria',
  verification: 'not verified',

  syncStatus: 'pending',
  syncDate: DateTime.now(),


  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);