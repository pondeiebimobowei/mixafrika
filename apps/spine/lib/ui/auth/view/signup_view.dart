import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/auth/view_model/signup_view_model.dart';
import 'dart:ui';

import 'package:spine/widget/toast_widget.dart';
import 'package:spine/widget/spinner_widget.dart';


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

  @override
  Widget build(BuildContext context) {
    final viewModel = ref.read(signupViewModelProvider.notifier);

    return FScaffold(
      header: FHeader(title: const Text('Create Account')),
      child: Stack(
        children: [
          // Background Gradient Element
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: context.theme.colors.primary.withOpacity(0.15),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            right: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: context.theme.colors.primary.withOpacity(0.1),
              ),
            ),
          ),
          // Blur Effect
          BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 50, sigmaY: 50),
            child: Container(color: Colors.transparent),
          ),
          // Content
          SafeArea(
            child: Material(
              color: Colors.transparent,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Personal Information',
                      style: context.theme.typography.xl.copyWith(
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Provide your basic details to get started.',
                      style: context.theme.typography.base.copyWith(
                        color: context.theme.colors.mutedForeground,
                      ),
                    ),
                    const SizedBox(height: 48),
                    
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: context.theme.colors.background,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: context.theme.colors.border.withOpacity(0.5),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 24,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildTextField(
                                  controller: _firstNameController,
                                  label: 'First Name',
                                  hint: 'John',
                                  context: context,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildTextField(
                                  controller: _lastNameController,
                                  label: 'Last Name',
                                  hint: 'Doe',
                                  context: context,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            controller: _phoneController,
                            label: 'Phone Number',
                            hint: 'e.g. 08012345678',
                            keyboardType: TextInputType.phone,
                            context: context,
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            controller: _emailController,
                            label: 'Email Address',
                            hint: 'e.g. trader@example.com',
                            keyboardType: TextInputType.emailAddress,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter email';
                              }
                              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                                return 'Enter a valid email';
                              }
                              return null;
                            },
                            context: context,
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            controller: _passwordController,
                            label: 'Password',
                            hint: 'Minimum 6 characters',
                            obscureText: true,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter password';
                              }
                              if (value.length < 6) return 'Password too short';
                              return null;
                            },
                            context: context,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 48),
                    
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      child: FButton(
                        onPress: _isLoading ? null : () async {
                          if (!_formKey.currentState!.validate()) return;
                          
                          setState(() => _isLoading = true);
                          
                          final res = await viewModel.signup(
                            firstName: _firstNameController.text,
                            lastName: _lastNameController.text,
                            phone: _phoneController.text,
                            email: _emailController.text,
                            password: _passwordController.text,
                          );

                          if (!mounted) return;
                          setState(() => _isLoading = false);

                          ToastWidget.makeToast(
                            context: context, 
                            description: res.message, 
                            icon: res.success ? FIcons.circleCheck : FIcons.circleX, 
                            color: res.success ? Colors.green : Colors.red
                          );
                          
                          if (res.success) {
                            context.go(Routes.businessDetails);
                          }
                        },
                        child: _isLoading 
                          ? SpinnerWidget.spinner()
                          : const Text('Continue to Business Details'),
                      ),
                    ),
                    const SizedBox(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Already have an account? ',
                          style: context.theme.typography.sm.copyWith(
                            color: context.theme.colors.mutedForeground,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => context.go(Routes.login),
                          child: Text(
                            'Sign In',
                            style: context.theme.typography.sm.copyWith(
                              color: context.theme.colors.primary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    TextInputType? keyboardType,
    bool obscureText = false,
    String? Function(String?)? validator,
    required BuildContext context,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: context.theme.typography.sm.copyWith(
            fontWeight: FontWeight.w500,
            color: context.theme.colors.primaryForeground,
          ),
        ),
        const SizedBox(height: 8),
        FTextFormField(
          
          control: FTextFieldControl.managed(
            controller: controller,
            
            
          ),
          obscureText: obscureText,
          validator: validator ??
              (value) => (value == null || value.isEmpty) ? 'Required' : null,
          
          
          
        ),
      ],
    );
  }
}
