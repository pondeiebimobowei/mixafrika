import 'package:spine/drift/database.dart';

class EditProductState {
  final bool isLoading;
  final bool isSubmitting;
  final String? errorMessage;
  final String? successMessage;
  final ProductData? initialProduct;

  // Form fields
  final String name;
  final String description;
  final String category;
  final String bulkUnit;
  final String pieceUnit;
  final String unitsPerBulk;
  final String bulkCostPrice;
  final String pieceSellingPrice;
  final String bulkSellingPrice;
  final String serialNumber;

  EditProductState({
    this.isLoading = false,
    this.isSubmitting = false,
    this.errorMessage,
    this.successMessage,
    this.initialProduct,
    this.name = '',
    this.description = '',
    this.category = '',
    this.bulkUnit = '',
    this.pieceUnit = '',
    this.unitsPerBulk = '',
    this.bulkCostPrice = '',
    this.pieceSellingPrice = '',
    this.bulkSellingPrice = '',
    this.serialNumber = '',
  });

  EditProductState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    String? errorMessage,
    String? successMessage,
    ProductData? initialProduct,
    String? name,
    String? description,
    String? category,
    String? bulkUnit,
    String? pieceUnit,
    String? unitsPerBulk,
    String? bulkCostPrice,
    String? pieceSellingPrice,
    String? bulkSellingPrice,
    String? serialNumber,
  }) {
    return EditProductState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      errorMessage: errorMessage ?? this.errorMessage,
      successMessage: successMessage ?? this.successMessage,
      initialProduct: initialProduct ?? this.initialProduct,
      name: name ?? this.name,
      description: description ?? this.description,
      category: category ?? this.category,
      bulkUnit: bulkUnit ?? this.bulkUnit,
      pieceUnit: pieceUnit ?? this.pieceUnit,
      unitsPerBulk: unitsPerBulk ?? this.unitsPerBulk,
      bulkCostPrice: bulkCostPrice ?? this.bulkCostPrice,
      pieceSellingPrice: pieceSellingPrice ?? this.pieceSellingPrice,
      bulkSellingPrice: bulkSellingPrice ?? this.bulkSellingPrice,
      serialNumber: serialNumber ?? this.serialNumber,
    );
  }
}
