import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/ui/calculator/state/calculator_state.dart';

class CalculatorViewModel extends Notifier<CalculatorState> {
  @override
  CalculatorState build() {
    return CalculatorState();
  }

  void onNumberPressed(String number) {
    if (state.shouldResetDisplay) {
      state = state.copyWith(display: number, shouldResetDisplay: false);
    } else {
      state = state.copyWith(
        display: state.display == '0' ? number : state.display + number,
      );
    }
  }

  void onOperatorPressed(String operator) {
    if (state.operator != null && !state.shouldResetDisplay) {
      calculate();
    }
    state = state.copyWith(
      operator: operator,
      previousValue: double.tryParse(state.display),
      shouldResetDisplay: true,
    );
  }

  void calculate() {
    if (state.operator == null || state.previousValue == null) return;

    final currentValue = double.tryParse(state.display) ?? 0;
    double result = 0;

    switch (state.operator) {
      case '+':
        result = state.previousValue! + currentValue;
        break;
      case '-':
        result = state.previousValue! - currentValue;
        break;
      case '×':
        result = state.previousValue! * currentValue;
        break;
      case '÷':
        if (currentValue != 0) {
          result = state.previousValue! / currentValue;
        } else {
          state = state.copyWith(display: 'Error', shouldResetDisplay: true);
          return;
        }
        break;
    }

    final resultStr = _formatResult(result);
    final historyEntry =
        '${state.previousValue} ${state.operator} $currentValue = $resultStr';

    state = state.copyWith(
      display: resultStr,
      operator: null,
      previousValue: null,
      shouldResetDisplay: true,
      history: [historyEntry, ...state.history],
    );
  }

  void onClearPressed() {
    state = CalculatorState();
  }

  void onPercentagePressed() {
    final currentValue = double.tryParse(state.display) ?? 0;
    state = state.copyWith(display: (currentValue / 100).toString());
  }

  void onNegatePressed() {
    if (state.display == '0') return;
    if (state.display.startsWith('-')) {
      state = state.copyWith(display: state.display.substring(1));
    } else {
      state = state.copyWith(display: '-${state.display}');
    }
  }

  String _formatResult(double result) {
    if (result == result.toInt()) {
      return result.toInt().toString();
    }
    return result.toString();
  }
}

final calculatorViewModelProvider =
    NotifierProvider<CalculatorViewModel, CalculatorState>(
      CalculatorViewModel.new,
    );
