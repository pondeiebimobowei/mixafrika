import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/theme/typography.dart';
import 'package:spine/ui/products/view_model/products_view_model.dart';

class ProductView extends ConsumerWidget{
  const ProductView({ super.key});

  @override
  @override
Widget build(BuildContext context, WidgetRef ref) {
  // final createProductsState = ref.read(productsViewModelProvider.notifier).createProduct();
  final productsState = ref.watch(productsViewModelProvider);

  return Scaffold(
    body: SafeArea(
      child: productsState.when(
        data: (products) {
          return
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,

            children: [
              ElevatedButton(
                    onPressed: () async {
                      await ref
                          .read(productsViewModelProvider.notifier)
                          .createProduct();

                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text("Account Deleted")),
                        );
                      }
                    },
                    child: const Text("Add Product"),
                  ),
                  
          Expanded(child:
          ListView.builder(
            itemCount: products.length,
            itemBuilder: (context, index) {
              final ProductData product = products[index];

              return Column(
                children: [
                  ElevatedButton(
                    onPressed: () async {
                      await ref
                          .read(productsViewModelProvider.notifier)
                          .deleteProduct(product.id);

                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text("Account Deleted")),
                        );
                      }
                    },
                    child: const Text("Delete Account"),
                  ),
                  ListTile(
                    title: RegularText(title: product.name),
                    subtitle:
                        RegularText(title: product.description),
                  ),
                ],
              );
            },
          )),
            ],
          );
          
        },
        loading: () =>
            const Center(child: CircularProgressIndicator()),
        error: (error, stack) =>
            Center(child: Text('Error: $error')),
      ),
    ),
  );
}
}