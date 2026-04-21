/// Domain logic for sales-related calculations.
/// This class is pure and has no dependencies on database or repository.
class SalesLogic {
  /// Calculates profit for a single sales item.
  /// Profit = (unitPrice - costPrice) * quantity.
  static int calculateItemProfit({
    required int unitPrice,
    required int costPrice,
    required int quantity,
  }) {
    return (unitPrice - costPrice) * quantity;
  }

  /// Calculates total profit for a list of sales items.
  static int calculateTotalProfit(
    List<({int unitPrice, int costPrice, int quantity})> items,
  ) {
    return items.fold(0, (sum, item) {
      return sum +
          calculateItemProfit(
            unitPrice: item.unitPrice,
            costPrice: item.costPrice,
            quantity: item.quantity,
          );
    });
  }
}
