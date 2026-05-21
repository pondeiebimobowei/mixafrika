import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/auth/view_model/signup_view_model.dart';
import 'package:spine/ui/auth/widget/auth_widgets.dart';
import 'package:spine/widget/toast_widget.dart';

class SignupView extends ConsumerStatefulWidget {
  const SignupView({super.key});

  @override
  ConsumerState<SignupView> createState() => _SignupViewState();
}

class _SignupViewState extends ConsumerState<SignupView> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    final viewModel = ref.read(signupViewModelProvider.notifier);
    final res = await viewModel.signup(
      firstName: _firstNameController.text.trim(),
      lastName: _lastNameController.text.trim(),
      phone: _phoneController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) {
      return;
    }

    setState(() => _isLoading = false);

    ToastWidget.makeToast(
      context: context,
      description: res.message,
      icon: res.success ? FIcons.circleCheck : FIcons.circleX,
      color: res.success ? Colors.green : Colors.red,
    );

    if (res.success) {
      context.go(Routes.businessDetails);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthShell(
      child: AutofillGroup(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const AuthHeader(
                eyebrow: 'Trader onboarding',
                title: 'Create your account',
                subtitle:
                    'Set up your personal profile first, then connect the business you want to manage.',
              ),
              const SizedBox(height: 24),
              const AuthStepIndicator(
                currentStep: 1,
                labels: ['Profile', 'Business'],
              ),
              const SizedBox(height: 24),
              AuthSurface(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const AuthSectionHeader(
                      icon: Icons.badge_outlined,
                      title: 'Personal profile',
                      subtitle:
                          'This keeps your account identifiable across shops and sales activity.',
                    ),
                    const SizedBox(height: 24),
                    AuthTextField(
                      controller: _firstNameController,
                      label: 'First name',
                      hint: 'John',
                      icon: Icons.person_outline_rounded,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.givenName],
                      validator: _requiredValidator('First name is required.'),
                    ),
                    const SizedBox(height: 18),
                    AuthTextField(
                      controller: _lastNameController,
                      label: 'Last name',
                      hint: 'Doe',
                      icon: Icons.person_outline_rounded,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.familyName],
                      validator: _requiredValidator('Last name is required.'),
                    ),
                    const SizedBox(height: 18),
                    AuthTextField(
                      controller: _phoneController,
                      label: 'Phone number',
                      hint: '08012345678',
                      icon: Icons.phone_rounded,
                      keyboardType: TextInputType.phone,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.telephoneNumber],
                      validator: _requiredValidator(
                        'Phone number is required.',
                      ),
                    ),
                    const SizedBox(height: 18),
                    AuthTextField(
                      controller: _emailController,
                      label: 'Email address',
                      hint: 'trader@example.com',
                      icon: Icons.alternate_email_rounded,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.email],
                      validator: _emailValidator,
                    ),
                    const SizedBox(height: 18),
                    AuthTextField(
                      controller: _passwordController,
                      label: 'Password',
                      hint: 'Minimum 6 characters',
                      icon: Icons.lock_outline_rounded,
                      obscureText: true,
                      textInputAction: TextInputAction.done,
                      autofillHints: const [AutofillHints.newPassword],
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter password.';
                        }
                        if (value.length < 6) {
                          return 'Password too short.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 26),
                    AuthPrimaryButton(
                      label: 'Continue to Business Details',
                      isLoading: _isLoading,
                      onPressed: _submit,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),
              AuthInlineLink(
                prompt: 'Already have an account? ',
                action: 'Sign In',
                onTap: () => context.go(Routes.login),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String? Function(String?) _requiredValidator(String message) {
    return (value) {
      if ((value ?? '').trim().isEmpty) {
        return message;
      }
      return null;
    };
  }

  String? _emailValidator(String? value) {
    final text = value?.trim() ?? '';
    if (text.isEmpty) {
      return 'Please enter email.';
    }
    final emailPattern = RegExp(r'^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailPattern.hasMatch(text)) {
      return 'Enter a valid email.';
    }
    return null;
  }
}
