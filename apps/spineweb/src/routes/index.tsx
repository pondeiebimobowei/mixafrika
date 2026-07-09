import { createFileRoute } from '@tanstack/react-router';
import { AlertTriangle, Building2, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { DataTable } from '#/components/admin/data-table';
import { MetricCard } from '#/components/admin/metric-card';
import {
  getBusinesses,
  getBusinessVerifications,
  getOverview,
  getUserVerifications,
  getUsers,
} from '#/lib/admin-api';
import { getSession } from '#/lib/session';

export const Route = createFileRoute('/')({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [ready, setReady] = useState(false);
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [userVerifications, setUserVerifications] = useState<any[]>([]);
  const [businessVerifications, setBusinessVerifications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const session = getSession();

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!session?.token) {
      window.location.replace('/login');
      return;
    }

    Promise.all([
      getOverview(),
      getUsers(),
      getBusinesses(),
      getUserVerifications(),
      getBusinessVerifications(),
    ])
      .then(([overviewRes, usersRes, businessesRes, userVerificationsRes, businessVerificationsRes]) => {
        setOverview(overviewRes.data);
        setUsers(usersRes.data);
        setBusinesses(businessesRes.data);
        setUserVerifications(userVerificationsRes.data);
        setBusinessVerifications(businessVerificationsRes.data);
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'Failed to load dashboard');
      });
  }, [ready, session?.token]);

  if (!ready || !session?.token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-sm uppercase tracking-[0.3em] text-amber-300">Loading secure session...</div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {error ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total users"
            value={overview?.users?.total ?? '—'}
            hint="Platform accounts in the system"
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            label="Verified businesses"
            value={overview?.businesses?.verified ?? '—'}
            hint="Businesses cleared for operations"
            icon={<Building2 className="h-5 w-5" />}
          />
          <MetricCard
            label="Pending verifications"
            value={(overview?.activity?.pendingUserVerifications ?? 0) + (overview?.activity?.pendingBusinessVerifications ?? 0)}
            hint="Identity and KYB reviews waiting"
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <MetricCard
            label="Operational alerts"
            value={(overview?.users?.pendingVerification ?? 0) + (overview?.businesses?.pendingVerification ?? 0)}
            hint="Records needing admin attention"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div id="users">
            <DataTable
              title="Users"
              description="Core account list for support, compliance, and access oversight."
              columns={['Name', 'Email', 'Role', 'Verified']}
              rows={users}
              emptyState="No users were returned from the admin API."
              renderRow={(user) => (
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium text-slate-950">
                    {user.first_name} {user.last_name}
                  </div>
                  <div>{user.email}</div>
                  <div className="capitalize">{user.role}</div>
                  <div>{user.is_verified ? 'Verified' : 'Pending'}</div>
                </div>
              )}
            />
          </div>
          <div id="businesses">
            <DataTable
              title="Businesses"
              description="Business entities and their verification state."
              columns={['Business', 'Location', 'Type', 'Verified']}
              rows={businesses}
              emptyState="No businesses were returned from the admin API."
              renderRow={(business) => (
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium text-slate-950">{business.name}</div>
                  <div>{`${business.city}, ${business.state}`}</div>
                  <div className="capitalize">{business.type}</div>
                  <div>{business.is_verified ? 'Verified' : 'Pending'}</div>
                </div>
              )}
            />
          </div>
        </section>

        <section id="verifications" className="grid gap-4 xl:grid-cols-2">
          <DataTable
            title="User verifications"
            description="Identity checks waiting for compliance review."
            columns={['Verification ID', 'Status', 'Submitted']}
            rows={userVerifications}
            emptyState="No user verifications returned."
            renderRow={(verification) => (
              <div className="grid grid-cols-3 gap-4">
                <div className="font-mono text-xs text-slate-500">{verification.id}</div>
                <div className="capitalize">{verification.status}</div>
                <div>{verification.submitted_at ?? 'Unknown'}</div>
              </div>
            )}
          />
          <DataTable
            title="Business verifications"
            description="KYB reviews and corporate document checks."
            columns={['Verification ID', 'Status', 'Submitted']}
            rows={businessVerifications}
            emptyState="No business verifications returned."
            renderRow={(verification) => (
              <div className="grid grid-cols-3 gap-4">
                <div className="font-mono text-xs text-slate-500">{verification.id}</div>
                <div className="capitalize">{verification.status}</div>
                <div>{verification.submitted_at ?? 'Unknown'}</div>
              </div>
            )}
          />
        </section>

        <section id="operations" className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">Operations lane</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            The backend now exposes the admin overview and moderation endpoints needed for a production
            dashboard. The next slice can add row actions, filters, exports, and immutable audit logs.
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}
