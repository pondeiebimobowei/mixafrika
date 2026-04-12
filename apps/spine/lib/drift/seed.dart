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

final bankDetail1 = BankDetail(
    id: const Uuid().v4(),
    businessId: userBiz1.id,
    bankName: 'Access Bank',
    accountName: 'Chicken Republic Ltd',
    accountNumber: '0123456789',
    syncStatus: 'synced',
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );

final bankDetail2 = BankDetail(
    id: const Uuid().v4(),
    businessId: userBiz1.id,
    bankName: 'GTBank',
    accountName: 'Chicken Republic Ltd',
    accountNumber: '0987654321',
    syncStatus: 'synced',
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );

final bankDetail3 = BankDetail(
    id: const Uuid().v4(),
    businessId: userBiz2.id,
    bankName: 'Zenith Bank',
    accountName: 'Blessed Obaino Ventures',
    accountNumber: '1122334455',
    syncStatus: 'synced',
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );
final bankDetail4 = BankDetail(
    id: const Uuid().v4(),
    businessId: userBiz2.id,
    bankName: 'UBA',
    accountName: 'Blessed Obaino Ventures',
    accountNumber: '5544332211',
    syncStatus: 'synced',
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );