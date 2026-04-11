class CalculatorState {
  final String display;
  final String? operator;
  final double? previousValue;
  final bool shouldResetDisplay;
  final List<String> history;

  CalculatorState({
    this.display = '0',
    this.operator,
    this.previousValue,
    this.shouldResetDisplay = false,
    this.history = const [],
  });

  CalculatorState copyWith({
    String? display,
    String? operator,
    double? previousValue,
    bool? shouldResetDisplay,
    List<String>? history,
  }) {
    return CalculatorState(
      display: display ?? this.display,
      operator: operator ?? this.operator,
      previousValue: previousValue ?? this.previousValue,
      shouldResetDisplay: shouldResetDisplay ?? this.shouldResetDisplay,
      history: history ?? this.history,
    );
  }
}
