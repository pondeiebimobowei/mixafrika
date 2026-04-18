import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:math_expressions/math_expressions.dart';

class SaleCalculatorSheet extends StatefulWidget {
  final Function(int amount, String name) onAdd;
  const SaleCalculatorSheet({super.key, required this.onAdd});

  @override
  State<SaleCalculatorSheet> createState() => _SaleCalculatorSheetState();
}

class _SaleCalculatorSheetState extends State<SaleCalculatorSheet> {
  String _expression = '';
  String _result = '0';
  final TextEditingController _nameController = TextEditingController(
    text: 'Manual Charge',
  );

  void _onPress(String value) {
    setState(() {
      if (value == 'C') {
        _expression = '';
        _result = '0';
      } else if (value == '=') {
        _calculate();
        if (_result != '0' && _result != 'Error') {
          _expression = _result;
          _result = '0';
        }
      } else if (value == '⌫') {
        if (_expression.isNotEmpty) {
          _expression = _expression.substring(0, _expression.length - 1);
        }
        _calculate();
      } else if (value == '%') {
        if (_expression.isNotEmpty) {
          _calculate();
          if (_result != '0' && _result != 'Error') {
            try {
              double val = double.parse(_result);
              val = val / 100;
              String res = val.toString();
              if (val == val.toInt()) {
                res = val.toInt().toString();
              }
              _expression = res;
              _result = '0';
            } catch (_) {}
          }
        }
      } else if (value == '+/-') {
        if (_expression.isNotEmpty) {
          _calculate();
          if (_result != '0' && _result != 'Error') {
            try {
              double val = double.parse(_result);
              val = -val;
              String res = val.toString();
              if (val == val.toInt()) {
                res = val.toInt().toString();
              }
              _expression = res;
              _result = '0';
            } catch (_) {}
          }
        }
      } else {
        // Prevent multiple operators in a row
        final lastChar = _expression.isNotEmpty
            ? _expression[_expression.length - 1]
            : '';
        final operators = ['+', '-', 'x', '÷', '×'];

        if (operators.contains(value) && operators.contains(lastChar)) {
          _expression =
              _expression.substring(0, _expression.length - 1) + value;
        } else {
          _expression += value;
        }
        _calculate();
      }
    });
  }

  void _calculate() {
    try {
      if (_expression.isEmpty) {
        _result = '0';
        return;
      }

      String expStr = _expression
          .replaceAll('x', '*')
          .replaceAll('×', '*')
          .replaceAll('÷', '/');

      // Remove trailing operator for partial evaluation
      final operators = ['+', '-', '*', '/'];
      while (expStr.isNotEmpty &&
          operators.contains(expStr[expStr.length - 1])) {
        expStr = expStr.substring(0, expStr.length - 1);
      }

      if (expStr.isEmpty) {
        _result = '0';
        return;
      }

      Parser p = Parser();
      Expression exp = p.parse(expStr);
      ContextModel cm = ContextModel();
      double eval = exp.evaluate(EvaluationType.REAL, cm);

      if (eval.isInfinite || eval.isNaN) {
        _result = 'Error';
      } else {
        if (eval == eval.toInt()) {
          _result = eval.toInt().toString();
        } else {
          _result = eval.toStringAsFixed(2);
          if (_result.contains('.')) {
            _result = _result
                .replaceAll(RegExp(r'0+$'), '')
                .replaceAll(RegExp(r'\.$'), '');
          }
        }
      }
    } catch (e) {
      // Incomplete expressions
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      decoration: const BoxDecoration(
        color: Color(0xFF0B1121),
        borderRadius: BorderRadius.vertical(top: Radius.circular(40)),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Calculator Charge',
                  style: TextStyle(
                    color: colors.primaryForeground,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: Colors.white54),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: TextField(
              controller: _nameController,
              style: TextStyle(color: colors.primaryForeground, fontSize: 18),
              decoration: InputDecoration(
                labelText: 'Charge Name',
                labelStyle: TextStyle(color: colors.mutedForeground),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Container(
              padding: const EdgeInsets.all(24),
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFF020617),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      _expression.isEmpty ? '0' : _expression,
                      style: TextStyle(
                        color: colors.primaryForeground,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '= $_result',
                    style: TextStyle(
                      color: colors.primary,
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Column(
              children: [
                _buildRow([
                  _buildCalcButton('C', color: colors.destructive),
                  _buildCalcButton('⌫', color: colors.primary),
                  _buildCalcButton('%', color: colors.primary),
                  _buildCalcButton('÷', color: colors.primary),
                ]),
                _buildRow([
                  _buildCalcButton('7'),
                  _buildCalcButton('8'),
                  _buildCalcButton('9'),
                  _buildCalcButton('×', color: colors.primary),
                ]),
                _buildRow([
                  _buildCalcButton('4'),
                  _buildCalcButton('5'),
                  _buildCalcButton('6'),
                  _buildCalcButton('-', color: colors.primary),
                ]),
                _buildRow([
                  _buildCalcButton('1'),
                  _buildCalcButton('2'),
                  _buildCalcButton('3'),
                  _buildCalcButton('+', color: colors.primary),
                ]),
                _buildRow([
                  _buildCalcButton('+/-'),
                  _buildCalcButton('0'),
                  _buildCalcButton('.'),
                  _buildCalcButton(
                    '=',
                    isPrimary: true,
                    color: const Color(0xFF1DB978),
                  ),
                ]),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: SizedBox(
              width: double.infinity,
              height: 56,
              child: FButton(
                onPress: _result == '0' && _expression.isEmpty ||
                        _result == 'Error'
                    ? null
                    : () {
                        String resStr = _result;
                        if (resStr == '0' && _expression.isNotEmpty) {
                          _calculate();
                          resStr = _result;
                        }
                        // if result is floating point, tryParse returns null, so we drop decimal
                        if (resStr.contains('.')) {
                           resStr = resStr.split('.')[0];
                        }
                        widget.onAdd(
                          int.tryParse(resStr) ?? 0,
                          _nameController.text,
                        );
                        Navigator.pop(context);
                      },
                child: const Text(
                  'ADD TO CART',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ],
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

  Widget _buildCalcButton(
    String value, {
    Color? color,
    bool isPrimary = false,
  }) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(6.0),
        child: InkWell(
          onTap: () => _onPress(value),
          borderRadius: BorderRadius.circular(20),
          child: Container(
            decoration: BoxDecoration(
              color: isPrimary
                  ? color
                  : color?.withValues(alpha: 0.15) ?? const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isPrimary
                    ? Colors.transparent
                    : color?.withValues(alpha: 0.3) ??
                        Colors.white.withValues(alpha: 0.05),
              ),
              boxShadow: isPrimary
                  ? [
                      BoxShadow(
                        color: color!.withValues(alpha: 0.4),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      )
                    ]
                  : null,
            ),
            child: Center(
              child: Text(
                value,
                style: TextStyle(
                  color: isPrimary ? Colors.white : color ?? Colors.white,
                  fontSize: value == '⌫' ? 22 : 26,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
