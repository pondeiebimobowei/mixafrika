import 'package:drift/drift.dart';

mixin TableMixin on Table {
  // Primary key column
  late final id = text()();

  late final syncStatus = text()();
  late final syncDate = dateTime().withDefault(currentDateAndTime)();
  
  // Column for created at timestamp
  late final createdAt = dateTime().withDefault(currentDateAndTime)();
  late final updatedAt = dateTime().withDefault(currentDateAndTime)();
  late final deletedAt = dateTime().withDefault(currentDateAndTime)();
}