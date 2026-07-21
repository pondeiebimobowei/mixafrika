class SalesException implements Exception {
  final String message;

  const SalesException(this.message);

  @override
  String toString() => message;
}

class ProductItemMissingProductIdException extends SalesException {
  const ProductItemMissingProductIdException()
    : super('Product item must have productId');
}

class InsufficientStockException extends SalesException {
  const InsufficientStockException(String itemName)
    : super('Insufficient stock for $itemName');
}
