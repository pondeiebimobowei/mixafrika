import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:spine/widget/spinner_widget.dart';

class AuthShell extends StatelessWidget {
  const AuthShell({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;

    return FScaffold(
      childPad: false,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => FocusScope.of(context).unfocus(),
        child: Material(
          color: colors.background,
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  colors.background,
                  Color.alphaBlend(
                    colors.primary.withValues(alpha: 0.08),
                    colors.background,
                  ),
                  Color.alphaBlend(
                    colors.secondary.withValues(alpha: 0.08),
                    colors.background,
                  ),
                  colors.background,
                ],
                stops: const [0, 0.34, 0.72, 1],
              ),
            ),
            child: Stack(
              children: [
                Positioned.fill(child: _AuthBackgroundPattern(colors: colors)),
                SafeArea(
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final width = constraints.maxWidth;
                      final horizontalPadding = width < 380 ? 20.0 : 24.0;

                      return SingleChildScrollView(
                        keyboardDismissBehavior:
                            ScrollViewKeyboardDismissBehavior.onDrag,
                        padding: EdgeInsets.fromLTRB(
                          horizontalPadding,
                          24,
                          horizontalPadding,
                          32,
                        ),
                        child: Align(
                          alignment: Alignment.topCenter,
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 520),
                            child: child,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class AuthHeader extends StatelessWidget {
  const AuthHeader({
    super.key,
    required this.eyebrow,
    required this.title,
    required this.subtitle,
  });

  final String eyebrow;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final typography = context.theme.typography;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AuthBrandMark(),
        const SizedBox(height: 28),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            color: colors.primary.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: colors.primary.withValues(alpha: 0.28)),
          ),
          child: Text(
            eyebrow,
            style: typography.xs.copyWith(
              color: colors.primary,
              fontWeight: FontWeight.w800,
              height: 1,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          title,
          style: typography.xl4.copyWith(
            color: colors.primaryForeground,
            fontWeight: FontWeight.w900,
            height: 1.05,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          subtitle,
          style: typography.base.copyWith(
            color: colors.mutedForeground,
            height: 1.45,
          ),
        ),
      ],
    );
  }
}

class AuthBrandMark extends StatelessWidget {
  const AuthBrandMark({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final typography = context.theme.typography;

    return Row(
      children: [
        Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: colors.primary,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: colors.primary.withValues(alpha: 0.28),
                blurRadius: 24,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: Icon(
            Icons.inventory_2_outlined,
            color: colors.primaryForeground,
            size: 24,
          ),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'SPINE',
              style: typography.lg.copyWith(
                color: colors.primaryForeground,
                fontWeight: FontWeight.w900,
                height: 1,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Business command center',
              style: typography.xs.copyWith(
                color: colors.mutedForeground,
                height: 1,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class AuthStepIndicator extends StatelessWidget {
  const AuthStepIndicator({
    super.key,
    required this.currentStep,
    required this.labels,
  });

  final int currentStep;
  final List<String> labels;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;

    return Row(
      children: [
        for (var index = 0; index < labels.length; index++) ...[
          Expanded(
            child: _AuthStepPill(
              label: labels[index],
              number: index + 1,
              isActive: currentStep == index + 1,
              isComplete: currentStep > index + 1,
            ),
          ),
          if (index != labels.length - 1)
            Container(
              width: 18,
              height: 1,
              color: colors.border.withValues(alpha: 0.8),
            ),
        ],
      ],
    );
  }
}

class AuthSurface extends StatelessWidget {
  const AuthSurface({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
  });

  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: colors.card.withValues(alpha: 0.94),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: colors.border.withValues(alpha: 0.72)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.22),
            blurRadius: 26,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      child: child,
    );
  }
}

class AuthSectionHeader extends StatelessWidget {
  const AuthSectionHeader({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final typography = context.theme.typography;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: colors.primary.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: colors.primary.withValues(alpha: 0.18)),
          ),
          child: Icon(icon, color: colors.primary, size: 19),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: typography.base.copyWith(
                  color: colors.primaryForeground,
                  fontWeight: FontWeight.w800,
                  height: 1.15,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                subtitle,
                style: typography.sm.copyWith(
                  color: colors.mutedForeground,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class AuthTextField extends StatelessWidget {
  const AuthTextField({
    super.key,
    required this.controller,
    required this.label,
    required this.hint,
    required this.icon,
    this.keyboardType,
    this.textInputAction,
    this.autofillHints,
    this.validator,
    this.obscureText = false,
    this.enabled = true,
  });

  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData icon;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Iterable<String>? autofillHints;
  final String? Function(String?)? validator;
  final bool obscureText;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    if (obscureText) {
      return FTextFormField.password(
        control: FTextFieldControl.managed(controller: controller),
        label: Text(label),
        hint: hint,
        keyboardType: keyboardType,
        textInputAction: textInputAction ?? TextInputAction.done,
        autofillHints: autofillHints ?? const [AutofillHints.password],
        enabled: enabled,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        validator: validator,
        prefixBuilder: (context, style, obscure, variants) =>
            _FieldIcon(icon: icon),
      );
    }

    return FTextFormField(
      control: FTextFieldControl.managed(controller: controller),
      label: Text(label),
      hint: hint,
      keyboardType: keyboardType,
      textInputAction: textInputAction ?? TextInputAction.next,
      autofillHints: autofillHints,
      enabled: enabled,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      validator: validator,
      prefixBuilder: (context, style, variants) => _FieldIcon(icon: icon),
    );
  }
}

class AuthPrimaryButton extends StatelessWidget {
  const AuthPrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon = Icons.arrow_forward_rounded,
    this.isLoading = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData icon;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 54,
      child: FButton(
        onPress: isLoading ? null : onPressed,
        prefix: isLoading ? null : Icon(icon, size: 18),
        child: isLoading
            ? SpinnerWidget.spinner(size: 20)
            : Text(label, maxLines: 1, overflow: TextOverflow.ellipsis),
      ),
    );
  }
}

class AuthInlineLink extends StatelessWidget {
  const AuthInlineLink({
    super.key,
    required this.prompt,
    required this.action,
    required this.onTap,
  });

  final String prompt;
  final String action;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final typography = context.theme.typography;

    return Wrap(
      alignment: WrapAlignment.center,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        Text(
          prompt,
          style: typography.sm.copyWith(
            color: colors.mutedForeground,
            height: 1.35,
          ),
        ),
        GestureDetector(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 4),
            child: Text(
              action,
              style: typography.sm.copyWith(
                color: colors.primary,
                fontWeight: FontWeight.w800,
                height: 1.35,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class AuthUploadTile extends StatelessWidget {
  const AuthUploadTile({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.fileName,
  });

  final String title;
  final String subtitle;
  final String? fileName;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final typography = context.theme.typography;
    final hasFile = fileName != null;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: hasFile
              ? colors.primary.withValues(alpha: 0.1)
              : colors.background.withValues(alpha: 0.58),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: hasFile
                ? colors.primary.withValues(alpha: 0.52)
                : colors.border.withValues(alpha: 0.72),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: hasFile
                    ? colors.primary.withValues(alpha: 0.16)
                    : colors.muted.withValues(alpha: 0.62),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                hasFile
                    ? Icons.check_circle_rounded
                    : Icons.upload_file_outlined,
                color: hasFile ? colors.primary : colors.mutedForeground,
                size: 20,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: typography.sm.copyWith(
                      color: colors.primaryForeground,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    fileName ?? subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: typography.xs.copyWith(
                      color: hasFile ? colors.primary : colors.mutedForeground,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: colors.mutedForeground,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }
}

class _AuthStepPill extends StatelessWidget {
  const _AuthStepPill({
    required this.label,
    required this.number,
    required this.isActive,
    required this.isComplete,
  });

  final String label;
  final int number;
  final bool isActive;
  final bool isComplete;

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final typography = context.theme.typography;
    final accent = isActive || isComplete ? colors.primary : colors.border;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      decoration: BoxDecoration(
        color: isActive
            ? colors.primary.withValues(alpha: 0.12)
            : colors.card.withValues(alpha: 0.72),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: accent.withValues(alpha: 0.62)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 22,
            height: 22,
            decoration: BoxDecoration(
              color: isComplete ? colors.primary : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: accent),
            ),
            child: Center(
              child: isComplete
                  ? Icon(
                      Icons.check_rounded,
                      color: colors.primaryForeground,
                      size: 14,
                    )
                  : Text(
                      '$number',
                      style: typography.xs.copyWith(
                        color: isActive
                            ? colors.primary
                            : colors.mutedForeground,
                        fontWeight: FontWeight.w900,
                        height: 1,
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: typography.xs.copyWith(
                color: isActive ? colors.primary : colors.mutedForeground,
                fontWeight: FontWeight.w800,
                height: 1,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AuthBackgroundPattern extends StatelessWidget {
  const _AuthBackgroundPattern({required this.colors});

  final FColors colors;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(painter: _AuthBackgroundPainter(colors));
  }
}

class _AuthBackgroundPainter extends CustomPainter {
  const _AuthBackgroundPainter(this.colors);

  final FColors colors;

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = colors.border.withValues(alpha: 0.08)
      ..strokeWidth = 1;
    const spacing = 34.0;

    for (double x = 0; x <= size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }

    for (double y = 0; y <= size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    final accentPaint = Paint()
      ..color = colors.primary.withValues(alpha: 0.08)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    final path = Path()
      ..moveTo(size.width * 0.62, 0)
      ..lineTo(size.width, size.height * 0.2)
      ..lineTo(size.width * 0.34, size.height);
    canvas.drawPath(path, accentPaint);
  }

  @override
  bool shouldRepaint(covariant _AuthBackgroundPainter oldDelegate) {
    return oldDelegate.colors != colors;
  }
}

class _FieldIcon extends StatelessWidget {
  const _FieldIcon({required this.icon});

  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Icon(icon, color: context.theme.colors.mutedForeground, size: 18);
  }
}
