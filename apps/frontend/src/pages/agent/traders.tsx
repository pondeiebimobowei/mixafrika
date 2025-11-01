import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, MoreVertical, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { traders } from '@/data/agent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { IUser, IuserWithBusiness } from '../../../../../packages/shared/src/types/user';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';


export default function ManagedTradersPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [traderToFlag, setTraderToFlag] = useState<Partial<IuserWithBusiness> | null>(null);

    const filteredTraders = traders.filter(trader => {
        const matchesSearch = trader.first_name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesFilter;
        if (filter === 'all') {
            matchesFilter = trader.trader?.status !== 'pending';
        } else {
            matchesFilter = trader.trader?.status.toLowerCase() === filter;
        }

        return matchesSearch && matchesFilter;
    });
    
    const getStatusBadgeClass = (trader: IUser['trader']) => {
        switch (trader?.status) {
            case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'defaulted': return 'bg-red-500/10 text-red-600 border-red-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            default: return '';
        }
    }

    const handleSendReminder = (traderName: string) => {
        toast.success(`A repayment reminder has been sent to ${traderName}.`)
    };

    const handleFlagTrader = () => {
        if (!traderToFlag) return;
        toast.success(`${traderToFlag.first_name} has been flagged for review.`);
        setTraderToFlag(null);
    }

    return (
        <>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/agent-dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline mx-auto pr-8">Managed Traders</h1>
            </header>
            
            <div className="p-4 space-y-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search traders..."
                      className="pl-10 bg-card border-0 rounded-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant={filter === 'all' ? 'default' : 'secondary'} onClick={() => setFilter('all')} className="rounded-full h-8 text-xs">All</Button>
                    <Button variant={filter === 'active' ? 'default' : 'secondary'} onClick={() => setFilter('active')} className="rounded-full h-8 text-xs">Active</Button>
                    <Button variant={filter === 'defaulted' ? 'default' : 'secondary'} onClick={() => setFilter('defaulted')} className="rounded-full h-8 text-xs">Defaulted</Button>
                    <Button variant={filter === 'pending' ? 'default' : 'secondary'} onClick={() => setFilter('pending')} className="rounded-full h-8 text-xs">
                        <Bell className="mr-1 h-3 w-3" />
                        Assigned
                    </Button>
                </div>
            </div>

            <main className="flex-1 p-4 space-y-4">
                {filteredTraders.map(trader => (
                    <Card key={trader.id} className="bg-card">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <Link to={`/agent/traders/${trader.id}`} className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={trader.image || ''} />
                                        <AvatarFallback>{trader.first_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{trader.first_name}</p>
                                        <p className="text-sm text-muted-foreground">{trader.business?.type}</p>
                                    </div>
                                </Link>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => navigate(`/agent/traders/${trader.id}`)}>
                                            View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSendReminder(trader.first_name || '')}>
                                            Send Reminder
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => setTraderToFlag(trader)}>
                                            Flag Trader
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Loan</span>
                                        <span className="font-semibold">₦{trader.trader?.stats.loan_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-muted-foreground">Repaid</span>
                                        <span className="font-semibold text-primary">₦{trader.trader?.stats.repayment_progress.toLocaleString()}</span>
                                    </div>
                                </div>
                                {/* @ts-expect-error */}
                                <Progress value={(trader?.trader.stats.repayment_progress / trader.trader.stats.total_repayment) * 100} className="h-2" />
                                <div className="flex justify-between items-center text-xs">
                                {/* @ts-expect-error */}
                                     <Badge variant="outline" className={cn(getStatusBadgeClass(trader?.trader?.status))}>{trader.trader?.status}</Badge>
                                    <div className="text-muted-foreground">
                                        Credit Score: <span className="font-semibold text-foreground">{trader.credit_score}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredTraders.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No traders match your criteria.</p>
                    </div>
                )}
            </main>
        </div>

        <AlertDialog open={!!traderToFlag} onOpenChange={(open) => !open && setTraderToFlag(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Flag {traderToFlag?.first_name}?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will mark the trader for review and notify administration. Are you sure you want to proceed?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFlagTrader} className={buttonVariants({ variant: "destructive" })}>
                    Flag Trader
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
