import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:spine/theme/app-theme.dart';

void main() {
  runApp(const Application());
}

class Application extends StatelessWidget {
  const Application({super.key});

  @override
  Widget build(BuildContext context) {
    
    final theme = AppTheme.dark;
    // final themeLight = FThemes.neutral.light;

    return MaterialApp(
      title: 'Spine',
      supportedLocales: FLocalizations.supportedLocales,
      localizationsDelegates: const [...FLocalizations.localizationsDelegates],

      theme: theme.toApproximateMaterialTheme(),
      themeMode: .dark,
      builder: (_, child) => FTheme(
        data: theme,
        child: FToaster(child: FTooltipGroup(child: child!)),
      ),
      home: const FScaffold(
        child: Example(),
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
  Widget build(BuildContext context) => Center(
    child: Column(
      mainAxisSize: .min,
      spacing: 10,
      children: [
        Text('Count: $_count', ),
        FButton(
          onPress: () => setState(() => _count++),
          suffix: const Icon(FIcons.chevronsUp),
          child:  Text('Increases', style: TextStyle(color: context.theme.colors.primary),),
        ),
      ],
    ),
  );
}
