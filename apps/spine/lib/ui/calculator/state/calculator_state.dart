class CalculatorState {
  final String expression;
  final String result;
  final List<String> history;

  CalculatorState({
    this.expression = '',
    this.result = '0',
    this.history = const [],
  });

  CalculatorState copyWith({
    String? expression,
    String? result,
    List<String>? history,
  }) {
    return CalculatorState(
      expression: expression ?? this.expression,
      result: result ?? this.result,
      history: history ?? this.history,
    );
  }
}
