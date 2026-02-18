import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:google_fonts/google_fonts.dart';

class RegularText extends StatelessWidget {
  final String title;
  final Color? color;
  final double? fontSize;
  final bool? bold;
  final int? maxLines;
  final TextAlign? textAlign;

  final double? letterSpacing;

  const RegularText({
    super.key,
    required this.title,
    this.fontSize,
    this.color,
    this.bold,
    this.maxLines,
    this.textAlign,
    this.letterSpacing,
  });

  @override
  Widget build(BuildContext context) {
    final FColors colors = context.theme.colors;
    return Text(
      title,
      maxLines: maxLines,
      textAlign: textAlign,
      overflow: maxLines == null ? TextOverflow.ellipsis : null,
      style: GoogleFonts.montserrat(
        fontSize: fontSize ?? 16,
        color: color ?? colors.primaryForeground,
        fontWeight: bold ?? false ? FontWeight.bold : FontWeight.normal,
        letterSpacing: letterSpacing,
      ),
    );
  }
}

class SmallText extends StatelessWidget {
  final String title;
  final double? fontSize;
  final Color? color;
  final bool? bold;
  final int? maxLines;
  final TextAlign? textAlign;

  final double? letterSpacing;

  const SmallText({
    super.key,
    required this.title,
    this.fontSize,
    this.color,
    this.bold,
    this.maxLines,
    this.textAlign,
    this.letterSpacing,
  });

  @override
  Widget build(BuildContext context) {
    final FColors colors = context.theme.colors;

    return Text(
      title,
      maxLines: maxLines,
      textAlign: textAlign,
      overflow: maxLines == null ? TextOverflow.ellipsis : null,
      
      style: GoogleFonts.montserrat(
        fontSize: fontSize ?? 14,
        height: 1.5,
        color: color ?? colors.primaryForeground,
        fontWeight: bold ?? false ? FontWeight.bold : FontWeight.normal,
        letterSpacing: letterSpacing,
      ),
    );
  }
}

class XSmallText extends StatelessWidget {
  final String title;
  final double? fontSize;
  final Color? color;
  final bool? bold;
  final int? maxLines;
  final TextAlign? textAlign;

  final double? letterSpacing;

  const XSmallText({
    super.key,
    required this.title,
    this.fontSize,
    this.color,
    this.bold,
    this.maxLines,
    this.textAlign,
    this.letterSpacing,
  });

  @override
  Widget build(BuildContext context) {
    final FColors colors = context.theme.colors;
    return Text(
      title,
      maxLines: maxLines,
      textAlign: textAlign,
      overflow: maxLines == null ? TextOverflow.ellipsis : null,
      style: GoogleFonts.montserrat(
        fontSize: fontSize ?? 12,
        color: color ?? colors.primaryForeground,
        fontWeight: bold ?? false ? FontWeight.bold : FontWeight.normal,
        letterSpacing: letterSpacing,
      ),
    );
  }
}

class HeadingText extends StatelessWidget {
  final String title;
  final double? fontSize;
  final Color? color;
  final bool? bold;
  final int? maxLines;
  final TextAlign? textAlign;

  final double? letterSpacing;

  const HeadingText({
    super.key,
    required this.title,
    this.fontSize,
    this.color,
    this.bold,
    this.maxLines,
    this.textAlign,
    this.letterSpacing,
  });

  @override
  Widget build(BuildContext context) {
    final FColors colors = context.theme.colors;
    return Text(
      title,
      maxLines: maxLines,
      textAlign: textAlign,
      overflow: maxLines == null ? TextOverflow.ellipsis : null,
      style: GoogleFonts.montserrat(
        fontSize: fontSize ?? 24,
        color: color ?? colors.primaryForeground,
        fontWeight: bold ?? true ? FontWeight.bold : FontWeight.normal,
        letterSpacing: letterSpacing,
      ),
    );
  }
}
