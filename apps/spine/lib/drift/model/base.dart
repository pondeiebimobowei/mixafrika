import 'package:drift/drift.dart';

mixin TableMixin on Table {
  // Primary key column
  late final id = text()();

  late final syncStatus = text()(); // 'pending','synced','conflict'
  late final syncDate = dateTime().nullable()();
  
  // Column for created at timestamp
  late final createdAt = dateTime().withDefault(currentDateAndTime)();
  late final updatedAt = dateTime().withDefault(currentDateAndTime)();
  late final deletedAt = dateTime().nullable()();
}