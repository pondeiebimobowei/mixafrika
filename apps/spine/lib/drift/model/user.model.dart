import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';

class User extends Table with TableMixin {
    late final image = text().nullable();
    late final userName = text().nullable();
    late final firstName = text()();
    late final lastName = text()();
    late final email = text()();
    late final password = text()();
    late final role = text()();
    late final isEmailVerified = boolean()();
    late final creditScore = text()();
    late final creditScoreStatus = text()();
    late final verification = text().nullable();
    late final businessVerification = text().nullable();
    late final trader = text().nullable();
}
