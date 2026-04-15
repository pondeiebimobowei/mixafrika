import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

final activeBranchProvider =
    NotifierProvider<ActiveBranchNotifier, BranchData?>(
      ActiveBranchNotifier.new,
    );

class ActiveBranchNotifier extends Notifier<BranchData?> {
  @override
  BranchData? build() {
    return null;
  }

  void setBranch(BranchData branch) {
    state = branch;
  }
}
