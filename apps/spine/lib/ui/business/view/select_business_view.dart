import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';
import 'package:spine/drift/database.dart';
import 'package:spine/routing/routes.dart';
import 'package:spine/ui/business/view_model/select_business_view_model.dart';
import 'package:spine/widget/icon_widget.dart';
import 'package:spine/widget/spinner_widget.dart';

class SelectBusinessView extends ConsumerWidget {
  const SelectBusinessView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final businessAsync = ref.watch(selectBusinessViewModelProvider);
    final theme = context.theme;
    final colors = theme.colors;

    return FScaffold(
      header: FHeader(title: const Text('Select Business')),
      child: Material(
        color: colors.background,
        child: businessAsync.when(
          data: (state) => _buildContent(context, ref, state.business),
          loading: () => Center(child: SpinnerWidget.spinner()),
          error: (error, stack) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 48, color: colors.error),
                  const SizedBox(height: 16),
                  Text(
                    'Failed to load businesses',
                    style: theme.typography.body.lg.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    error.toString(),
                    style: theme.typography.body.sm.copyWith(
                      color: colors.mutedForeground,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  FButton(
                    onPress: () => ref.refresh(selectBusinessViewModelProvider),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(
    BuildContext context,
    WidgetRef ref,
    List<BusinessesData> businesses,
  ) {
    final colors = context.theme.colors;

    if (businesses.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: colors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(FLucideIcons.store, size: 48, color: colors.primary),
            ),
            const SizedBox(height: 24),
            Text(
              'No Businesses Found',
              style: context.theme.typography.body.xl.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'You haven\'t added any businesses yet. Create one to get started.',
              textAlign: TextAlign.center,
              style: context.theme.typography.body.sm.copyWith(
                color: colors.mutedForeground,
              ),
            ),
            const SizedBox(height: 32),
            FButton(
              child: const Text('Create New Business'),
              onPress: () => context.push(
                Routes.signup,
              ), // Navigate to signup/business creation
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: businesses.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final business = businesses[index];
        return FCard(
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(FLucideIcons.store, color: colors.primary),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      business.name,
                      style: context.theme.typography.body.sm.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      business.type,
                      style: context.theme.typography.body.sm.copyWith(
                        color: colors.mutedForeground,
                      ),
                    ),
                  ],
                ),
              ),
              FButton(
                variant: FButtonVariant.ghost,
                onPress: () async {
                  await ref
                      .read(selectBusinessViewModelProvider.notifier)
                      .selectBusiness(business.id);
                  if (context.mounted) {
                    context.go(Routes.dashboard);
                  }
                },
                child: const IconWidget(icon: Icons.chevron_right),
              ),
            ],
          ),
        );
      },
    );
  }
}
