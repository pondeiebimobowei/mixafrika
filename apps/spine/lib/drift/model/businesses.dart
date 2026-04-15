import 'package:drift/drift.dart';
import 'package:spine/drift/model/base.dart';


class Businesses extends Table with TableMixin {
    late final name = text()();
    late final type = text()();
    late final phone = text()();
    late final streetAddress = text()();
    late final city = text()();
    late final state = text()();
    late final country = text()();
    late final isVerified = boolean()();
        

}
