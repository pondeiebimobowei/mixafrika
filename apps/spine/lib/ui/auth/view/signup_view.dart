import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/auth/view_model/signup_view_model.dart';


class SignupView extends ConsumerWidget {
  SignupView({ super.key });

  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final viewModel = ref.read(signupViewModelProvider.notifier);

    return FScaffold(
      header: FHeader(title: const Text('Create Account')),
      child: Material(
        color: Colors.transparent,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Personal Information',
                  style: context.theme.typography.xl.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Provide your basic details to get started.',
                  style: context.theme.typography.sm.copyWith(
                    color: context.theme.colors.mutedForeground,
                  ),
                ),
                const SizedBox(height: 32),
                _buildTextField(
                  controller: _firstNameController,
                  label: 'First Name',
                  hint: 'Enter your first name',
                  context: context,
                ),
                const SizedBox(height: 20),
                _buildTextField(
                  controller: _lastNameController,
                  label: 'Last Name',
                  hint: 'Enter your last name',
                  context: context,
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
                    if (value == null || value.isEmpty)
                      return 'Please enter email';
                    if (!RegExp(
                      r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                    ).hasMatch(value))
                      return 'Enter a valid email';
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
                    if (value == null || value.isEmpty)
                      return 'Please enter password';
                    if (value.length < 6) return 'Password too short';
                    return null;
                  },
                  context: context,

                ),
                const SizedBox(height: 40),
                FButton(
                  onPress: () async {
                    final res = await viewModel.signup(
                      firstName: _firstNameController.text,
                      lastName: _lastNameController.text,
                      phone: _phoneController.text,
                      email: _emailController.text,
                      password: _passwordController.text,
                    );

                    if (res.success && context.mounted) {
                      context.go(Routes.businessDetails);
                    } else if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(res.message)),
                      );
                    }


                  },
                  child: const Text('Continue to Business Details'),
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Already have an account? ',
                      style: context.theme.typography.sm,
                    ),
                    GestureDetector(
                      child: Text(
                        'Sign In',
                        style: context.theme.typography.sm.copyWith(
                          color: context.theme.colors.primary,
                          fontWeight: FontWeight.bold,
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
    
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: TextStyle(color: context.theme.colors.primaryForeground),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: context.theme.colors.mutedForeground),
        hintText: hint,
        hintStyle: TextStyle(
          color: context.theme.colors.mutedForeground.withOpacity(0.5),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: context.theme.colors.border),
          borderRadius: BorderRadius.circular(8),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: context.theme.colors.primary),
          borderRadius: BorderRadius.circular(8),
        ),
        errorBorder: OutlineInputBorder(
          borderSide: BorderSide(color: context.theme.colors.destructive),
          borderRadius: BorderRadius.circular(8),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderSide: BorderSide(color: context.theme.colors.destructive),
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      validator:
          validator ??
          (value) => (value == null || value.isEmpty) ? 'Required' : null,
    );
  }
}
