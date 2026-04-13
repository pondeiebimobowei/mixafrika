import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';
import 'package:spine/drift/model/user.model.dart';


class VerificationToken extends Table with TableMixin {
    late final type = text()(); // email verification, password reset, phone otp
    late final token = text()();
    late final expiresAt = dateTime()();

    
    late final userId = text().references(User, #id)();

}
