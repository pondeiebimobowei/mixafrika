import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';

final activeUserBusinessProvider =
    NotifierProvider<ActiveUserBusinessNotifier, UserBusinessData?>(
        ActiveUserBusinessNotifier.new);

class ActiveUserBusinessNotifier extends Notifier<UserBusinessData?> {
  @override
  UserBusinessData? build() {
    return null;
  }

  void setBusiness(UserBusinessData userBusiness) {
    state = userBusiness;
  }
}