import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/theme/app-theme.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;

class EditBusinessSheet extends ConsumerStatefulWidget {
  final UserBusinessData? business;

  const EditBusinessSheet({super.key, this.business});

  @override
  ConsumerState<EditBusinessSheet> createState() => _EditBusinessSheetState();
}

class _EditBusinessSheetState extends ConsumerState<EditBusinessSheet> {
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;
  late TextEditingController _cityController;
  late TextEditingController _stateController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.business?.name ?? '');
    _phoneController = TextEditingController(text: widget.business?.phone ?? '');
    _addressController = TextEditingController(text: widget.business?.streetAddress ?? '');
    _cityController = TextEditingController(text: widget.business?.city ?? '');
    _stateController = TextEditingController(text: widget.business?.state ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final isEditing = widget.business != null;

    return Material(
      color: Colors.transparent,
      child: Container(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          left: 20,
          right: 20,
          top: 24,
        ),
        decoration: BoxDecoration(
          color: colors.background,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isEditing ? 'Edit Shop' : 'Add New Shop',
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: colors.secondary,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.close, size: 20, color: colors.foreground),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildLabel('SHOP NAME'),
          const SizedBox(height: 8),
          _buildTextField(
            controller: _nameController,
            hint: 'Enter shop name',
          ),
          const SizedBox(height: 16),
          _buildLabel('PHONE NUMBER'),
          const SizedBox(height: 8),
          _buildTextField(
            controller: _phoneController,
            hint: 'Enter phone number',
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 16),
          _buildLabel('STREET ADDRESS'),
          const SizedBox(height: 8),
          _buildTextField(
            controller: _addressController,
            hint: 'Enter street address',
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('CITY'),
                    const SizedBox(height: 8),
                    _buildTextField(
                      controller: _cityController,
                      hint: 'City',
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('STATE'),
                    const SizedBox(height: 8),
                    _buildTextField(
                      controller: _stateController,
                      hint: 'State',
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          FButton(
            child: Text(isEditing ? 'Save Changes' : 'Create Shop'),
            onPress: () {
              if (_nameController.text.isEmpty) return;

              if (isEditing) {
                final updated = widget.business!.copyWith(
                  name: _nameController.text,
                  phone: _phoneController.text,
                  streetAddress: _addressController.text,
                  city: _cityController.text,
                  state: _stateController.text,
                  updatedAt: DateTime.now(),
                );
                Navigator.pop(context, updated);
              } else {
                final companion = UserBusinessCompanion(
                  id: drift.Value(const Uuid().v4()),
                  userId: const drift.Value('1'), // Hardcoded for now
                  collectionId: const drift.Value('1'),
                  name: drift.Value(_nameController.text),
                  type: const drift.Value('business'),
                  phone: drift.Value(_phoneController.text),
                  streetAddress: drift.Value(_addressController.text),
                  city: drift.Value(_cityController.text),
                  state: drift.Value(_stateController.text),
                  country: const drift.Value('Nigeria'),
                  verification: const drift.Value(''),
                  syncStatus: const drift.Value('pending'),
                  createdAt: drift.Value(DateTime.now()),
                  updatedAt: drift.Value(DateTime.now()),
                );
                Navigator.pop(context, companion);
              }
            },
          ),
        ],
      ),
    ),
  );
}
  Widget _buildLabel(String text) {
    return Text(
      text,
      style: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.grey[400],
        letterSpacing: 1.0,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    IconData? prefixIcon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        style: const TextStyle(color: Colors.white, fontSize: 16),
        decoration: InputDecoration(
          prefixIcon:
              prefixIcon != null
                  ? Icon(prefixIcon, color: Colors.grey[500])
                  : null,
          hintText: hint,
          hintStyle: TextStyle(
            color: Colors.grey[500],
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),
        ),
      ),
    );
  }
}
