import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/ui/customers/view/add_edit_customer_sheet.dart';
import 'package:spine/ui/customers/view_model/customers_view_model.dart';
import 'package:spine/widget/spinner_widget.dart';

class CustomersView extends ConsumerWidget {
  const CustomersView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(customersViewModelProvider);
    final viewModel = ref.read(customersViewModelProvider.notifier);
    final colors = context.theme.colors;

    return FScaffold(
      header: FHeader(
        title: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
            ),
            const SizedBox(width: 16),
            const Text(
              'Customers',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        suffixes: [
          FHeaderAction(
            icon: Icon(Icons.add),
            onPress: () => _showAddEditSheet(context),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: Column(
          children: [
            _buildStatsHeader(context, state.customers.length),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
              child: TextField(
                onChanged: viewModel.searchCustomers,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Search by name or phone...',
                  hintStyle: TextStyle(color: colors.mutedForeground),
                  prefixIcon: Icon(Icons.search, color: colors.mutedForeground, size: 20),
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(vertical: 0),
                ),
              ),
            ),
            Expanded(
              child: state.isLoading && state.customers.isEmpty
                  ? Center(child: SpinnerWidget.spinner())
                  : state.customers.isEmpty
                      ? _buildEmptyState(context)
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: state.customers.length,
                          itemBuilder: (context, index) {
                            final customer = state.customers[index];
                            return _buildCustomerCard(context, ref, customer);
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsHeader(BuildContext context, int count) {
    final colors = context.theme.colors;
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [colors.primary, colors.primary.withValues(alpha: 0.7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: colors.primary.withValues(alpha: 0.2),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'YOUR NETWORK',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '$count Customers',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.people_outline, color: Colors.white, size: 28),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomerCard(BuildContext context, WidgetRef ref, CustomerData customer) {
    final colors = context.theme.colors;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: FCard(
        style: FCardStyleDelta.delta(
          decoration: BoxDecorationDelta.delta(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    customer.name.characters.first.toUpperCase(),
                    style: TextStyle(
                      color: colors.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      customer.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      customer.phone ?? 'No phone number',
                      style: TextStyle(color: colors.mutedForeground, fontSize: 12),
                    ),
                  ],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    icon: const Icon(FIcons.pencil, size: 16, color: Colors.white54),
                    onPressed: () => _showAddEditSheet(context, customer: customer),
                  ),
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    icon: const Icon(FIcons.trash2, size: 16, color: Colors.redAccent),
                    onPressed: () => _showDeleteConfirmation(context, ref, customer),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final colors = context.theme.colors;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.person_outline, size: 64, color: colors.mutedForeground),
          const SizedBox(height: 16),
          Text(
            'No customers yet',
            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Add your first customer to get started',
            style: TextStyle(color: colors.mutedForeground),
          ),
          const SizedBox(height: 24),
          FButton(
            onPress: () => _showAddEditSheet(context),
            child: const Text('Add Customer'),
          ),
        ],
      ),
    );
  }

  void _showAddEditSheet(BuildContext context, {CustomerData? customer}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => AddEditCustomerSheet(customer: customer),
    );
  }

  void _showDeleteConfirmation(BuildContext context, WidgetRef ref, CustomerData customer) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Delete Customer?', style: TextStyle(color: Colors.white)),
        content: Text(
          'Are you sure you want to delete ${customer.name}? This action cannot be undone.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(customersViewModelProvider.notifier).deleteCustomer(customer.id);
              Navigator.pop(context);
            },
            child: const Text('Delete', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
    );
  }
}
