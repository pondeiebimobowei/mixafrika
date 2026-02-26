
import AdminLayout from '@/components/layouts/admin-layout';
import MetricCard from '@/components/admin/dashboard/metric-card';
import {
    Briefcase,
    Users,
    Wallet,
    MapPin,
    Activity,
    Plus,
    Info,
    File,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SystemRiskCard from '@/components/admin/dashboard/system-risk-card';
import ComplianceQueue from '@/components/admin/dashboard/compliance-queue';
import CapitalUtilizationChart from '@/components/admin/dashboard/capital-utilization-chart';
import PriorityItems from '@/components/admin/dashboard/priority-items';
import AssetAllocationChart from '@/components/admin/dashboard/asset-allocation-chart';
import SystemAlerts from '@/components/admin/dashboard/system-alerts';
import OperaitonalPulse from '@/components/admin/dashboard/operational-pulse';
import { useNavigate } from 'react-router';


const AdminDashboardPage = () => {
    const navigate = useNavigate()
    const actions = [
        {
            title: 'Add Users',
            icon: <Plus size={20} />

        },
        {
            title: 'Flag Tx',
            icon: <Info size={20} />
        },
        {
            title: 'Reports',
            icon: <File size={20} />
        },
        {
            title: 'Map',   
            icon: <MapPin size={20} />
        }
    ]
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <div className='md:col-span-1 space-y-4'>
                        <div>
                            <Card className={cn(
                                "border-none shadow-sm rounded-3xl",
                                "bg-[#1B4D3E] text-white"
                            )}>
                                <CardContent className="px-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn(
                                            " rounded-lg",
                                            "bg-white/10"
                                        )}>
                                            {<Briefcase size={24} className={cn("text-white")} />}
                                        </div>
                                        <div className={cn(
                                            " rounded-lg",
                                            "bg-white/10"
                                        )}>
                                            {<Activity size={24} className={cn("text-white")} />}
                                        </div>
                                        {/* Menu dots (optional) */}
                                    </div>

                                    <div className="space-y-1 my-6">
                                        <h3 className={cn("text-sm font-medium", "text-green-200")}>
                                            Total Ecosystem Value
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-3xl font-bold">₦856,200,000</h2>
                                        </div>
                                        <div className='flex gap-3 items-center'>
                                            <div className={cn("text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1",
                                                'bg-white/20 text-green-300'
                                            )}>
                                                {"+"}{"12.5%"}
                                            </div>
                                            <p className={cn("text-xs", "text-green-200/80")}>
                                                vs last month
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className={cn("text-sm font-medium text-green-200/60")}>Investors</p>
                                            <span className={cn("text-base text-white")}>12,450 users</span>
                                        </div>
                                        <div>
                                            <p className={cn("text-sm font-medium text-green-200/60 text-right")}>Traders</p>
                                            <span className={cn("text-base text-white text-right")}>8,200 active</span>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className='text-black rounded-2xl my-4 shadow flex items-center gap-2 justify-between py-4 px-6 bg-white text-center'>
                            {
                                actions.map((action) => (
                                    <button onClick={() => navigate('/transactions')} className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 group-hover:bg-primary/5 transition-colors text-gray-600">
                                            {action.icon}
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-500">{action.title}</span>
                                    </button>
                                ))
                            }
                        </div>

                        <SystemRiskCard />
                        <ComplianceQueue />
                    </div>

                    <div className='md:col-span-2 space-y-4'>
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-6">
                            {/* Main Ecosystem Value Card (Dark) */}

                            <MetricCard
                                title="Active Traders"
                                value="2,845"
                                subtitle="Active Traders"
                                change={{ value: "8.2%", trend: "up" }}
                                icon={Users}
                            />
                            <MetricCard
                                title="Credit Deployed"
                                value="₦145.2M"
                                subtitle="Credit Deployed"
                                change={{ value: "5.4%", trend: "up" }}
                                icon={Wallet}
                            />
                            <MetricCard
                                title="Field Agents Online"
                                value="142/180"
                                subtitle="Field Agents Online"
                                change={{ value: "2.5%", trend: "down" }}
                                icon={MapPin}
                            />
                        </div>

                        <CapitalUtilizationChart />
                        <PriorityItems />

                    </div>

                    <div className='md:col-span-1 space-y-4'>
                        <AssetAllocationChart />
                        <SystemAlerts />
                        <OperaitonalPulse />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
