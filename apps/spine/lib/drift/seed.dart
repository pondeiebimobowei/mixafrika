import 'package:spine/drift/database.dart';
import 'package:uuid/uuid.dart';


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