import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

final activeBusinessesProvider =
    NotifierProvider<ActiveBusinessesNotifier, BusinessesData?>(
      ActiveBusinessesNotifier.new,
    );

class ActiveBusinessesNotifier extends Notifier<BusinessesData?> {
  @override
  BusinessesData? build() {
    return null;
  }

  void setBusiness(BusinessesData businesses) {
    state = businesses;
  }
}
