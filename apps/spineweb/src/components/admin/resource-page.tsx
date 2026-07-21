import type { ReactNode } from 'react';
import { DashboardShell } from './dashboard-shell';
import { Drawer } from './drawer';
import { EntityTable } from './entity-table';
import { ModulePage } from './module-page';

export function ResourcePage<T>({
  title,
  description,
  sidebar,
  rows,
  columns,
  selected,
  selectedId,
  onSelect,
  selectedTitle,
  selectedSubtitle,
  onClose,
  renderRow,
  renderDrawer,
}: {
  title: string;
  description: string;
  sidebar: ReactNode;
  rows: T[];
  columns: string[];
  selected: T | null;
  selectedId?: string;
  onSelect: (id: string) => void;
  selectedTitle: string;
  selectedSubtitle?: string;
  onClose: () => void;
  renderRow: (row: T) => ReactNode;
  renderDrawer: (row: T | null) => ReactNode;
}) {
  return (
    <DashboardShell>
      <ModulePage title={title} description={description} sidebar={sidebar}>
        <EntityTable
          title={title}
          description={description}
          rows={rows as { id: string }[]}
          columns={columns}
          selectedId={selectedId}
          onSelect={onSelect}
          getRowLabel={renderRow as (row: any) => ReactNode}
        />
        <Drawer open={Boolean(selected)} title={selectedTitle} subtitle={selectedSubtitle} onClose={onClose}>
          {renderDrawer(selected)}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
