import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/drift/database.dart';

void main() {
  late AppDatabase database;
  late BranchRepository branchRepository;

  // Fixed DateTime to ensure deterministic test behavior
  final fixedNow = DateTime(2026, 4, 21, 12, 0, 0);
  final fixedLater = DateTime(2026, 4, 21, 13, 0, 0);

  setUp(() {
    database = AppDatabase(NativeDatabase.memory());
    branchRepository = BranchRepository(database: database);
  });

  tearDown(() async {
    await database.close();
  });

  // Helper to create isolated, deterministic branch data per test
  BranchData _createTestBranch({
    String id = 'branch_1',
    String name = 'Main Branch',
    String businessId = 'biz_1',
    bool isHeadOffice = true,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return BranchData(
      id: id,
      name: name,
      businessId: businessId,
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

  // Full field deep assertion — validates every persisted field
  void _expectBranchesMatch(BranchData actual, BranchData expected) {
    expect(actual.id, expected.id, reason: 'id mismatch');
    expect(actual.name, expected.name, reason: 'name mismatch');
    expect(actual.businessId, expected.businessId, reason: 'businessId mismatch');
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

  // Helper to query branch by ID directly from DB
  Future<BranchData?> _findById(String id) async {
    final results = await (database.select(database.branch)
      ..where((t) => t.id.equals(id))).get();
    return results.isEmpty ? null : results.first;
  }

  group('BranchRepository (Comprehensive Tests)', () {
    // ─── CREATE ──────────────────────────────────────────────────────────────

    group('createBranch', () {
      test('should save all fields correctly', () async {
        final branch = _createTestBranch();

        final result = await branchRepository.createBranch(branch);

        expect(result.success, true);
        expect(result.message, 'branch created successfully');
        final saved = await _findById(branch.id);
        expect(saved, isNotNull);
        _expectBranchesMatch(saved!, branch);
      });

      test('should fail and return error message on duplicate ID', () async {
        final branch = _createTestBranch();
        await branchRepository.createBranch(branch);

        final result = await branchRepository.createBranch(branch);

        expect(result.success, false);
        expect(result.message, contains('Failed to create branch'));
      });
    });

    // ─── READ ─────────────────────────────────────────────────────────────────

    group('getBranchesByBusinessId', () {
      test('should return only branches matching the businessId', () async {
        final biz1Branch1 = _createTestBranch(id: 'b1', businessId: 'biz_1');
        final biz1Branch2 = _createTestBranch(id: 'b2', businessId: 'biz_1');
        final biz2Branch1 = _createTestBranch(id: 'b3', businessId: 'biz_2');

        await branchRepository.createBranch(biz1Branch1);
        await branchRepository.createBranch(biz1Branch2);
        await branchRepository.createBranch(biz2Branch1);

        final biz1Results = await branchRepository.getBranchesByBusinessId('biz_1');

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

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    group('updateBranch', () {
      test('should persist all modified fields', () async {
        final original = _createTestBranch();
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
        _expectBranchesMatch(saved!, updated);
      });

      test('should fail with descriptive message if branch does not exist', () async {
        final nonExistent = _createTestBranch(id: 'ghost_branch');

        final result = await branchRepository.updateBranch(nonExistent);

        expect(result.success, false);
        expect(result.message, contains('Branch not found'));
      });
    });

    // ─── DELETE ───────────────────────────────────────────────────────────────

    group('deleteBranch', () {
      test('should permanently remove branch from the database', () async {
        final branch = _createTestBranch();
        await branchRepository.createBranch(branch);

        // Confirm existence before deleting  
        final beforeDelete = await _findById(branch.id);
        expect(beforeDelete, isNotNull);

        await branchRepository.deleteBranch(branch.id);

        // Confirm it was actually removed
        final afterDelete = await _findById(branch.id);
        expect(afterDelete, isNull);
      });

      test('should complete without crashing for a non-existent ID', () async {
        await expectLater(
          branchRepository.deleteBranch('unknown_id'),
          completes,
        );
        // And the DB should still be empty (no side effects)
        final results = await branchRepository.getBranchesByBusinessId('biz_1');
        expect(results, isEmpty);
      });
    });

    // ─── SCALE ────────────────────────────────────────────────────────────────

    group('Scale tests', () {
      test('should handle 100 branches with correct filtering across 2 businesses', () async {
        // Arrange: 60 for biz_A, 40 for biz_B
        final bizABranches = List.generate(
          60,
          (i) => _createTestBranch(id: 'a_$i', businessId: 'biz_A', name: 'Branch A$i'),
        );
        final bizBBranches = List.generate(
          40,
          (i) => _createTestBranch(id: 'b_$i', businessId: 'biz_B', name: 'Branch B$i'),
        );

        for (final b in [...bizABranches, ...bizBBranches]) {
          await branchRepository.createBranch(b);
        }

        // Act
        final bizAResults = await branchRepository.getBranchesByBusinessId('biz_A');
        final bizBResults = await branchRepository.getBranchesByBusinessId('biz_B');

        // Assert counts
        expect(bizAResults.length, 60);
        expect(bizBResults.length, 40);

        // Assert no data leakage across business boundaries
        for (final b in bizAResults) {
          expect(b.businessId, 'biz_A');
        }
        for (final b in bizBResults) {
          expect(b.businessId, 'biz_B');
        }
      });
    });
  });
}
