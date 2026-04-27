import 'package:spine/drift/database.dart';

class AddStockState {
  final List<ProductData> products;
  final ProductData? selectedProduct;
  final String bulkQuantity;
  final String pieceQuantity;
  final String totalCost;
  final String bulkPrice;
  final String piecePrice;
  final String searchQuery;
  final DateTime? expiryDate;
  final bool isLoading;
  final bool isSuccess;
  final String? errorMessage;
  final bool isEnteringBulk;

  const AddStockState({
    this.products = const [],
    this.selectedProduct,
    this.bulkQuantity = '',
    this.pieceQuantity = '',
    this.totalCost = '',
    this.bulkPrice = '',
    this.piecePrice = '',
    this.searchQuery = '',
    this.expiryDate,
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMessage,
    this.isEnteringBulk = true,
  });

  List<ProductData> get filteredProducts {
    if (searchQuery.isEmpty) return products;
    return products
        .where((p) => p.name.toLowerCase().contains(searchQuery.toLowerCase()))
        .toList();
  }

  double get estCostPerPiece {
    if (selectedProduct == null) return 0.0;
    final total = double.tryParse(totalCost) ?? 0.0;
    final pieces = double.tryParse(pieceQuantity) ?? 0.0;

    final totalPieces = pieces;
    if (totalPieces == 0) return 0.0;
    return total / totalPieces;
  }

  AddStockState copyWith({
    List<ProductData>? products,
    ProductData? selectedProduct,
    String? bulkQuantity,
    String? pieceQuantity,
    String? totalCost,
    String? bulkPrice,
    String? piecePrice,
    String? searchQuery,
    DateTime? expiryDate,
    bool? isLoading,
    bool? isSuccess,
    String? errorMessage,
    bool? isEnteringBulk,
  }) {
    return AddStockState(
      products: products ?? this.products,
      selectedProduct: selectedProduct ?? this.selectedProduct,
      bulkQuantity: bulkQuantity ?? this.bulkQuantity,
      pieceQuantity: pieceQuantity ?? this.pieceQuantity,
      totalCost: totalCost ?? this.totalCost,
      bulkPrice: bulkPrice ?? this.bulkPrice,
      piecePrice: piecePrice ?? this.piecePrice,
      searchQuery: searchQuery ?? this.searchQuery,
      expiryDate: expiryDate ?? this.expiryDate,
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMessage: errorMessage, // Nullable override
      isEnteringBulk: isEnteringBulk ?? this.isEnteringBulk,
    );
  }
}
