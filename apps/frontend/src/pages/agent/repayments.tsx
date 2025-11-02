import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Search, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { initialAgentRepayments } from '@/data/agent';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router';
import type { RepaymentStatus, Status } from '../../../../../packages/shared/src/enums';
import type { ITransactionWithUser } from '../../../../../packages/shared/src/types/transaction';

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export default function AgentRepaymentsPage() {
    const navigate = useNavigate();
    const [repayments] = useState<ITransactionWithUser[]>(initialAgentRepayments);
    const [statusFilter, setStatusFilter] = useState<RepaymentStatus | 'all'>('all');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRepayments = repayments.filter(repayment => {
        const matchesStatusFilter = statusFilter === 'all' || repayment.status === statusFilter;
        const matchesSearch = repayment.user.first_name?.toLowerCase().includes(searchQuery.toLowerCase());

        const repaymentDate = new Date(repayment.createdAt || '');
        const today = new Date();
        
        let matchesTimeFilter = true;
        if (timeFilter !== 'all') {
            if(timeFilter === 'today') {
                matchesTimeFilter = repaymentDate.toDateString() === today.toDateString();
            } else if (timeFilter === 'week') {
                const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesTimeFilter = repaymentDate >= oneWeekAgo;
            } else if (timeFilter === 'month') {
                const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                matchesTimeFilter = repaymentDate >= oneMonthAgo;
            }
        }

        return matchesStatusFilter && matchesSearch && matchesTimeFilter;
    });

    const getStatusInfo = (status: Status | RepaymentStatus) => {
        switch (status) {
            case 'paid':
                return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' };
            case 'paid (late)':
                return { icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' };
            case 'missed':
                return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10' };
            default:
                return { icon: CheckCircle, color: 'text-muted-foreground', bgColor: 'bg-muted' };
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/agent/dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline mx-auto pr-8">Trader Repayments</h1>
            </header>

             <div className="p-4 space-y-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by trader name..."
                      className="pl-10 bg-card border-0 rounded-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <Button variant={statusFilter === 'all' ? 'default' : 'secondary'} onClick={() => setStatusFilter('all')} className="rounded-full h-8 text-xs shrink-0">All</Button>
                    <Button variant={statusFilter === 'paid' ? 'default' : 'secondary'} onClick={() => setStatusFilter('paid')} className="rounded-full h-8 text-xs shrink-0">Paid</Button>
                    <Button variant={statusFilter === 'paid (late)' ? 'default' : 'secondary'} onClick={() => setStatusFilter('paid (late)')} className="rounded-full h-8 text-xs shrink-0">Paid (Late)</Button>
                    <Button variant={statusFilter === 'missed' ? 'default' : 'secondary'} onClick={() => setStatusFilter('missed')} className="rounded-full h-8 text-xs shrink-0">Missed</Button>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">Filter by date</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={timeFilter === 'all' ? 'default' : 'secondary'} onClick={() => setTimeFilter('all')} className="rounded-full h-8 text-xs">All</Button>
                    <Button variant={timeFilter === 'today' ? 'default' : 'secondary'} onClick={() => setTimeFilter('today')} className="rounded-full h-8 text-xs">Today</Button>
                    <Button variant={timeFilter === 'week' ? 'default' : 'secondary'} onClick={() => setTimeFilter('week')} className="rounded-full h-8 text-xs">This Week</Button>
                    <Button variant={timeFilter === 'month' ? 'default' : 'secondary'} onClick={() => setTimeFilter('month')} className="rounded-full h-8 text-xs">This Month</Button>
                </div>
            </div>

            <main className="flex-1 px-4 space-y-3">
                {filteredRepayments.map((repayment) => {
                    const statusInfo = getStatusInfo(repayment.status);
                    return (
                        <Card key={repayment.id} className="bg-card cursor-pointer" onClick={() => navigate(`/agent/traders/${repayment.user_id}`)}>
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={repayment.user.image || ''} />
                                        <AvatarFallback>{repayment.user.first_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{repayment.user.first_name}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(repayment.createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">₦{repayment.amount.toLocaleString()}</p>
                                    <div className={cn("flex items-center justify-end gap-1.5 text-xs font-medium", statusInfo.color)}>
                                        <statusInfo.icon className="h-3 w-3" />
                                        <span>{repayment.status}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                {filteredRepayments.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No repayments match your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
