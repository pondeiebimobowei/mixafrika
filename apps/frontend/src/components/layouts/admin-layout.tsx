import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Menu,
    Bell,
    Search,
    LogOut,
    Briefcase,
    TrendingUp,
    CreditCard,
    MapPin,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'react-router';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useFetchUser } from '@/hooks/userHook';
// import { useAuthStore } from '@/store/authStore';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const SidebarItem = ({ icon: Icon, label, href, active }: { icon: any, label: string, href: string, active: boolean }) => (
    <Link
        to={href}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
            active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        <Icon size={20} />
        <span>{label}</span>
    </Link>
);

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    // const { user } = useFetchUser();
    // const { logout } = useAuthStore();
    const user:any = []

    const logout = () => {
        
    }
    
    const sidebarMainMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: Users, label: 'Users', href: '/admin/users' },
        { icon: Briefcase, label: 'Collections', href: '/admin/collections' },
        { icon: Briefcase, label: 'Clusters', href: '/admin/clusters' },
        { icon: CreditCard, label: 'Transactions', href: '/admin/transactions' },
        { icon: MapPin, label: 'Tracking', href: '/admin/tracking' },
        { icon: FileText, label: 'Requests', href: '/admin/requests' },
    ];

    const sidebarGrowthMenuItems = [
        { icon: Users, label: 'Referrals', href: '/admin/referrals' },
        { icon: TrendingUp, label: 'Broadcasts', href: '/admin/broadcasts' },
        { icon: TrendingUp, label: 'Insights', href: '/admin/insights' },
    ];

    const sidebarSupportMenuItems = [
        { icon: FileText, label: 'Tickets', href: '/admin/tickets' },
        { icon: FileText, label: 'Kyc Request', href: '/admin/kyc-requests' },
    ];

    return (
        <div className="max-h-screen bg-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-52 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-xl font-bold">Mix Africa</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    <div className="mb-0">
                        <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">MENU</p>
                        {sidebarMainMenuItems.map((item) => (
                            <SidebarItem
                                key={item.href}
                                {...item}
                                active={location.pathname === item.href}
                            />
                        ))}
                    </div>

                    <div className="mb-0">
                        <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">GROWTH</p>
                        {sidebarGrowthMenuItems.map((item) => (
                            <SidebarItem
                                key={item.href}
                                {...item}
                                active={location.pathname === item.href}
                            />
                        ))}
                    </div>

                    <div className="mb-4">
                        <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">SUPPORT</p>
                        {sidebarSupportMenuItems.map((item) => (
                            <SidebarItem
                                key={item.href}
                                {...item}
                                active={location.pathname === item.href}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </Button>
                            <h1 className="text-xl font-bold text-gray-800 hidden md:block">Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative hidden md:block w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    placeholder="Search users, txns, etc..."
                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-full"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                                </Button>

                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold text-gray-900">{user?.first_name} {user?.last_name || 'Admin User'}</p>
                                        <p className="text-xs text-gray-500">{user?.role || 'Superadmin'}</p>
                                    </div>
                                    {/* <Avatar>
                                        <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
