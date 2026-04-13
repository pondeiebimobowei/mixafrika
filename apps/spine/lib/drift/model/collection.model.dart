import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';


class Collection extends Table with TableMixin {
    late final name = text()();
    late final description = text()();
    late final totalTraders = integer()();
    late final about = text()();
    late final coverImage = text()();
    late final roi = integer()();
    late final minInvestment = integer()();
    late final city = text()();
    late final state = text()();
    late final country = text()();

}
