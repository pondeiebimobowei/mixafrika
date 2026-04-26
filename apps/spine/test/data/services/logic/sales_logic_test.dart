import 'package:flutter_test/flutter_test.dart';
import 'package:spine/data/services/logic/sales_logic.dart';

void main() {
  group('SalesLogic.calculateItemProfit', () {
    test('should return positive profit when unit price exceeds cost', () {
      final result = SalesLogic.calculateItemProfit(
        unitPrice: 500,
        costPrice: 300,
        quantity: 10,
      );
      expect(result, 2000); // (500-300)*10
    });

    test('should return zero profit when unit price equals cost', () {
      final result = SalesLogic.calculateItemProfit(
        unitPrice: 300,
        costPrice: 300,
        quantity: 10,
      );
      expect(result, 0);
    });

    test('should return negative profit when cost exceeds unit price (loss)', () {
      final result = SalesLogic.calculateItemProfit(
        unitPrice: 200,
        costPrice: 300,
        quantity: 10,
      );
      expect(result, -1000);
    });

    test('should return zero when quantity is zero', () {
      final result = SalesLogic.calculateItemProfit(
        unitPrice: 500,
        costPrice: 300,
        quantity: 0,
      );
      expect(result, 0);
    });

    test('should handle large numbers correctly', () {
      final result = SalesLogic.calculateItemProfit(
        unitPrice: 1000000,
        costPrice: 900000,
        quantity: 100,
      );
      expect(result, 10000000); // 100,000 * 100
    });
  });

  group('SalesLogic.calculateTotalProfit', () {
    test('should return sum of all item profits', () {
      final items = [
        (unitPrice: 500, costPrice: 300, quantity: 5), // 1000
        (unitPrice: 1000, costPrice: 800, quantity: 2), // 400
        (unitPrice: 200, costPrice: 250, quantity: 4), // -200
      ];

      final result = SalesLogic.calculateTotalProfit(items);
      expect(result, 1200); // 1000 + 400 - 200
    });

    test('should return zero for empty list', () {
      final result = SalesLogic.calculateTotalProfit([]);
      expect(result, 0);
    });

    test('should handle items with zero profit correctly', () {
      final items = [
        (unitPrice: 500, costPrice: 500, quantity: 5),
        (unitPrice: 300, costPrice: 200, quantity: 0),
      ];

      final result = SalesLogic.calculateTotalProfit(items);
      expect(result, 0);
    });
  });
}
