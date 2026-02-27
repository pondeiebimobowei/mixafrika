import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

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
      } else if (value == '⌫') {
        if (_expression.isNotEmpty) {
          _expression = _expression.substring(0, _expression.length - 1);
        }
      } else {
        _expression += value;
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

      final normalized = _expression.replaceAll('x', '*').replaceAll('÷', '/');

      // Basic calculation for expression like "100+200"
      // Since we don't have a full parser, we'll support one operation for now
      final regExp = RegExp(r'^(\d+)([\+\-\*\/])(\d+)$');
      final match = regExp.firstMatch(normalized);

      if (match != null) {
        double a = double.parse(match.group(1)!);
        String op = match.group(2)!;
        double b = double.parse(match.group(3)!);

        double res = 0;
        switch (op) {
          case '+':
            res = a + b;
          case '-':
            res = a - b;
          case '*':
            res = a * b;
          case '/':
            res = b != 0 ? a / b : 0;
        }
        _result = res.toInt().toString();
      } else if (RegExp(r'^\d+$').hasMatch(normalized)) {
        _result = normalized;
      }
    } catch (e) {
      // Silent error
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Color(0xFF0F172A),
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Calculator Charge',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close, color: Colors.white24),
              ),
            ],
          ),
          const SizedBox(height: 20),
          TextField(
            controller: _nameController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              labelText: 'Charge Name',
              labelStyle: TextStyle(color: colors.mutedForeground),
              filled: true,
              fillColor: const Color(0xFF1E293B),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(20),
            width: double.infinity,
            decoration: BoxDecoration(
              color: const Color(0xFF020617),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  _expression.isEmpty ? '0' : _expression,
                  style: TextStyle(color: colors.mutedForeground, fontSize: 18),
                ),
                const SizedBox(height: 8),
                Text(
                  '₦$_result',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: GridView.count(
              crossAxisCount: 4,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              children: [
                _buildCalcButton('7'),
                _buildCalcButton('8'),
                _buildCalcButton('9'),
                _buildCalcButton('÷', color: colors.primary),
                _buildCalcButton('4'),
                _buildCalcButton('5'),
                _buildCalcButton('6'),
                _buildCalcButton('x', color: colors.primary),
                _buildCalcButton('1'),
                _buildCalcButton('2'),
                _buildCalcButton('3'),
                _buildCalcButton('-', color: colors.primary),
                _buildCalcButton('C', color: colors.destructive),
                _buildCalcButton('0'),
                _buildCalcButton('⌫'),
                _buildCalcButton('+', color: colors.primary),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              SizedBox(
                width: 72,
                height: 56,
                child: _buildCalcButton('=', color: colors.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: FButton(
                  onPress: _result == '0'
                      ? null
                      : () {
                          widget.onAdd(
                            int.tryParse(_result) ?? 0,
                            _nameController.text,
                          );
                          Navigator.pop(context);
                        },
                  child: const Text('ADD TO CART'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCalcButton(String value, {Color? color}) {
    return GestureDetector(
      onTap: () => _onPress(value),
      child: Container(
        decoration: BoxDecoration(
          color: color?.withValues(alpha: 0.2) ?? const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
        ),
        alignment: Alignment.center,
        child: Text(
          value,
          style: TextStyle(
            color: color ?? Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
