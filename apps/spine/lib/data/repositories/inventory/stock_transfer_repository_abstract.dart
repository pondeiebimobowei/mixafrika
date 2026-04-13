import 'package:spine/drift/database.dart';

abstract class StockTransferRepositoryAbstract {
  Future<List<BusinessesData>> getOtherBranches(String currentBusinessId);
  Future<void> executeTransfer({
    required String productId,
    required String fromBranchId,
    required String toBranchId,
    required int quantity,
    required String reason,
    required String userId,
  });
}
