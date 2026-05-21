import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:spine/data/repositories/business/business_repository.dart';
import 'package:spine/data/repositories/business/business_repository_remote.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/auth/widget/auth_widgets.dart';
import 'package:spine/ui/business/view_model/select_business_view_model.dart';
import 'package:spine/widget/toast_widget.dart';
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

  final _picker = ImagePicker();
  File? _cacDocument;
  File? _nationalIdDocument;
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
    final image = await _picker.pickImage(source: ImageSource.gallery);

    if (image == null || !mounted) {
      return;
    }

    setState(() {
      if (isCac) {
        _cacDocument = File(image.path);
      } else {
        _nationalIdDocument = File(image.path);
      }
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isSubmitting = true);

    final viewModel = ref.read(businessRepositoryRemoteProvider);
    final res = await viewModel.createBusiness(
      BusinessesData(
        id: const Uuid().v4(),
        syncStatus: 'success',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        isVerified: false,
        name: _nameController.text.trim(),
        type: _typeController.text.trim(),
        streetAddress: _streetController.text.trim(),
        city: _cityController.text.trim(),
        state: _stateController.text.trim(),
        country: _countryController.text.trim(),
        phone: _phoneController.text.trim(),
      ),
    );

    if (!mounted) {
      return;
    }

    setState(() => _isSubmitting = false);

    ToastWidget.makeToast(
      context: context,
      description: res.message,
      icon: res.success ? FIcons.circleCheck : FIcons.circleX,
      color: res.success ? Colors.green : Colors.red,
    );

    if (res.success) {
      final businessRepository = ref.read(businessRepositoryProvider);
      await businessRepository.saveBusinesses([res.data.business]);
      await businessRepository.saveBranches(res.data.branches);

      final selectBusinessProv = ref.read(
        selectBusinessViewModelProvider.notifier,
      );
      await selectBusinessProv.selectBusiness(res.data.business.id);

      if (mounted) {
        context.go(Routes.dashboard);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthShell(
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const AuthHeader(
              eyebrow: 'Business setup',
              title: 'Add your shop details',
              subtitle:
                  'Connect the business profile that will hold your inventory, branches, sales, and team activity.',
            ),
            const SizedBox(height: 24),
            const AuthStepIndicator(
              currentStep: 2,
              labels: ['Profile', 'Business'],
            ),
            const SizedBox(height: 24),
            AuthSurface(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const AuthSectionHeader(
                    icon: Icons.storefront_rounded,
                    title: 'Business profile',
                    subtitle:
                        'Name the business and identify the type of trade you run.',
                  ),
                  const SizedBox(height: 24),
                  AuthTextField(
                    controller: _nameController,
                    label: 'Business name',
                    hint: 'Alaba Electronics',
                    icon: Icons.storefront_rounded,
                    textInputAction: TextInputAction.next,
                    validator: _requiredValidator('Business name is required.'),
                  ),
                  const SizedBox(height: 18),
                  AuthTextField(
                    controller: _typeController,
                    label: 'Business type',
                    hint: 'Retail',
                    icon: Icons.business_center_outlined,
                    textInputAction: TextInputAction.next,
                    validator: _requiredValidator('Business type is required.'),
                  ),
                  const SizedBox(height: 18),
                  AuthTextField(
                    controller: _phoneController,
                    label: 'Business phone',
                    hint: '08012345678',
                    icon: Icons.phone_rounded,
                    keyboardType: TextInputType.phone,
                    textInputAction: TextInputAction.next,
                    autofillHints: const [AutofillHints.telephoneNumber],
                    validator: _requiredValidator(
                      'Business phone is required.',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            AuthSurface(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const AuthSectionHeader(
                    icon: Icons.location_on_outlined,
                    title: 'Location',
                    subtitle:
                        'Use the primary shop address for inventory and branch setup.',
                  ),
                  const SizedBox(height: 24),
                  AuthTextField(
                    controller: _streetController,
                    label: 'Street address',
                    hint: '12 Market Road',
                    icon: Icons.signpost_outlined,
                    textInputAction: TextInputAction.next,
                    validator: _requiredValidator(
                      'Street address is required.',
                    ),
                  ),
                  const SizedBox(height: 18),
                  AuthTextField(
                    controller: _cityController,
                    label: 'City',
                    hint: 'Lagos',
                    icon: Icons.location_city_outlined,
                    textInputAction: TextInputAction.next,
                    validator: _requiredValidator('City is required.'),
                  ),
                  const SizedBox(height: 18),
                  AuthTextField(
                    controller: _stateController,
                    label: 'State',
                    hint: 'Lagos',
                    icon: Icons.map_outlined,
                    textInputAction: TextInputAction.next,
                    validator: _requiredValidator('State is required.'),
                  ),
                  const SizedBox(height: 18),
                  AuthTextField(
                    controller: _countryController,
                    label: 'Country',
                    hint: 'Nigeria',
                    icon: Icons.public_rounded,
                    textInputAction: TextInputAction.done,
                    validator: _requiredValidator('Country is required.'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            AuthSurface(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const AuthSectionHeader(
                    icon: Icons.verified_user_outlined,
                    title: 'Verification documents',
                    subtitle:
                        'Attach the documents you already have. They stay local in this step.',
                  ),
                  const SizedBox(height: 20),
                  AuthUploadTile(
                    title: 'CAC document',
                    subtitle: 'Tap to choose an image',
                    fileName: _fileName(_cacDocument),
                    onTap: () => _pickDocument(true),
                  ),
                  const SizedBox(height: 12),
                  AuthUploadTile(
                    title: 'National ID',
                    subtitle: 'Tap to choose an image',
                    fileName: _fileName(_nationalIdDocument),
                    onTap: () => _pickDocument(false),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 26),
            AuthPrimaryButton(
              label: 'Complete Registration',
              icon: Icons.check_circle_outline_rounded,
              isLoading: _isSubmitting,
              onPressed: _submit,
            ),
          ],
        ),
      ),
    );
  }

  String? _fileName(File? file) {
    if (file == null) {
      return null;
    }
    return file.path.split('/').last;
  }

  String? Function(String?) _requiredValidator(String message) {
    return (value) {
      if ((value ?? '').trim().isEmpty) {
        return message;
      }
      return null;
    };
  }
}
