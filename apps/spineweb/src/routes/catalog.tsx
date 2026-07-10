import { Outlet, createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '#/components/admin/dashboard-shell';

export const Route = createFileRoute('/catalog')({
  component: CatalogLayoutRoute,
});

function CatalogLayoutRoute() {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}
