import { Bell, FileText, Repeat, TrendingUp, Users, User, Wallet, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from '@/store';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, Cell, XAxis, Tooltip } from 'recharts';
import { Link } from 'react-router';

const quickActions = [
    { label: 'Traders', icon: Users, href: '/agent/traders' },
    { label: 'Repayments', icon: Repeat, href: '/agent/repayments' },
    { label: 'Reports', icon: FileText, href: '/agent/reports' },
    { label: 'Wallet', icon: Wallet, href: '/agent/wallet' },
];

const repaymentChartData = [
  { name: 'Mon', value: 4000, fill: 'hsl(var(--primary))' },
  { name: 'Tue', value: 3000, fill: 'hsl(var(--primary))' },
  { name: 'Wed', value: 2000, fill: 'hsla(var(--primary), 0.5)' },
  { name: 'Thu', value: 2780, fill: 'hsla(var(--primary), 0.5)' },
  { name: 'Fri', value: 1890, fill: 'hsla(var(--primary), 0.5)' },
  { name: 'Sat', value: 2390, fill: 'hsl(var(--primary))' },
  { name: 'Sun', value: 3490, fill: 'hsl(var(--primary))' },
];

const alerts = [
    { id: 1, trader: 'Aunty Funke', message: 'Missed repayment of ₦5,500 due yesterday.', severity: 'high' },
    { id: 2, trader: 'Idris Bello', message: 'Application requires approval.', severity: 'medium' },
    { id: 3, trader: 'Mr. Ebuka', message: 'Repayment of ₦12,000 is due tomorrow.', severity: 'low' },
]


export default function AgentDashboard() {
    const { user } = useAuthStore(state => ({ user: state.user }));

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/601/200/200" alt="Agent" data-ai-hint="profile picture"/>
                        <AvatarFallback>{user?.first_name?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm">Hello,</p>
                        <p className="text-lg font-semibold -mt-1">{user?.first_name || 'Agent'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-6 w-6 text-yellow-600" />
                    </Button>
                    <Link to="/agent/profile">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 p-4 space-y-6">
                <Card className="bg-blue-600 text-white shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Total Under Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-4xl font-bold">₦1,250,000</p>
                        <div className="text-sm text-blue-200 flex justify-between">
                            <span>Across 15 traders</span>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>+5.2% this week</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Repayment Rate</p>
                            <p className="text-2xl font-bold text-green-500">98.5%</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Active Traders</p>
                            <p className="text-2xl font-bold">15</p>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                    {quickActions.map(action => (
                        <Link to={action.href} key={action.label} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-muted">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600/10 text-blue-600">
                                <action.icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium">{action.label}</span>
                        </Link>
                    ))}
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Weekly Repayment Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-40 w-full">
                           <ChartContainer config={{}} className="h-full w-full">
                                <RechartsBarChart 
                                    data={repaymentChartData} 
                                    margin={{ top: 5, right: 10, left: -20, bottom: -10 }}
                                >
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                                    <Tooltip
                                        cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                        labelStyle={{color: 'hsl(var(--muted-foreground))'}}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {repaymentChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </RechartsBarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Alerts & Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {alerts.map(alert => (
                            <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                                <div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{alert.trader}</p>
                                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                                </div>
                                <Button size="sm">Resolve</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
