class AddProductState {
  final String name;
  final String barcode;
  final String bulkUnit;
  final String retailUnit;
  final String conversionFactor;
  final String sellPricePerRetail;
  final String sellPricePerBulk;
  final bool isLoading;
  final bool isSuccess;
  final String? errorMessage;

  const AddProductState({
    this.name = '',
    this.barcode = '',
    this.bulkUnit = '',
    this.retailUnit = '',
    this.conversionFactor = '',
    this.sellPricePerRetail = '',
    this.sellPricePerBulk = '',
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMessage,
  });

  AddProductState copyWith({
    String? name,
    String? barcode,
    String? bulkUnit,
    String? retailUnit,
    String? conversionFactor,
    String? sellPricePerRetail,
    String? sellPricePerBulk,
    bool? isLoading,
    bool? isSuccess,
    String? errorMessage,
  }) {
    return AddProductState(
      name: name ?? this.name,
      barcode: barcode ?? this.barcode,
      bulkUnit: bulkUnit ?? this.bulkUnit,
      retailUnit: retailUnit ?? this.retailUnit,
      conversionFactor: conversionFactor ?? this.conversionFactor,
      sellPricePerRetail: sellPricePerRetail ?? this.sellPricePerRetail,
      sellPricePerBulk: sellPricePerBulk ?? this.sellPricePerBulk,
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMessage: errorMessage, // This allows clearing the error message
    );
  }
}
