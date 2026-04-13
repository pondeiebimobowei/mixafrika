import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/collection.model.dart';


class Cluster extends Table with TableMixin {
    late final name = text()();
    late final status = text()();
    late final about = text()();
    late final duration = integer()();
    late final roi = integer()();
    late final totalFundsRaised = integer()();
    late final targetFundRaisingAmount = integer()();
    late final repayment = text()();
    late final isActive = boolean()();
    late final coverImage = text()();
    late final startDate = dateTime()();
    late final endDate = dateTime()();
    late final description = text()();

    late final collectionId = text().nullable().references(Collection, #id)();
}
