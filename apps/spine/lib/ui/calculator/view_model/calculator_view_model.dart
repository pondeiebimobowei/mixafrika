import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:math_expressions/math_expressions.dart';
import 'package:spine/ui/calculator/state/calculator_state.dart';

class CalculatorViewModel extends Notifier<CalculatorState> {
  @override
  CalculatorState build() {
    return CalculatorState();
  }

  void onNumberPressed(String number) {
    state = state.copyWith(expression: state.expression + number);
    _calculate();
  }

  void onOperatorPressed(String operator) {
    if (state.expression.isEmpty) return;

    final lastChar = state.expression[state.expression.length - 1];
    final operators = ['+', '-', 'x', '÷', '×'];

    if (operators.contains(operator) && operators.contains(lastChar)) {
      state = state.copyWith(
        expression: state.expression.substring(0, state.expression.length - 1) +
            operator,
      );
    } else {
      state = state.copyWith(expression: state.expression + operator);
    }
    _calculate();
  }

  void onBackspacePressed() {
    if (state.expression.isNotEmpty) {
      state = state.copyWith(
        expression: state.expression.substring(0, state.expression.length - 1),
      );
      _calculate();
    }
  }

  void _calculate() {
    try {
      if (state.expression.isEmpty) {
        state = state.copyWith(result: '0');
        return;
      }

      String expStr = state.expression
          .replaceAll('x', '*')
          .replaceAll('×', '*')
          .replaceAll('÷', '/');

      // Remove trailing operators for partial evaluation
      final operators = ['+', '-', '*', '/'];
      while (expStr.isNotEmpty &&
          operators.contains(expStr[expStr.length - 1])) {
        expStr = expStr.substring(0, expStr.length - 1);
      }

      if (expStr.isEmpty) {
        state = state.copyWith(result: '0');
        return;
      }

      Parser p = Parser();
      Expression exp = p.parse(expStr);
      ContextModel cm = ContextModel();
      double eval = exp.evaluate(EvaluationType.REAL, cm);

      if (eval.isInfinite || eval.isNaN) {
        state = state.copyWith(result: 'Error');
      } else {
        String res = '';
        if (eval == eval.toInt()) {
          res = eval.toInt().toString();
        } else {
          res = eval.toStringAsFixed(8);
          if (res.contains('.')) {
            res = res.replaceAll(RegExp(r'0+$'), '').replaceAll(
              RegExp(r'\.$'),
              '',
            );
          }
        }
        state = state.copyWith(result: res);
      }
    } catch (e) {
      // Incomplete formulas
    }
  }

  void onEqualPressed() {
    if (state.expression.isEmpty) return;
    _calculate();

    if (state.result != 'Error') {
      final historyEntry = '${state.expression} = ${state.result}';

      state = state.copyWith(
        expression: state.result,
        result: '0',
        history: [historyEntry, ...state.history],
      );
    }
  }

  void onClearPressed() {
    state = CalculatorState(history: state.history);
  }

  void onPercentagePressed() {
    if (state.expression.isEmpty) return;
    _calculate();
    if (state.result != '0' && state.result != 'Error') {
      try {
        double val = double.parse(state.result);
        val = val / 100;
        String res = val.toString();
        if (val == val.toInt()) {
          res = val.toInt().toString();
        }
        state = state.copyWith(expression: res, result: '0');
      } catch (_) {}
    }
  }

  void onNegatePressed() {
    if (state.expression.isEmpty) return;
    _calculate();
    if (state.result != '0' && state.result != 'Error') {
      try {
        double val = double.parse(state.result);
        val = -val;
        String res = val.toString();
        if (val == val.toInt()) {
          res = val.toInt().toString();
        }
        state = state.copyWith(expression: res, result: '0');
      } catch (_) {}
    }
  }
}

final calculatorViewModelProvider =
    NotifierProvider<CalculatorViewModel, CalculatorState>(
      CalculatorViewModel.new,
    );
