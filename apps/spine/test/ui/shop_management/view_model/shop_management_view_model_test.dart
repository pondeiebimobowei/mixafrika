import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:spine/data/repositories/branch/branch_repository.dart';
import 'package:spine/data/repositories/business/business_repository.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/shop_management/view_model/shop_management_view_model.dart';

class MockBranchRepository extends Mock implements BranchRepository {}
class MockBusinessRepository extends Mock implements BusinessRepository {}

void main() {
  late ProviderContainer container;
  late MockBranchRepository mockBranchRepository;
  late MockBusinessRepository mockBusinessRepository;

  setUpAll(() {
    registerFallbackValue(BranchData(
      id: '1',
      name: 'Branch 1',
      businessId: 'biz_1',
      isHeadOffice: true,
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      syncStatus: '',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    ));
  });

  setUp(() async {
    SharedPreferences.setMockInitialValues({
      'active_business_id': 'biz_123',
    });

    mockBranchRepository = MockBranchRepository();
    mockBusinessRepository = MockBusinessRepository();
    
    container = ProviderContainer(
      overrides: [
        branchRepositoryLocalProvider.overrideWithValue(mockBranchRepository),
        businessRepositoryProvider.overrideWithValue(mockBusinessRepository),
      ],
    );
  });

  group('ShopManagementViewModel', () {
    test('init should load businesses and branches', () async {
      // Arrange
      when(() => mockBusinessRepository.getBusinesses()).thenAnswer((_) async => []);
      when(() => mockBranchRepository.getBranchesByBusinessId(any())).thenAnswer((_) async => []);

      // Act
      final viewModel = container.read(shopManagementViewModelProvider.notifier);
      await Future.delayed(Duration.zero); // Wait for async init

      // Assert
      final state = container.read(shopManagementViewModelProvider);
      expect(state.activeBusinessId, 'biz_123');
      verify(() => mockBusinessRepository.getBusinesses()).called(1);
      verify(() => mockBranchRepository.getBranchesByBusinessId('biz_123')).called(1);
    });

    test('switchBusiness should update preferences and reload branches', () async {
      // Arrange
      when(() => mockBusinessRepository.getBusinesses()).thenAnswer((_) async => []);
      when(() => mockBranchRepository.getBranchesByBusinessId(any())).thenAnswer((_) async => []);
      
      final viewModel = container.read(shopManagementViewModelProvider.notifier);
      await Future.delayed(Duration.zero);

      // Act
      await viewModel.switchBusiness('biz_456');

      // Assert
      final state = container.read(shopManagementViewModelProvider);
      expect(state.activeBusinessId, 'biz_456');
      
      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getString('active_business_id'), 'biz_456');
      verify(() => mockBranchRepository.getBranchesByBusinessId('biz_456')).called(1);
    });

    test('createBranch should call repository and reload', () async {
      // Arrange
      final branch = BranchData(
        id: 'new_1',
        name: 'New Branch',
        businessId: 'biz_123',
        isHeadOffice: false,
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        syncStatus: '',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      
      when(() => mockBusinessRepository.getBusinesses()).thenAnswer((_) async => []);
      when(() => mockBranchRepository.getBranchesByBusinessId(any())).thenAnswer((_) async => []);
      when(() => mockBranchRepository.createBranch(any())).thenAnswer((_) async => ApiResponse(success: true, message: 'Created', data: null));

      final viewModel = container.read(shopManagementViewModelProvider.notifier);
      await Future.delayed(Duration.zero);

      // Act
      await viewModel.createBranch(branch);

      // Assert
      verify(() => mockBranchRepository.createBranch(branch)).called(1);
      verify(() => mockBranchRepository.getBranchesByBusinessId('biz_123')).called(2);
    });
  });
}
