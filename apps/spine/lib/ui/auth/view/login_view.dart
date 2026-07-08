import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/theme/text-typography.dart';
import 'package:spine/ui/auth/view_model/login_view_model.dart';
import 'package:spine/ui/auth/widget/auth_widgets.dart';
import 'package:spine/widget/toast_widget.dart';

class LoginView extends ConsumerStatefulWidget {
  const LoginView({super.key});

  @override
  ConsumerState<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends ConsumerState<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final viewModel = ref.read(loginViewModelProvider.notifier);
    final res = await viewModel.login(
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) {
      return;
    }

    ToastWidget.makeToast(
      context: context,
      title: res.message,
      icon: res.success ? FLucideIcons.circleCheck : FLucideIcons.circleX,
      variant: res.success ? .primary : .destructive
    );

    if (res.success) {
      context.go(Routes.selectBusiness);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(loginViewModelProvider);
    final colors = context.theme.colors;
    final typography = context.theme.typography;

    return AuthShell(
      child: AutofillGroup(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const AuthHeader(
                eyebrow: 'Secure workspace',
                title: 'Welcome back',
                subtitle:
                    'Sign in to keep stock, sales, branches, and teams moving from one focused mobile workspace.',
              ),
              const SizedBox(height: 28),
              AuthSurface(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Access your account',
                      style: typography.body.lg.copyWith(
                        color: colors.primaryForeground,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 8),
                    RegularText(
                      title: 'Use the same trader account you created for SPINE.',
                      color: colors.mutedForeground, 
                    ),
                    const SizedBox(height: 24),
                    AuthTextField(
                      controller: _emailController,
                      label: 'Email address',
                      hint: 'trader@mixafrika.com',
                      icon: Icons.alternate_email_rounded,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.email],
                      validator: (value) {
                        final text = value?.trim() ?? '';
                        if (text.contains('@')) {
                          return null;
                        }
                        return 'Please enter a valid email.';
                      },
                    ),
                    const SizedBox(height: 18),
                    AuthTextField(
                      controller: _passwordController,
                      label: 'Password',
                      hint: 'Enter your password',
                      icon: Icons.lock_outline_rounded,
                      obscureText: true,
                      textInputAction: TextInputAction.done,
                      autofillHints: const [AutofillHints.password],
                      validator: (value) => 8 <= (value?.length ?? 0)
                          ? null
                          : 'Password must be at least 8 characters long.',
                    ),
                    const SizedBox(height: 24),
                    AuthPrimaryButton(
                      label: 'Sign In',
                      icon: Icons.login_rounded,
                      isLoading: state.isLoading,
                      onPressed: _submit,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),
              AuthInlineLink(
                prompt: "Don't have an account? ",
                action: 'Register as Trader',
                onTap: () => context.go(Routes.signup),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
