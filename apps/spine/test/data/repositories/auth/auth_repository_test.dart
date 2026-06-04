import 'package:flutter_test/flutter_test.dart';
import 'package:drift/native.dart';
import 'package:mocktail/mocktail.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:spine/data/repositories/auth/auth_repository.dart';
import 'package:spine/data/services/api/auth/auth_api_services.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

import '../inventory/inventory_test_factory.dart';

class MockAuthApiServices extends Mock implements AuthApiServices {}

class MockAppDatabase extends Mock implements AppDatabase {}

void main() {
  late AuthRepository authRepository;
  late MockAuthApiServices mockAuthApiServices;
  late MockAppDatabase mockAppDatabase;

  setUp(() {
    mockAuthApiServices = MockAuthApiServices();
    mockAppDatabase = MockAppDatabase();
    authRepository = AuthRepository(
      authApiServices: mockAuthApiServices,
      database: mockAppDatabase,
    );
  });

  group('AuthRepository', () {
    test('login should return AuthResponse on success', () async {
      // Arrange
      final authResponse = AuthResponse(
        token: 'test_token',
        refreshToken: 'test_refresh',
        user: null,
      );
      final apiResponse = ApiResponse(
        success: true,
        message: 'Success',
        data: authResponse,
      );

      when(
        () => mockAuthApiServices.login(any(), any()),
      ).thenAnswer((_) async => apiResponse);

      // Act
      final result = await authRepository.login('test@example.com', 'password');

      // Assert
      expect(result.success, true);
      expect(result.data.token, 'test_token');
      verify(
        () => mockAuthApiServices.login('test@example.com', 'password'),
      ).called(1);
    });

    test('login should return error when API fails', () async {
      // Arrange
      final authResponse = AuthResponse(
        token: '',
        refreshToken: '',
        user: null,
      );
      final apiResponse = ApiResponse(
        success: false,
        message: 'Invalid credentials',
        data: authResponse,
      );

      when(
        () => mockAuthApiServices.login(any(), any()),
      ).thenAnswer((_) async => apiResponse);

      // Act
      final result = await authRepository.login(
        'test@example.com',
        'wrong_password',
      );

      // Assert
      expect(result.success, false);
      expect(result.message, 'Invalid credentials');
    });

    test('logout clears local tables in foreign-key-safe order', () async {
      SharedPreferences.setMockInitialValues({
        'auth_token': 'test_token',
        'active_business_id': 'business_1',
        'active_branch_id': 'branch_1',
        'sync_cursor': '2026-06-04T10:00:00.000Z',
      });
      final database = AppDatabase(NativeDatabase.memory());
      addTearDown(database.close);
      await InventoryTestFactory.seedFullProduct(database);
      final repository = AuthRepository(
        authApiServices: mockAuthApiServices,
        database: database,
      );

      final result = await repository.logOut();

      expect(result.success, isTrue);
      expect(await database.select(database.inventory).get(), isEmpty);
      expect(await database.select(database.product).get(), isEmpty);
      expect(await database.select(database.globalProduct).get(), isEmpty);
      expect(await database.select(database.branch).get(), isEmpty);
      expect(await database.select(database.businesses).get(), isEmpty);
    });
  });
}
