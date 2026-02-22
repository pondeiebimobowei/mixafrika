import 'package:drift/drift.dart';


class Product extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get name => text().withLength(min: 6, max: 32)();
  TextColumn get description => text().named('body')();
  DateTimeColumn get createdAt => dateTime().nullable()();
}