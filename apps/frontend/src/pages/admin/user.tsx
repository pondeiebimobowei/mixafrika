import { roles, type Roles } from "../../../../../packages/shared/src/enums/index";
import { Download, Filter, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";
import AdminLayout from "@/components/layouts/admin-layout";
import { useFetchUsers, useUsersState } from "@/store/hooks/users.hook";

export default function UserPage(){
  const [selectedRole, setSelectedRole] = useState<Roles | 'All'>('All');
  const navigate = useNavigate()

  const { data: { user } } = useUsersState()
  useFetchUsers()

  const filteredUsers = selectedRole === 'All' 
    ? user 
    : user?.filter(u => u.role === selectedRole);

    const diff_roles = [...Object.values(roles), 'All'] as (Roles | 'All')[]

    return (
        <AdminLayout>
            <div className="space-y-6 min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="bg-white p-1 rounded-xl inline-flex shadow-sm border border-gray-100">
                        {diff_roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-4 py-2 capitalize rounded-lg text-sm font-medium transition-all ${
                                    selectedRole === role 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {role === 'All' ? 'All Users' : `${role}s`}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors">
                            <Filter size={18} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors">
                            <Download size={18} />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-700 text-sm font-medium shadow-lg shadow-primary/25 transition-all transform active:scale-95">
                            <Plus size={18} />
                            Add User
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">KYC</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((user) => (
                                    <tr 
                                        key={user.id} 
                                        onClick={() => navigate(`/admin/users/${user.id}`)}
                                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                            {/* <Avatar src={user.avatarUrl} alt={user.name} /> */}
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{user.first_name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{user.role}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={user.verification?.status || 'verified'} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">₦{0}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={user.verification?.status || 'verified'} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-500">{new Date(user?.createdAt || '').toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                                            <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">Showing <span className="font-medium">{filteredUsers.length}</span> results</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}


export const StatusBadge = ({ status }: { status: 'verified' | 'unverified' | 'rejected' | 'pending' }) => {
  const getStyles = () => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'unverified':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", getStyles())}>
      {status}
    </span>
  );
};