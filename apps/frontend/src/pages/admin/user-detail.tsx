import { ArrowLeft, Ban, Calendar, CreditCard, Edit, Lock, LogOut, MapPin, RefreshCw } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router"
import InvestorDetailView from "@/components/admin/user/investor-detail-view";
import AdminLayout from "@/components/layouts/admin-layout";
import { useUsers } from "@/store";
import { StatusBadge } from "./user";

export default function UserDetailsPage(){
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams();
    const { user: users } = useUsers()

    const backPath = location.state?.from || '/admin/users';
    const backLabel = location.state?.from === '/team' ? 'Back to Team' : 'Back to Users';
    const user = users.find(u => u.id === id);

    return(
        <AdminLayout>
            <div className="flex flex-col md:flex-row gap-6 animate-fade-in relative min-h-screen">
      
                {/* MAIN CONTENT AREA */}
                <div className="flex-1 space-y-6 min-w-0">
                    {/* Top Nav */}
                    <button 
                        onClick={() => navigate(backPath)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>{backLabel}</span>
                    </button>

                    {/* Universal Header Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 flex flex-col md:flex-row gap-6">
                        {/* <Avatar src={user.avatarUrl} alt={user.name} size="xl" /> */}
                        <div className="flex-1 space-y-2">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900">{user?.first_name + ' ' + user?.last_name}</h1>
                                    <StatusBadge status={user?.verification?.status || 'verified'} />
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">{user?.role}</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                    {/* <MapPin size={14} /> {user?.business_verification. || 'No Address'} • {user.country} */}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Calendar size={14} /> Joined {new Date(user?.createdAt || new Date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <CreditCard size={14} /> ID: {user?.id?.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Router */}
                    {user?.role === 'investor' && InvestorDetailView(user)}
                    {/* {user.role === 'trader' && renderTraderView()}
                    {user.role === 'agent' && renderAgentView()}
                    {user.role === 'admin' && renderAdminView()} */}
                </div>

                {/* RIGHT SIDEBAR (ADMIN ACTIONS) */}
                <div className="w-full md:w-64 space-y-6">
                    {/* Admin Actions Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50 sticky top-24">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Admin Actions</h3>
                        
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group">
                                <span className="flex items-center gap-3"><Edit size={16} /> Edit Profile</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group">
                                <span className="flex items-center gap-3"><Lock size={16} /> Reset Password</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group">
                                <span className="flex items-center gap-3"><RefreshCw size={16} /> Update Verification</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group">
                                <span className="flex items-center gap-3"><LogOut size={16} /> Force Logout</span>
                            </button>
                        
                            <div className="h-px bg-gray-100 my-4"></div>

                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors text-sm font-bold text-red-600">
                                <span className="flex items-center gap-3"><Ban size={16} /> Suspend Account</span>
                            </button>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Audit Log</h3>
                            <div className="space-y-4 relative">
                                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                                {[
                                    { action: 'Admin Reset Password', date: 'Today, 10:23 AM', by: 'You' },
                                    { action: 'Profile Updated', date: 'Yesterday, 4:15 PM', by: 'System' },
                                    { action: 'Login from New Device', date: 'Mar 12, 09:30 AM', by: 'User' }
                                ].map((log, i) => (
                                    <div key={i} className="pl-6 relative">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                                        <p className="text-xs font-bold text-gray-800">{log.action}</p>
                                        <p className="text-[10px] text-gray-400">{log.date} • {log.by}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 text-xs text-primary font-bold hover:underline">View Full Log</button>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    )
}