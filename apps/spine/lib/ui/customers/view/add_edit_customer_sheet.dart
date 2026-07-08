import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/customers/view_model/customers_view_model.dart';
import 'package:spine/widget/toast_widget.dart';

class AddEditCustomerSheet extends ConsumerStatefulWidget {
  final CustomerData? customer;

  const AddEditCustomerSheet({super.key, this.customer});

  @override
  ConsumerState<AddEditCustomerSheet> createState() => _AddEditCustomerSheetState();
}

class _AddEditCustomerSheetState extends ConsumerState<AddEditCustomerSheet> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.customer != null) {
      _nameController.text = widget.customer!.name;
      _phoneController.text = widget.customer!.phone ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.theme.colors;
    final isEditing = widget.customer != null;

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 20,
        right: 20,
        top: 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isEditing ? 'EDIT CUSTOMER' : 'ADD NEW CUSTOMER',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close, color: Colors.white54),
              ),
            ],
          ),
          const SizedBox(height: 24),
          FTextField(
            label: const Text('Customer Name'),
            hint: 'e.g. John Doe',
            control: FTextFieldControl.managed(controller: _nameController),
          ),
          const SizedBox(height: 20),
          FTextField(
            label: const Text('Phone Number'),
            hint: 'e.g. 08012345678',
            control: FTextFieldControl.managed(controller: _phoneController),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: FButton(
              onPress: () {
                if (_nameController.text.isNotEmpty) {
                  final viewModel = ref.read(customersViewModelProvider.notifier);
                  if (isEditing) {
                    viewModel.updateCustomer(
                      widget.customer!.id,
                      _nameController.text,
                      _phoneController.text,
                    );
                    ToastWidget.makeToast(
                      context: context,
                      title: 'Customer updated successfully',
                      icon: FLucideIcons.circleCheck,
                      variant: .primary
                    );
                  } else {
                    viewModel.addCustomer(
                      _nameController.text,
                      _phoneController.text,
                    );
                    ToastWidget.makeToast(
                      context: context,
                      title: 'Customer added successfully',
                      icon: FLucideIcons.circleCheck,
                      variant: .primary
                    );
                  }
                  Navigator.pop(context);
                }
              },
              child: Text(isEditing ? 'Save Changes' : 'Add Customer'),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}
