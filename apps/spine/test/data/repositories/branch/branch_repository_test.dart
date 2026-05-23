import 'package:drift/native.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/repositories/business/business_repository.dart';
import 'package:spine/data/services/api/branch/branch_api_services.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

import '../business/business_test_factory.dart';
import '../constants.dart';

class MockBranchApiServices extends Mock implements BranchApiServices {}

void main() {
  late AppDatabase database;
  late MockBranchApiServices branchApiServices;
  late BranchRepository branchRepository;
  late BusinessRepository businessRepository;

  WidgetsFlutterBinding.ensureInitialized();

  final fixedNow = DateTime(2026, 4, 21, 12, 0, 0);
  final fixedLater = DateTime(2026, 4, 21, 13, 0, 0);

  BranchData _createTestBranch({
    String id = 'branch_1',
    String name = 'Main Branch',
    String businessId = Constants.testBusinessId1,
    bool isHeadOffice = true,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    
    return BranchData(
      id: id,
      name: name,
      businessId: businessId,
      collectionId: null,
      isHeadOffice: isHeadOffice,
      streetAddress: '123 Lekki Way',
      city: 'Lekki',
      state: 'Lagos',
      country: 'Nigeria',
      phone: '+23480000001',
      syncStatus: 'synced',
      createdAt: createdAt ?? fixedNow,
      updatedAt: updatedAt ?? fixedNow,
    );
  }

  setUpAll(() {
    registerFallbackValue(
      BranchData(
        id: 'fallback_branch',
        name: 'Fallback Branch',
        businessId: 'fallback_biz',
        collectionId: null,
        isHeadOffice: false,
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        syncStatus: 'pending',
        createdAt: DateTime(2000),
        updatedAt: DateTime(2000),
      ),
    );
  });

  setUp(() {
    database = AppDatabase(NativeDatabase.memory());
    branchApiServices = MockBranchApiServices();

    when(() => branchApiServices.createBranch(any())).thenAnswer(
      (_) async => ApiResponse(
        success: true,
        message: 'branch created successfully',
        data: await _createTestBranch(id: 'api_branch'),
      ),
    );

    branchRepository = BranchRepository(
      branchApiServices: branchApiServices,
      database: database,
    );
  });

  tearDown(() async {
    await database.close();
  });

  void _expectBranchesMatch(BranchData actual, BranchData expected) {
    expect(actual.id, expected.id, reason: 'id mismatch');
    expect(actual.name, expected.name, reason: 'name mismatch');
    expect(actual.businessId, expected.businessId, reason: 'businessId mismatch');
    expect(actual.collectionId, expected.collectionId, reason: 'collectionId mismatch');
    expect(actual.streetAddress, expected.streetAddress, reason: 'streetAddress mismatch');
    expect(actual.city, expected.city, reason: 'city mismatch');
    expect(actual.state, expected.state, reason: 'state mismatch');
    expect(actual.country, expected.country, reason: 'country mismatch');
    expect(actual.phone, expected.phone, reason: 'phone mismatch');
    expect(actual.isHeadOffice, expected.isHeadOffice, reason: 'isHeadOffice mismatch');
    expect(actual.syncStatus, expected.syncStatus, reason: 'syncStatus mismatch');
    expect(actual.createdAt, expected.createdAt, reason: 'createdAt mismatch');
    expect(actual.updatedAt, expected.updatedAt, reason: 'updatedAt mismatch');
  }

  Future<BranchData?> _findById(String id) async {
    final results = await (database.select(database.branch)
          ..where((t) => t.id.equals(id)))
        .get();

    return results.isEmpty ? null : results.first;
  }

  group('BranchRepository (Comprehensive Tests)', () {
  

    group('getBranchesByBusinessId', () {
      test('should return only branches matching the businessId', () async {
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId1 );
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId2 );
        
        
        final biz1Branch1 =  _createTestBranch(id: 'b1', businessId: Constants.testBusinessId1);
        final biz1Branch2 =  _createTestBranch(id: 'b2', businessId: Constants.testBusinessId1);
        final biz2Branch1 =  _createTestBranch(id: 'b3', businessId: Constants.testBusinessId2);

        await branchRepository.createBranch(biz1Branch1);
        await branchRepository.createBranch(biz1Branch2);
        await branchRepository.createBranch(biz2Branch1);

        final biz1Results = await branchRepository.getBranchesByBusinessId(Constants.testBusinessId1);

        expect(biz1Results.length, 2);
        expect(biz1Results.any((b) => b.id == 'b1'), isTrue);
        expect(biz1Results.any((b) => b.id == 'b2'), isTrue);
        expect(biz1Results.any((b) => b.id == 'b3'), isFalse);
      });

      test('should return an empty list if no branches exist for businessId', () async {
        final results = await branchRepository.getBranchesByBusinessId('unknown_biz');

        expect(results, isEmpty);
      });
    });

    group('updateBranch', () {
      test('should persist all modified fields', () async {
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId1 );
        
        final original = await _createTestBranch();

        await branchRepository.createBranch(original);

        final updated = original.copyWith(
          name: 'Updated Name',
          city: 'VGC',
          isHeadOffice: false,
          syncStatus: 'pending',
          updatedAt: fixedLater,
        );

        final result = await branchRepository.updateBranch(updated);

        expect(result.success, true);
        expect(result.message, 'branch updated successfully');

        final saved = await _findById(original.id);
        expect(saved, isNotNull);
        _expectBranchesMatch(saved!, updated);
      });

      test('should fail with descriptive message if branch does not exist', () async {
        final nonExistent = await _createTestBranch(id: 'ghost_branch');

        final result = await branchRepository.updateBranch(nonExistent);

        expect(result.success, false);
        expect(result.message, contains('Branch not found'));
      });
    });

    group('deleteBranch', () {
      test('should permanently remove branch from the database', () async {
        
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId1 );
        
        final branch = await _createTestBranch();

        await branchRepository.createBranch(branch);

        final beforeDelete = await _findById(branch.id);
        expect(beforeDelete, isNotNull);

        await branchRepository.deleteBranch(branch.id);

        final afterDelete = await _findById(branch.id);
        expect(afterDelete, isNull);
      });

      test('should complete without crashing for a non-existent ID', () async {
        await expectLater(
          branchRepository.deleteBranch('unknown_id'),
          completes,
        );

        final results = await branchRepository.getBranchesByBusinessId('biz_1');
        expect(results, isEmpty);
      });
    });

    group('Scale tests', () {
      test('should handle 100 branches with correct filtering across 2 businesses', () async {
        
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId1 );
        await BusinessTestFactory.seedBusiness(database, businessId: Constants.testBusinessId2 );
        final bizABranches = 
          List.generate(
            60,
            (i) => _createTestBranch(
              id: 'a_$i',
              businessId: Constants.testBusinessId1,
              name: 'Branch A$i',
            ),
          );

        final bizBBranches = 
          List.generate(
            40,
            (i) => _createTestBranch(
              id: 'b_$i',
              businessId: Constants.testBusinessId2,
              name: 'Branch B$i',
            ),
          );


        for (final branch in [...bizABranches, ...bizBBranches]) {
          // await businessRepository.saveBusinesses()

          await branchRepository.createBranch(branch);
        }

        final bizAResults = await branchRepository.getBranchesByBusinessId(Constants.testBusinessId1);
        final bizBResults = await branchRepository.getBranchesByBusinessId(Constants.testBusinessId2);

        expect(bizAResults.length, 60);
        expect(bizBResults.length, 40);

        for (final branch in bizAResults) {
          expect(branch.businessId, Constants.testBusinessId1);
        }

        for (final branch in bizBResults) {
          expect(branch.businessId, Constants.testBusinessId2);
        }

        // verify(() => branchApiServices.createBranch(any())).called(100);
      });
    });
  });
}