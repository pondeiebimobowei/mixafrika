import 'package:spine/drift/database.dart';

abstract class StockTransferRepositoryAbstract {
  Future<List<BranchData>> getOtherBranches(String currentBranchId);
  Future<void> executeTransfer({
    required String productId,
    required String fromBranchId,
    required String toBranchId,
    required int quantity,
    required String reason,
    required String userId,
  });
}
