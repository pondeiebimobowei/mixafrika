import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/router.dart';
import 'package:spine/theme/app-theme.dart';
import 'package:uuid/uuid.dart';


void main() async {

  WidgetsFlutterBinding.ensureInitialized();

  final database = AppDatabase();

  await database
      .into(database.product)
      .insert(
        ProductCompanion.insert(
          id: Uuid().v4(),
          name: 'A product name',
          bulkUnitName: 'Bulk unit name',
          pieceUnitName: 'Piece unit name',
          unitsPerBulk: 'Units per bulk',
          costPricePerPiece: 'Cost price per piece',
          sellingPricePerPiece: 'Selling price per piece',
          sellingPricePerBulk: 'Selling price per bulk',
          category: 'Category',
          serialNumber: 'Serial number',
          stockBalances: 'Stock balances',
          batches: 'Batches',
          bulkQuantity: 'Bulk quantity',
          pieceQuantity: 'Piece quantity',
          imageUrl: 'Image URL',
          images: 'Images',
          reviews: 'Reviews',
          // createdAt: DateTime.now(),
          // updatedAt: DateTime.now(),
          // deletedAt: DateTime.now(),
          syncStatus: 'Sync status',
          // syncDate: DateTime.now(),
        ),
      );
  List<ProductData> allItems = await database.select(database.product).get();

  print('items in database: $allItems');
  
  runApp(const Application());
}

class Application extends StatelessWidget {
  const Application({super.key});

  @override
  Widget build(BuildContext context){
    final theme = AppTheme.dark;

    return MaterialApp.router(
      title: 'Spine',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      supportedLocales: FLocalizations.supportedLocales,
      localizationsDelegates: const [...FLocalizations.localizationsDelegates],
      theme: theme.toApproximateMaterialTheme(),
      themeMode: ThemeMode.dark,
      builder: (_, child) => FTheme(
        data: theme,
        child: FToaster(child: FTooltipGroup(child: child!)),
      ),
    );
  }
}

class Example extends StatefulWidget {
  const Example({super.key});

  @override
  State<Example> createState() => _ExampleState();
}

class _ExampleState extends State<Example> {
  int _count = 0;

  @override
  Widget build(BuildContext context) => FScaffold(
    child: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        spacing: 10,
        children: [
          Text('Count: $_count'),
          FButton(
            onPress: () => setState(() => _count++),
            suffix: const Icon(FIcons.chevronsUp),
            child: Text(
              'Increases',
              style: TextStyle(color: context.theme.colors.primary),
            ),
          ),
          const SizedBox(height: 20),
          FButton(
            onPress: () => context.go('/splash'),
            child: const Text('Go to Splash'),
          ),
        ],
      ),
    ),
  );
}
