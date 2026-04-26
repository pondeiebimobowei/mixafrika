import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:spine/data/repositories/auth/auth_repository.dart';
import 'package:spine/data/services/api/auth/auth_api_services.dart';
import 'package:spine/data/services/api/config/api_response.dart';
import 'package:spine/drift/database.dart';

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
      final authResponse = AuthResponse(token: 'test_token', refreshToken: 'test_refresh', user: null);
      final apiResponse = ApiResponse(success: true, message: 'Success', data: authResponse);
      
      when(() => mockAuthApiServices.login(any(), any()))
          .thenAnswer((_) async => apiResponse);

      // Act
      final result = await authRepository.login('test@example.com', 'password');

      // Assert
      expect(result.success, true);
      expect(result.data.token, 'test_token');
      verify(() => mockAuthApiServices.login('test@example.com', 'password')).called(1);
    });

    test('login should return error when API fails', () async {
      // Arrange
      final authResponse = AuthResponse(token: '', refreshToken: '', user: null);
      final apiResponse = ApiResponse(success: false, message: 'Invalid credentials', data: authResponse);
      
      when(() => mockAuthApiServices.login(any(), any()))
          .thenAnswer((_) async => apiResponse);

      // Act
      final result = await authRepository.login('test@example.com', 'wrong_password');

      // Assert
      expect(result.success, false);
      expect(result.message, 'Invalid credentials');
    });
  });
}
