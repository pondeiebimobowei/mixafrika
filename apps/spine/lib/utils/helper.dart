import 'package:intl/intl.dart';

String toDateTime(String date) {
  return DateFormat('h:mm a').format(DateTime.parse(date));
}

String toDate(String date) {
  return DateFormat('dd/MM/yyyy').format(DateTime.parse(date));
}

String toEllipsis(String text, { int length = 6}) {
  if (text.length > length) {
    return '${text.substring(0, 4)}...${text.substring(text.length - 4)}';
  }
  return text;
}

String formatCurrency(num amount, { int decimal = 0}) {
  return NumberFormat.currency(
    locale: 'en_US',   // change based on your locale
    symbol: '₦',      // currency symbol
    decimalDigits: decimal,  // number of decimal places
  ).format(amount);
}

String normalizeName(String name) {
  return name
      .toLowerCase()
      .trim()
      .replaceAll(RegExp(r'[^\w\s]'), '') // remove punctuation
      .replaceAll(RegExp(r'\s+'), ' ');   // collapse spaces
}