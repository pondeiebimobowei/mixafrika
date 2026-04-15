import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;

class EditBranchSheet extends ConsumerStatefulWidget {
  final BranchData? branch;

  const EditBranchSheet({super.key, this.branch});

  @override
  ConsumerState<EditBranchSheet> createState() => _EditBranchSheetState();
}

class _EditBranchSheetState extends ConsumerState<EditBranchSheet> {
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;
  late TextEditingController _cityController;
  late TextEditingController _stateController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.branch?.name ?? '');
    _phoneController = TextEditingController(
      text: widget.branch?.phone ?? '',
    );
    _addressController = TextEditingController(
      text: widget.branch?.streetAddress ?? '',
    );
    _cityController = TextEditingController(text: widget.branch?.city ?? '');
    _stateController = TextEditingController(
      text: widget.branch?.state ?? '',
    );
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
    final isEditing = widget.branch != null;

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
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: colors.primaryForeground.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isEditing ? 'Edit Shop Profile' : 'Add New Shop',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: colors.primaryForeground.withValues(alpha: 0.05),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.close,
                      size: 18,
                      color: colors.primaryForeground.withValues(alpha: 0.4),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            _buildFormSection(context, 'SHOP IDENTITY', [
              _buildLabel('SHOP NAME'),
              const SizedBox(height: 10),
              _buildTextField(
                controller: _nameController,
                hint: 'e.g. Mix Africa Lagos',
                prefixIcon: Icons.storefront_outlined,
              ),
              const SizedBox(height: 20),
              _buildLabel('PHONE NUMBER'),
              const SizedBox(height: 10),
              _buildTextField(
                controller: _phoneController,
                hint: 'Support phone number',
                prefixIcon: Icons.phone_outlined,
                keyboardType: TextInputType.phone,
              ),
            ]),
            const SizedBox(height: 32),
            _buildFormSection(context, 'LOCATION DETAILS', [
              _buildLabel('STREET ADDRESS'),
              const SizedBox(height: 10),
              _buildTextField(
                controller: _addressController,
                hint: 'Full street address',
                prefixIcon: Icons.location_on_outlined,
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildLabel('CITY'),
                        const SizedBox(height: 10),
                        _buildTextField(
                          controller: _cityController,
                          hint: 'City',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildLabel('STATE'),
                        const SizedBox(height: 10),
                        _buildTextField(
                          controller: _stateController,
                          hint: 'State',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ]),
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: FButton(
                child: Text(isEditing ? 'Save Changes' : 'Create Shop'),
                onPress: () {
                  if (_nameController.text.isEmpty) return;

                  if (isEditing) {
                    final updated = widget.branch!.copyWith(
                      name: _nameController.text,
                      phone: _phoneController.text,
                      streetAddress: _addressController.text,
                      city: _cityController.text,
                      state: _stateController.text,
                      updatedAt: DateTime.now(),
                    );
                    Navigator.pop(context, updated);
                  } else {
                    final companion = BranchCompanion(
                      id: drift.Value(const Uuid().v4()),
                      name: drift.Value(_nameController.text),
                      phone: drift.Value(_phoneController.text),
                      streetAddress: drift.Value(_addressController.text),
                      city: drift.Value(_cityController.text),
                      state: drift.Value(_stateController.text),
                      country: const drift.Value('Nigeria'),
                      collectionId: drift.Value(''),

                      isHeadOffice: drift.Value(false),
                      syncStatus: const drift.Value('pending'),
                      createdAt: drift.Value(DateTime.now()),
                      updatedAt: drift.Value(DateTime.now()),
                    );
                    Navigator.pop(context, companion);
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormSection(
    BuildContext context,
    String title,
    List<Widget> fields,
  ) {
    final colors = context.theme.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 12,
              height: 2,
              decoration: BoxDecoration(
                color: colors.primary,
                borderRadius: BorderRadius.circular(1),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                color: colors.primary.withValues(alpha: 0.8),
                letterSpacing: 2.0,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        ...fields,
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        color: Colors.white60,
        letterSpacing: 0.5,
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
        color: const Color(0xFF1E293B).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        decoration: InputDecoration(
          prefixIcon: prefixIcon != null
              ? Icon(prefixIcon, color: Colors.white38, size: 20)
              : null,
          hintText: hint,
          hintStyle: const TextStyle(
            color: Colors.white24,
            fontSize: 15,
            fontWeight: FontWeight.w400,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 18,
          ),
        ),
      ),
    );
  }
}
