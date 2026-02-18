import 'dart:io';
import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:image_picker/image_picker.dart';
import 'package:go_router/go_router.dart';

class BusinessDetailsScreen extends StatefulWidget {
  final Map<String, dynamic> userData;

  const BusinessDetailsScreen({super.key, required this.userData});

  @override
  State<BusinessDetailsScreen> createState() => _BusinessDetailsScreenState();
}

class _BusinessDetailsScreenState extends State<BusinessDetailsScreen> {
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
      if (_cacDocument == null || _nationalIdDocument == null) {
        // Fallback to standard ScaffoldMessenger if FToast is broken
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please upload both CAC and National ID documents.'),
          ),
        );
        return;
      }

      setState(() => _isSubmitting = true);
      await Future.delayed(const Duration(seconds: 2));
      setState(() => _isSubmitting = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration Successful!')),
        );
        context.go('/');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FScaffold(
      header: FHeader(title: const Text('Business Details')),
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
                  'Business Information',
                  style: context.theme.typography.xl.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 32),
                _buildTextField(
                  controller: _nameController,
                  label: 'Business Name',
                  hint: 'e.g. Alaba Electronics',
                ),
                const SizedBox(height: 20),
                _buildTextField(
                  controller: _typeController,
                  label: 'Business Type',
                  hint: 'e.g. Retail',
                ),
                const SizedBox(height: 20),
                _buildTextField(
                  controller: _streetController,
                  label: 'Street Address',
                  hint: 'Enter address',
                ),
                const SizedBox(height: 20),
                _buildTextField(
                  controller: _cityController,
                  label: 'City',
                  hint: 'Enter city',
                ),
                const SizedBox(height: 20),
                _buildTextField(
                  controller: _stateController,
                  label: 'State',
                  hint: 'Enter state',
                ),
                const SizedBox(height: 20),
                _buildTextField(
                  controller: _countryController,
                  label: 'Country',
                  hint: 'Enter country',
                ),
                const SizedBox(height: 20),
                _buildTextField(
                  controller: _phoneController,
                  label: 'Business Phone',
                  hint: 'e.g. 080...',
                ),
                const SizedBox(height: 32),
                Text(
                  'Documents',
                  style: context.theme.typography.base.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
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
                FButton(
                  onPress: _isSubmitting ? null : _onSubmit,
                  child: _isSubmitting
                      ? const Text('Submitting...')
                      : const Text('Complete Registration'),
                ),
                const SizedBox(height: 24),
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
  }) {
    return TextFormField(
      controller: controller,
      style: TextStyle(color: context.theme.colors.foreground),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: context.theme.colors.mutedForeground),
        hintText: hint,
        hintStyle: TextStyle(
          color: context.theme.colors.mutedForeground.withOpacity(0.5),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: context.theme.colors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: context.theme.colors.primary),
        ),
      ),
      validator: (value) =>
          (value == null || value.isEmpty) ? 'Required' : null,
    );
  }

  Widget _buildUploadCard({
    required String title,
    required File? file,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: FCard(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(
                file != null ? FIcons.check : FIcons.upload,
                color: context.theme.colors.primary,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    if (file != null)
                      Text(
                        file.path.split('/').last,
                        style: const TextStyle(fontSize: 12),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
