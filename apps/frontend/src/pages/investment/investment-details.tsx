import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Info, Users, Banknote, Landmark, Target } from 'lucide-react';
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import type { Investment } from '@/types';
import { investmentData } from '@/data';
import { Link, useParams } from 'react-router';
import { InvestmentWithdrawalSheet } from '@/components/modals/investment-withdrawal-sheet';

const ActiveInvestmentView = ({ investment }: { investment: Investment }) => {
    const daysElapsed = Math.round(((investment.cycleTotalDays || 0) * (investment.cycleProgress || 0)) / 100);
    const daysLeft = (investment.cycleTotalDays || 0) - daysElapsed;
    const totalEarnings = (investment.currentValue || 0) - investment.amountInvested;
    const totalReturnPercent = (totalEarnings / investment.amountInvested) * 100;

    return (
        <>
            <Card className="bg-card border-0 shadow-sm">
                <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Value</p>
                            <p className="font-bold text-2xl text-primary">₦{(investment.currentValue || 0).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Earnings</p>
                            <p className="font-semibold text-green-500">+₦{totalEarnings.toLocaleString()} ({totalReturnPercent.toFixed(1)}%)</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Progress value={investment.cycleProgress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{daysElapsed} of {investment.cycleTotalDays} days elapsed</span>
                            <span>{daysLeft} days left</span>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t flex justify-between">
                         <p>Initial Investment: ₦{investment.amountInvested.toLocaleString()}</p>
                         <p>Cycle Start: {new Date(investment.cycleStartDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                </CardContent>
            </Card>

            <EarningsAndActivity investment={investment} />

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild>
                    <Link to={`/clusters/${investment.clusterId}`}>
                        <Info className="mr-2 h-4 w-4"/>
                        Cluster Details
                    </Link>
                </Button>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="destructive">
                            <Landmark className="mr-2 h-4 w-4"/>
                            Withdraw
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-3xl p-0">
                        <SheetTitle className="sr-only">Withdraw from Investment</SheetTitle>
                        <InvestmentWithdrawalSheet 
                            investmentName={investment.name} 
                            availableBalance={totalEarnings}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

const PastInvestmentView = ({ investment }: { investment: Investment }) => {
    return (
        <>
            <Card className="bg-card border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Cycle Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Amount Invested</p>
                            <p className="font-bold text-lg">₦{investment.amountInvested.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Return</p>
                            <p className="font-bold text-lg text-primary">+₦{(investment.return || 0).toLocaleString()} ({(investment.returnPercentage || 0)}%)</p>
                        </div>
                    </div>
                     <div className="text-xs text-muted-foreground pt-3 mt-3 border-t flex justify-between">
                         <span>Start: {new Date(investment.cycleStartDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         <span>End: {new Date(investment.cycleEndDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </CardContent>
            </Card>

            <EarningsAndActivity investment={investment} />
            
            {investment.clusterSnapshot &&
            <Card className="bg-card border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Cluster Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <Banknote className="mx-auto h-6 w-6 text-primary mb-1"/>
                        <p className="text-sm font-bold">₦{(investment.clusterSnapshot.totalPool / 1_000_000).toFixed(1)}M</p>
                        <p className="text-xs text-muted-foreground">Total Pool</p>
                    </div>
                    <div>
                        <Users className="mx-auto h-6 w-6 text-primary mb-1"/>
                        <p className="text-sm font-bold">{investment.clusterSnapshot.participants}</p>
                        <p className="text-xs text-muted-foreground">Participants</p>
                    </div>
                     <div>
                        <Target className="mx-auto h-6 w-6 text-primary mb-1"/>
                        <p className="text-sm font-bold">{investment.clusterSnapshot.tradersFunded}</p>
                        <p className="text-xs text-muted-foreground">Traders Funded</p>
                    </div>
                </CardContent>
            </Card>
            }

             <Button variant="outline" asChild>
                <Link to={`/clusters/${investment.clusterId}`}>
                    <Info className="mr-2 h-4 w-4"/>
                    View Original Cluster
                </Link>
            </Button>
        </>
    );
};

const EarningsAndActivity = ({ investment }: { investment: Investment }) => (
    <>
        <Card className="bg-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Cumulative Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px] w-full">
               <ChartContainer config={{
                   earnings: {
                       label: 'Earnings',
                       color: 'hsl(var(--primary))'
                   }
               }} className="h-full w-full">
                    <RechartsAreaChart data={investment.roiData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-earnings)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-earnings)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip
                            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            labelStyle={{color: 'hsl(var(--muted-foreground))'}}
                            formatter={(value) => [`₦${(value as number).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`, 'Earnings']}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                        <Area type="monotone" dataKey="earnings" stroke="var(--color-earnings)" fillOpacity={1} fill="url(#colorEarnings)" />
                    </RechartsAreaChart>
                </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">Recent ROI Credits</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {investment.recentCredits && investment.recentCredits.map((credit, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                             <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{credit.type}</p>
                                <p className="text-xs text-muted-foreground">{credit.date}</p>
                            </div>
                           </div>
                           <p className="text-sm font-semibold text-green-500">+₦{credit.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </>
);

export default function InvestmentDetailPage() {
  const { id } = useParams<{id: string}>();
  const investment = investmentData[id as string ];

  if (!investment) {
    return <div className="text-center py-10">Investment not found</div>;
  }

  const isPastInvestment = investment.status === 'completed';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-xl font-bold font-headline mx-auto pr-8">{investment.name}</h1>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {isPastInvestment ? (
            <PastInvestmentView investment={investment} />
        ) : (
            <ActiveInvestmentView investment={investment} />
        )}
      </main>
    </div>
  );
}
