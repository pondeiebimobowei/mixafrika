import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/drift/database.dart';

import 'qa_seed_factory.dart';

void main() {
  late AppDatabase db;

  setUp(() async {
    db = AppDatabase(NativeDatabase.memory());
    await QaSeedFactory.business(db, id: 'biz_qa');
    await QaSeedFactory.branch(
      db,
      id: 'branch_qa',
      businessId: 'biz_qa',
      isHeadOffice: true,
    );
    await QaSeedFactory.user(db, id: 'user_owner', email: 'owner@example.test');
    await QaSeedFactory.user(db, id: 'user_staff', email: 'staff@example.test');
  });

  tearDown(() async {
    await db.close();
  });

  group('Business and branch user relationship integrity', () {
    test('allows multiple users to belong to the same business', () async {
      await db
          .into(db.businessUser)
          .insert(
            BusinessUserData(
              id: 'business_user_owner',
              role: 'owner',
              isActive: true,
              hasFullAccess: true,
              joinedAt: QaSeedFactory.now,
              userId: 'user_owner',
              businessId: 'biz_qa',
              syncStatus: 'pending',
              createdAt: QaSeedFactory.now,
              updatedAt: QaSeedFactory.now,
            ),
          );

      await expectLater(
        db
            .into(db.businessUser)
            .insert(
              BusinessUserData(
                id: 'business_user_staff',
                role: 'staff',
                isActive: true,
                hasFullAccess: false,
                joinedAt: QaSeedFactory.now,
                userId: 'user_staff',
                businessId: 'biz_qa',
                syncStatus: 'pending',
                createdAt: QaSeedFactory.now,
                updatedAt: QaSeedFactory.now,
              ),
            ),
        completes,
      );
    });

    test('allows multiple users to be assigned to the same branch', () async {
      await db
          .into(db.branchUser)
          .insert(
            BranchUserData(
              id: 'branch_user_owner',
              role: 'manager',
              isActive: true,
              assignedAt: QaSeedFactory.now,
              userId: 'user_owner',
              branchId: 'branch_qa',
              syncStatus: 'pending',
              createdAt: QaSeedFactory.now,
              updatedAt: QaSeedFactory.now,
            ),
          );

      await expectLater(
        db
            .into(db.branchUser)
            .insert(
              BranchUserData(
                id: 'branch_user_staff',
                role: 'sales',
                isActive: true,
                assignedAt: QaSeedFactory.now,
                userId: 'user_staff',
                branchId: 'branch_qa',
                syncStatus: 'pending',
                createdAt: QaSeedFactory.now,
                updatedAt: QaSeedFactory.now,
              ),
            ),
        completes,
      );
    });
  });
}
