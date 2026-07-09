import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { getBusinessVerifications, getUserVerifications, reviewBusinessVerification, reviewUserVerification } from '#/lib/admin-api';

export const Route = createFileRoute('/verifications')({
  component: VerificationsPage,
});

function VerificationsPage() {
  const [userVerifications, setUserVerifications] = useState<any[]>([]);
  const [businessVerifications, setBusinessVerifications] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const load = async () => {
    const [usersRes, businessesRes] = await Promise.all([getUserVerifications(), getBusinessVerifications()]);
    setUserVerifications(usersRes.data);
    setBusinessVerifications(businessesRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <ModulePage title="Verifications" description="Review and approve user and business verifications." sidebar={<div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-600">Open a record to inspect its data, then approve or reject it.</div>}>
        <EntityTable
          title="User verifications"
          description="Click a row to inspect the full verification record."
          rows={userVerifications}
          columns={['ID', 'Status', 'Submitted']}
          selectedId={selected?.id}
          onSelect={(id) => setSelected(userVerifications.find((row) => row.id === id) ?? null)}
          getRowLabel={(row) => (
            <>
              <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
              <td className="px-4 py-3">{row.status}</td>
              <td className="px-4 py-3">{row.submitted_at}</td>
            </>
          )}
        />
        <div className="mt-8">
          <EntityTable
            title="Business verifications"
            description="Click a row to inspect the full KYB record."
            rows={businessVerifications}
            columns={['ID', 'Status', 'Submitted']}
            selectedId={selected?.id}
            onSelect={(id) => setSelected(businessVerifications.find((row) => row.id === id) ?? null)}
            getRowLabel={(row) => (
              <>
                <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.submitted_at ?? row.createdAt}</td>
              </>
            )}
          />
        </div>
        {selected ? (
          <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950">Selected verification</h3>
            <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(selected, null, 2)}</pre>
            <div className="mt-4 flex gap-2">
              <button className="rounded-xl border px-3 py-2" onClick={async () => { if (selected.user_id) await reviewUserVerification(selected.id, { status: 'verified' }); else await reviewBusinessVerification(selected.id, { status: 'verified' }); await load(); }}>Approve</button>
              <button className="rounded-xl border px-3 py-2 text-rose-600" onClick={async () => { if (selected.user_id) await reviewUserVerification(selected.id, { status: 'rejected', rejection_reason: 'Rejected by admin' }); else await reviewBusinessVerification(selected.id, { status: 'rejected', rejection_reason: 'Rejected by admin' }); await load(); }}>Reject</button>
            </div>
          </section>
        ) : null}
      </ModulePage>
    </DashboardShell>
  );
}
