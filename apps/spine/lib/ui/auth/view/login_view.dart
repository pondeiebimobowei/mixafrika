import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/theme/typography.dart';
import 'package:spine/ui/auth/view_model/login_view_model.dart';
import 'package:spine/widget/spinner_widget.dart';
import 'package:spine/widget/toast_widget.dart';

class LoginView extends ConsumerWidget {
  LoginView({super.key});

  final _key = GlobalKey<FormState>();

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(loginViewModelProvider);
    final viewModel = ref.read(loginViewModelProvider.notifier);
    final FColors colors = context.theme.colors;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(12.0),

                child: Column(
                  children: [
                    const SizedBox(height: 50),
                    const SizedBox(height: 30),
                    const Icon(Icons.storefront_outlined, size: 50),
                    const SizedBox(height: 5),

                    const HeadingText(title: 'Login'),
                    const SizedBox(height: 5),
                    const RegularText(title: 'Login in to account'),
                    const SizedBox(height: 50),

                    Form(
                      key: _key,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          FTextFormField.email(
                            control: FTextFieldControl.managed(
                              controller: _emailController,
                            ),
                            hint: 'trader@mixafrika.com',
                            label: const SmallText(title: 'Email', bold: true),
                            autovalidateMode:
                                AutovalidateMode.onUserInteraction,
                            validator: (value) =>
                                (value?.contains('@') ?? false)
                                ? null
                                : 'Please enter a valid email.',
                          ),
                          const SizedBox(height: 30),
                          FTextFormField.password(
                            control: FTextFieldControl.managed(
                              controller: _passwordController,
                            ),
                            label: const SmallText(title: 'Password', bold: true),
                            // style: (style) => style.,
                            autovalidateMode:
                                AutovalidateMode.onUserInteraction,
                            validator: (value) => 8 <= (value?.length ?? 0)
                                ? null
                                : 'Password must be at least 8 characters long.',
                          ),
                          const SizedBox(height: 10),

                          Align(
                            alignment: AlignmentGeometry.centerRight,
                            child: RegularText(
                              title: 'Forgot password!',
                              color: colors.primary,
                            ),
                          ),

                          const SizedBox(height: 30),

                          SizedBox(
                            height: 60,
                            child: FButton(
                              // style: buttonStyle(colors: colors, color: colors.primary, typography: typography, style: style, foregroundColor: colors.primaryForeground),
                              onPress: state.isLoading ? null : () async {
                                if (!_key.currentState!.validate()) {
                                  return; // Form is invalid.
                                }

                                final res = await viewModel.login(email: _emailController.text, password: _passwordController.text);
                                
                                if (context.mounted) {
                                  ToastWidget.makeToast(
                                    context: context, 
                                    description: res.message, 
                                    
                                    icon: res.success ? FIcons.circleCheck : FIcons.circleX, 
                                    color: res.success ? Colors.green : Colors.red
                                  );

                                  if (res.success) {
                                    context.go(Routes.selectBusiness); 
                                  }
                                }
                              },
                              child: state.isLoading 
                                ? SpinnerWidget.spinner()
                                : const RegularText(
                                    title: 'Sign In',
                                    bold: true,
                                  ),
                            ),
                          ),

                          const SizedBox(height: 20),

                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Row(
                                children: [
                                  XSmallText(title: "Don't have an account?"),
                                  GestureDetector(
                                    onTap: () => context.go(Routes.signup),
                                    child: XSmallText(
                                      title: " Register as Trader",
                                      color: colors.primary,
                                      bold: true,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
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
