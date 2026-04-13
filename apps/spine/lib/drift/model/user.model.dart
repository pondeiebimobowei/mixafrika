import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';

class User extends Table with TableMixin {
    late final userName = text().nullable()();
    late final firstName = text()();
    late final lastName = text()();
    late final email = text()();
    late final password = text()();
    late final role = text()();
    late final isEmailVerified = boolean()();
    late final isVerified = boolean()();
    late final avatar = text().nullable()();

    late final creditScore = integer()();
    late final creditScoreStatus = text()();
}
