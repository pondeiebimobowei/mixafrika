import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/ui/calculator/view_model/calculator_view_model.dart';
import 'package:spine/widget/icon_widget.dart';

class CalculatorView extends ConsumerWidget {
  const CalculatorView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(calculatorViewModelProvider);
    final viewModel = ref.read(calculatorViewModelProvider.notifier);
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const IconWidget(icon: Icons.arrow_back),
            ),
            const SizedBox(width: 20),
            Text(
              'Calculator',
              style: TextStyle(
                fontSize: 20,
                color: colors.primaryForeground,
              ),
            ),
          ],
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: Column(
          children: [
            // Display Area
            Expanded(
              flex: 2,
              child: Container(
                padding: const EdgeInsets.all(24),
                alignment: Alignment.bottomRight,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (state.history.isNotEmpty)
                      Text(
                        state.history.first,
                        style: TextStyle(
                          color: colors.mutedForeground,
                          fontSize: 16,
                        ),
                      ),
                    const SizedBox(height: 8),
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        state.display,
                        style: TextStyle(
                          color: colors.primaryForeground,
                          fontSize: 64,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Keypad
            Expanded(
              flex: 5,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(32),
                  ),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
                child: Column(
                  children: [
                    _buildRow([
                      _buildButton(
                        'C',
                        colors.destructive,
                        () => viewModel.onClearPressed(),
                      ),
                      _buildButton(
                        '+/-',
                        colors.primary,
                        () => viewModel.onNegatePressed(),
                      ),
                      _buildButton(
                        '%',
                        colors.primary,
                        () => viewModel.onPercentagePressed(),
                      ),
                      _buildButton(
                        '÷',
                        const Color(0xFF1DB978),
                        () => viewModel.onOperatorPressed('÷'),
                      ),
                    ]),
                    _buildRow([
                      _buildButton(
                        '7',
                        null,
                        () => viewModel.onNumberPressed('7'),
                      ),
                      _buildButton(
                        '8',
                        null,
                        () => viewModel.onNumberPressed('8'),
                      ),
                      _buildButton(
                        '9',
                        null,
                        () => viewModel.onNumberPressed('9'),
                      ),
                      _buildButton(
                        '×',
                        const Color(0xFF1DB978),
                        () => viewModel.onOperatorPressed('×'),
                      ),
                    ]),
                    _buildRow([
                      _buildButton(
                        '4',
                        null,
                        () => viewModel.onNumberPressed('4'),
                      ),
                      _buildButton(
                        '5',
                        null,
                        () => viewModel.onNumberPressed('5'),
                      ),
                      _buildButton(
                        '6',
                        null,
                        () => viewModel.onNumberPressed('6'),
                      ),
                      _buildButton(
                        '-',
                        const Color(0xFF1DB978),
                        () => viewModel.onOperatorPressed('-'),
                      ),
                    ]),
                    _buildRow([
                      _buildButton(
                        '1',
                        null,
                        () => viewModel.onNumberPressed('1'),
                      ),
                      _buildButton(
                        '2',
                        null,
                        () => viewModel.onNumberPressed('2'),
                      ),
                      _buildButton(
                        '3',
                        null,
                        () => viewModel.onNumberPressed('3'),
                      ),
                      _buildButton(
                        '+',
                        const Color(0xFF1DB978),
                        () => viewModel.onOperatorPressed('+'),
                      ),
                    ]),
                    _buildRow([
                      _buildButton(
                        '0',
                        null,
                        () => viewModel.onNumberPressed('0'),
                        flex: 2,
                      ),
                      _buildButton(
                        '.',
                        null,
                        () => viewModel.onNumberPressed('.'),
                      ),
                      _buildButton(
                        '=',
                        const Color(0xFF1DB978),
                        () => viewModel.calculate(),
                      ),
                    ]),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(List<Widget> children) {
    return Expanded(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: children,
      ),
    );
  }

  Widget _buildButton(
    String text,
    Color? color,
    VoidCallback onPressed, {
    int flex = 1,
  }) {
    return Expanded(
      flex: flex,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              color: color?.withValues(alpha: 0.2) ?? const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color:
                    color?.withValues(alpha: 0.5) ??
                    Colors.white.withValues(alpha: 0.05),
              ),
            ),
            child: Center(
              child: Text(
                text,
                style: TextStyle(
                  color: color ?? Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
