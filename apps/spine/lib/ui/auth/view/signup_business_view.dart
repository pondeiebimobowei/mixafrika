import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:image_picker/image_picker.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/data/repositories/business/business_repository.dart';
import 'package:spine/data/repositories/business/business_repository_remote.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/business/view_model/select_business_view_model.dart';
import 'package:uuid/uuid.dart';

class SignupBusinessView extends ConsumerStatefulWidget {
  const SignupBusinessView({super.key});

  @override
  ConsumerState<SignupBusinessView> createState() => _SignupBusinessViewState();
}

class _SignupBusinessViewState extends ConsumerState<SignupBusinessView> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _typeController = TextEditingController();
  final _streetController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _countryController = TextEditingController();
  final _phoneController = TextEditingController();

  File? _cacDocument;
  File? _nationalIdDocument;
  final _picker = ImagePicker();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _nameController.dispose();
    _typeController.dispose();
    _streetController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _countryController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _pickDocument(bool isCac) async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        if (isCac) {
          _cacDocument = File(image.path);
        } else {
          _nationalIdDocument = File(image.path);
        }
      });
    }
  }

  void _onSubmit() async {
    if (_formKey.currentState!.validate()) {

      setState(() => _isSubmitting = true);
      final viewModel = ref.read(businessRepositoryRemoteProvider);
      final res = await viewModel.createBusiness(
        BusinessesData(
          id: Uuid().v4(),
          syncStatus: 'success',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          isVerified: false,
          name: _nameController.text,
          type: _typeController.text,
          streetAddress: _streetController.text,
          city: _cityController.text,
          state: _stateController.text,
          country: _countryController.text,
          phone: _phoneController.text,

        )
      );

      if (!mounted) return;
      setState(() => _isSubmitting = false);

      if (res.success) {

        final businessRepository = ref.read(businessRepositoryProvider);
        await businessRepository.saveBusinesses([res.data.business]);
        await businessRepository.saveBranches(res.data.branches);

        final selectBusinessProv = ref.read(selectBusinessViewModelProvider.notifier);
        await selectBusinessProv.selectBusiness(res.data.business.id);

        context.go(Routes.dashboard);
      } else {
        print("error: ${res.message}");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FScaffold(
      header: FHeader(title: const Text('Business Details')),
      child: Stack(
        children: [
          // Background Gradient Elements
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: context.theme.colors.primary.withOpacity(0.12),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: context.theme.colors.primary.withOpacity(0.08),
              ),
            ),
          ),
          // Blur Effect
          BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 50, sigmaY: 50),
            child: Container(color: Colors.transparent),
          ),
          // Scrollable Content
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
                      'Business Information',
                      style: context.theme.typography.xl.copyWith(
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tell us about your business setup.',
                      style: context.theme.typography.base.copyWith(
                        color: context.theme.colors.mutedForeground,
                      ),
                    ),
                    const SizedBox(height: 40),
                    
                    // Glassmorphic Form Container
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
                          _buildTextField(
                            controller: _nameController,
                            label: 'Business Name',
                            hint: 'e.g. Alaba Electronics',
                            context: context,
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            controller: _typeController,
                            label: 'Business Type',
                            hint: 'e.g. Retail',
                            context: context,
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            controller: _streetController,
                            label: 'Street Address',
                            hint: 'Enter address',
                            context: context,
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              Expanded(
                                child: _buildTextField(
                                  controller: _cityController,
                                  label: 'City',
                                  hint: 'Enter city',
                                  context: context,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildTextField(
                                  controller: _stateController,
                                  label: 'State',
                                  hint: 'Enter state',
                                  context: context,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            controller: _countryController,
                            label: 'Country',
                            hint: 'Enter country',
                            context: context,
                          ),
                          const SizedBox(height: 20),
                          _buildTextField(
                            controller: _phoneController,
                            label: 'Business Phone',
                            hint: 'e.g. 08012345678',
                            keyboardType: TextInputType.phone,
                            context: context,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 48),

                    // Documents Section
                    Text(
                      'Verification Documents',
                      style: context.theme.typography.lg.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Upload your official business documents.',
                      style: context.theme.typography.sm.copyWith(
                        color: context.theme.colors.mutedForeground,
                      ),
                    ),
                    const SizedBox(height: 20),
                    
                    _buildUploadCard(
                      title: 'CAC Document',
                      file: _cacDocument,
                      onTap: () => _pickDocument(true),
                    ),
                    const SizedBox(height: 16),
                    _buildUploadCard(
                      title: 'National ID',
                      file: _nationalIdDocument,
                      onTap: () => _pickDocument(false),
                    ),
                    const SizedBox(height: 48),

                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      child: FButton(
                        onPress: _isSubmitting ? null : _onSubmit,
                        child: _isSubmitting
                            ? const SizedBox(
                                width: 20, 
                                height: 20, 
                                child: CircularProgressIndicator(strokeWidth: 2)
                              )
                            : const Text('Complete Registration'),
                      ),
                    ),
                    const SizedBox(height: 24),
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
    required BuildContext context,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: context.theme.typography.sm.copyWith(
            fontWeight: FontWeight.w500,
            color: context.theme.colors.foreground,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          style: TextStyle(color: context.theme.colors.foreground),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(
              color: context.theme.colors.mutedForeground.withOpacity(0.5),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            filled: true,
            fillColor: context.theme.colors.muted.withOpacity(0.3),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide.none,
              borderRadius: BorderRadius.circular(12),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: context.theme.colors.primary, width: 2),
              borderRadius: BorderRadius.circular(12),
            ),
            errorBorder: OutlineInputBorder(
              borderSide: BorderSide(color: context.theme.colors.destructive),
              borderRadius: BorderRadius.circular(12),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderSide: BorderSide(color: context.theme.colors.destructive, width: 2),
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          validator: (value) =>
              (value == null || value.isEmpty) ? 'Required' : null,
        ),
      ],
    );
  }

  Widget _buildUploadCard({
    required String title,
    required File? file,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: context.theme.colors.background,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: file != null 
                ? context.theme.colors.primary.withOpacity(0.5)
                : context.theme.colors.border.withOpacity(0.5),
            width: file != null ? 2 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: file != null 
                    ? context.theme.colors.primary.withOpacity(0.1)
                    : context.theme.colors.muted.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: Icon(
                file != null ? FIcons.check : FIcons.upload,
                color: file != null 
                    ? context.theme.colors.primary
                    : context.theme.colors.mutedForeground,
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: context.theme.typography.sm.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  if (file != null)
                    Text(
                      file.path.split('/').last,
                      style: context.theme.typography.xs.copyWith(
                        color: context.theme.colors.primary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    )
                  else
                    Text(
                      'Tap to upload document',
                      style: context.theme.typography.xs.copyWith(
                        color: context.theme.colors.mutedForeground,
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
