import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/services/api/config/api_response.dart';

void main() {
  group('AuthResponse', () {
    test('fromJson should return a valid AuthResponse', () {
      // Arrange
      final json = {
        'token': 'test_token',
        'refresh_token': 'test_refresh',
        'user': {
          'id': '1',
          'email': 'test@example.com',
          'first_name': 'John',
          'last_name': 'Doe',
          'phone_number': '1234567890',
          'role': 'admin',
          'created_at': '2021-01-01T00:00:00Z',
          'updated_at': '2021-01-01T00:00:00Z',
        }
      };

      // Act
      final response = AuthResponse.fromJson(json);

      // Assert
      expect(response.token, 'test_token');
      expect(response.refreshToken, 'test_refresh');
      expect(response.user, isNotNull);
      expect(response.user?.id, '1');
      expect(response.user?.email, 'test@example.com');
    });

    test('fromJson should handle null user', () {
      // Arrange
      final json = {
        'token': 'test_token',
        'refresh_token': 'test_refresh',
        'user': null
      };

      // Act
      final response = AuthResponse.fromJson(json);

      // Assert
      expect(response.token, 'test_token');
      expect(response.refreshToken, 'test_refresh');
      expect(response.user, isNull);
    });
  });
}
