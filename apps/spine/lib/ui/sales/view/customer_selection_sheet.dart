import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/sales/view_model/create_sale_view_model.dart';

class CustomerSelectionSheet extends ConsumerStatefulWidget {
  const CustomerSelectionSheet({super.key});

  @override
  ConsumerState<CustomerSelectionSheet> createState() => _CustomerSelectionSheetState();
}

class _CustomerSelectionSheetState extends ConsumerState<CustomerSelectionSheet> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  bool _isAdding = false;

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(createSaleViewModelProvider);
    final viewModel = ref.read(createSaleViewModelProvider.notifier);
    final colors = context.theme.colors;

    return Container(
      padding: const EdgeInsets.all(20),
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _isAdding ? 'ADD NEW CUSTOMER' : 'SELECT CUSTOMER',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close, color: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 20),
          if (!_isAdding) ...[
            TextField(
              controller: _searchController,
              onChanged: viewModel.searchCustomers,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search by name or phone...',
                hintStyle: TextStyle(color: colors.mutedForeground),
                prefixIcon: Icon(Icons.search, color: colors.mutedForeground),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: state.customers.isEmpty
                  ? Center(
                      child: Text(
                        'No customers found',
                        style: TextStyle(color: colors.mutedForeground),
                      ),
                    )
                  : ListView.separated(
                      itemCount: state.customers.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final customer = state.customers[index];
                        return Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: ListTile(
                            onTap: () {
                              viewModel.selectCustomer(customer);
                              Navigator.pop(context);
                            },
                            title: Text(
                              customer.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            subtitle: Text(
                              customer.phone ?? 'No phone',
                              style: TextStyle(color: colors.mutedForeground),
                            ),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                              onPressed: () => viewModel.deleteCustomer(customer.id),
                            ),
                          ),
                        );
                      },
                    ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FButton(
                onPress: () => setState(() => _isAdding = true),
                child: const Text('Add New Customer'),
              ),
            ),
          ] else ...[
            FTextField(
              control: FTextFieldControl.managed(
                controller: _nameController,
              ),
              label: const Text('Full Name'),
              hint: 'Enter customer name',
            ),
            const SizedBox(height: 16),
            FTextField(
              control: FTextFieldControl.managed(
                controller: _phoneController,
              ),
              label: const Text('Phone Number'),
              hint: 'Enter phone number',
            ),
            const SizedBox(height: 32),
            Row(
              children: [
                Expanded(
                  child: FButton(
                    onPress: () => setState(() => _isAdding = false),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: FButton(
                    onPress: () {
                      if (_nameController.text.isNotEmpty) {
                        viewModel.addCustomer(_nameController.text, _phoneController.text);
                        setState(() {
                          _isAdding = false;
                          _nameController.clear();
                          _phoneController.clear();
                        });
                      }
                    },
                    child: const Text('Save Customer'),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
