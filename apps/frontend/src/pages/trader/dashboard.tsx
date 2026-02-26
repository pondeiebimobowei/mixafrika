
import { Calendar, ChevronRight,Megaphone, User, TrendingUp, AreaChart as AreaChartIcon, Eye, EyeOff, Bell, Expand, ChevronUp, BarChart, History as HistoryIcon, FilePenLine, FileText, Repeat, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, Tooltip, Bar, BarChart as RechartsBarChart, YAxis } from "recharts";
import { useState } from "react";
import { NotificationsSheet } from "@/components/modals/notification-sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { newsItems, creditScoreChartData } from "@/data/trader";
import type { ChartType, Timeframe } from '@/types';
import { Link } from "react-router";
import { MakeRepaymentSheet } from "@/components/sheets/make-repayment-sheet";
import { useAuthStore, useLoanHistory, useTraderRecord, useUserBusiness, useWallet } from "@/store";
import { useFetchWallet } from "@/store/hooks/wallet.hook";

const WelcomeCard = () => (
    <Card className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-lg border-0">
        <CardHeader>
             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 mb-2">
                <FilePenLine className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl font-bold font-headline text-center">Welcome to ClustrTrade!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-primary-foreground/90">You don&apos;t have any active funding yet. Apply for your first loan to get started and grow your business.</p>
            <Button size="lg" className="w-full mt-6 bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/trader/apply">Apply for Funding</Link>
            </Button>
        </CardContent>
    </Card>
);

const ActiveLoanDashboard = () => {
    const { trader_record } = useTraderRecord( )
    const { history } = useLoanHistory( )
    const { available_balance } = useWallet( )
    const { user } = useAuthStore( )
    const [isAmountVisible, setIsAmountVisible] = useState(true);
    const [isLoanOverviewExpanded, setIsLoanOverviewExpanded] = useState(false);
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [timeframe, setTimeframe] = useState<Timeframe>('1Y');

    const repaymentPercentage = trader_record ? (trader_record.stats.repayment_progress / trader_record.stats.total_repayment) * 100 : 0;
    const hasActiveLoan = trader_record && trader_record.stats.loan_amount > 0;

    const quickActions = [
        { label: 'Apply', icon: FileText, href: '/trader/apply' },
        { label: 'Repayments', icon: Repeat, href: '/trader/repayments' },
        { label: 'Esusu', icon: PiggyBank, href: '/trader/esusu' },
        { label: 'Profile', icon: User, href: '/trader/profile' },
    ];

    useFetchWallet()
    
    return (
        <div className="space-y-6">
            {hasActiveLoan ? (
                 <Collapsible open={isLoanOverviewExpanded} onOpenChange={setIsLoanOverviewExpanded}>
                    <Card className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-lg border-0">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-primary-foreground/90">Loan Overview</CardTitle>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-primary-foreground/90 hover:bg-white/20">
                                    {isLoanOverviewExpanded ? <ChevronUp className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                                </Button>
                            </CollapsibleTrigger>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                    <div className="flex items-center gap-2">
                                    <p className="text-sm text-primary-foreground/80">Amount Received</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-primary-foreground/80"
                                        onClick={(e) => { e.stopPropagation(); setIsAmountVisible(!isAmountVisible); }}
                                    >
                                        {isAmountVisible ? (
                                        <Eye className="h-4 w-4" />
                                        ) : (
                                        <EyeOff className="h-4 w-4" />
                                        )}
                                    </Button>
                                    </div>
                                <p className="text-5xl font-bold">
                                    {isAmountVisible ? `₦${trader_record.stats.loan_amount?.toLocaleString() || 0}` : '∗∗∗∗∗∗∗'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Progress value={repaymentPercentage} className="h-2 bg-white/30 [&>div]:bg-white" />
                                <div className="text-xs text-primary-foreground/90 flex justify-between">
                                    <span>{repaymentPercentage.toFixed(0)}% Repaid</span>
                                    <span className="font-medium">₦{(trader_record.stats.total_repayment - trader_record.stats.repayment_progress).toLocaleString()} left</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-primary-foreground/90 border-t border-white/20 pt-3">
                                <div className="flex items-center gap-2 pr-4">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date Received: Jan 24, 2024</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4"/>
                                    <span>Repayment: ₦{trader_record.stats.repayment_progress?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CollapsibleContent>
                                <div className="px-6 pb-6 pt-2 space-y-4 text-sm">
                                <div className="border-t border-white/20 pt-4 grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-primary-foreground/80">Interest Rate</p>
                                        {/* <p className="font-semibold">{loan_account?.interest_rate}%</p> */}
                                    </div>
                                    <div>
                                        <p className="text-primary-foreground/80">Total Repayment</p>
                                        <p className="font-semibold">₦{trader_record.stats.total_repayment.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-primary-foreground/80">Next Payment</p>
                                        {/* <p className="font-semibold">₦{loan_account?.repayment_amount.toLocaleString()}</p> */}
                                    </div>
                                    <div>
                                        <p className="text-primary-foreground/80">Due Date</p>
                                        {/* <p className="font-semibold">{loan_account?.repayment_amount}</p> */}
                                    </div>
                                        <div>
                                        <p className="text-primary-foreground/80">Loan Duration</p>
                                        {/* <p className="font-semibold">{loan_account?.duration}</p> */}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-primary-foreground/80 mb-2">Funded by -1 Investors</p>
                                    <div className="flex items-center -space-x-2">
                                        {[{ avatar: '', name: ''}].slice(0, 4).map((investor, index) => (
                                            <Avatar key={index} className="h-8 w-8 border-2 border-primary">
                                                <AvatarImage src={investor.avatar} />
                                                <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {Array(5).fill('').length > 4 && (
                                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                                +{7 - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
            ) : (
                <WelcomeCard />
            )}

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Wallet Balance</p>
                        <p className="text-xl font-bold">₦{available_balance?.toLocaleString() || 0}</p>
                    </CardContent>
                </Card>
                    <Sheet>
                    <SheetTrigger asChild>
                        <Button className="h-full flex-col gap-1" variant="outline" disabled={!hasActiveLoan}>
                            <span className="text-sm font-semibold">Make Repayment</span>
                            <span className="text-xs text-muted-foreground">Next payment due</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-3xl">
                        <MakeRepaymentSheet upcomingRepayment={{amount: 5500, dueDate: "Tomorrow"}} walletBalance={available_balance || 0} />
                    </SheetContent>
                </Sheet>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center">
                {quickActions.map(action => (
                    <Link to={action.href} key={action.label} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-muted">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                            <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium">{action.label}</span>
                    </Link>
                ))}
            </div>

                <Card>
                <CardHeader>
                    <CardTitle className="text-base">Credit Score</CardTitle>
                </CardHeader>
                <CardContent>
                        <div className="flex justify-between items-start">
                        <div>
                            <p className="text-4xl font-bold">{ user && user.credit_score }</p>
                            {user && user.credit_score > 0 && <p className="text-sm text-green-500 font-semibold">{user && user.credit_score_status}</p>}
                            <p className="text-xs text-muted-foreground mt-1">Based on your repayment history.</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant={chartType === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setChartType('bar')}>
                                <BarChart className="h-4 w-4" />
                            </Button>
                            <Button variant={chartType === 'area' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setChartType('area')}>
                                <AreaChartIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    
                    {user && user.credit_score > 0 ? (
                        <>
                        <div className="h-40 w-full mt-4">
                            <ChartContainer config={{
                                score: { label: 'Score', color: 'hsl(var(--primary))' }
                            }} className="h-full w-full">
                                {chartType === 'bar' ? (
                                    <RechartsBarChart 
                                        data={creditScoreChartData[timeframe]} 
                                        margin={{ top: 5, right: 0, left: 0, bottom: -10 }}
                                    >
                                        <XAxis dataKey="name" hide />
                                        <YAxis domain={[600, 850]} hide />
                                        <Tooltip
                                            cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                            labelStyle={{color: 'hsl(var(--muted-foreground))'}}
                                        />
                                        <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                                    </RechartsBarChart>
                                ) : (
                                    <AreaChart data={creditScoreChartData[timeframe]} margin={{ top: 5, right: 0, left: 0, bottom: -10 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" hide />
                                        <YAxis domain={[600, 850]} hide />
                                        <Tooltip
                                            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                            labelStyle={{color: 'hsl(var(--muted-foreground))'}}
                                        />
                                        <Area type="natural" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                                    </AreaChart>
                                )}
                            </ChartContainer>
                        </div>
                        <div className="flex justify-around mt-2">
                            {(['3M', '6M', '1Y', 'All'] as Timeframe[]).map((period) => (
                                <Button key={period} variant={timeframe === period ? 'secondary' : 'ghost'} size="sm" onClick={() => setTimeframe(period)} className="text-xs px-3 h-7 rounded-full">
                                    {period}
                                </Button>
                            ))}
                        </div>
                        </>
                    ) : (
                         <div className="text-center py-8 text-muted-foreground">
                            <p>Your credit score will appear here once you have a loan history.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">News & Updates</CardTitle>
                    <Button variant="link" className="text-primary pr-0 text-sm">View All</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {newsItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                            <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            {history.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold font-headline mb-4">Loan History</h2>
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            {history.map((loan) => (
                                <div key={loan.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                                            <HistoryIcon className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            {/* <p className="font-semibold text-sm">Loan - {loan.cluster}</p> */}
                                            <p className="text-xs text-muted-foreground">{loan.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">₦{loan.amount.toLocaleString()}</p>
                                        <p className="text-xs text-green-500 font-medium">{loan.status}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
};

export default function TraderDashboard() {
    const { business } = useUserBusiness();
    const { user } = useAuthStore()

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={user?.image || ''} alt="Trader" data-ai-hint="profile picture"/>
                        <AvatarFallback>{business?.name?.charAt(0) || 'T'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm">Hello,</p>
                        <p className="text-lg font-semibold -mt-1">{business?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Bell className="h-6 w-6 text-yellow-600" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full">
                            <SheetTitle className="sr-only">Notifications</SheetTitle>
                            <NotificationsSheet />
                        </SheetContent>
                    </Sheet>
                    <Link to="/trader/profile">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 p-4">
                <ActiveLoanDashboard />
            </main>
        </div>
    );
}
