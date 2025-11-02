import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Wallet, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cluster, Trader, Sentiment, Activity } from '@/types';
import { clusterData, walletBalance } from '@/data';
import { Link, useParams } from 'react-router';

const formatNumberWithCommas = (value: string) => {
    if (!value) return '';
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts[1]) {
        parts[1] = parts[1].substring(0, 2);
    }
    return parts.join('.');
};

export default function ClusterDetailPage() {
  const { id } = useParams<{id: string}>();
  
  const cluster = clusterData[id as string];
  const [open, setOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const similarClusters = useMemo(() => {
      if (!cluster) return [];
      return Object.values(clusterData).filter(c => c.id !== cluster.id && c.category === cluster.category);
  }, [cluster]);


  if (!cluster) {
    return <div className="text-center py-10">Cluster not found</div>;
  }
  
  const isPooling = cluster.status === 'pooling';
  const cycleProgressPercentage = !isPooling && cluster.cycleProgress ? (cluster.cycleProgress.daysElapsed / cluster.cycleProgress.daysTotal) * 100 : 0;
  const daysLeft = !isPooling && cluster.cycleProgress ? cluster.cycleProgress.daysTotal - cluster.cycleProgress.daysElapsed : 0;
  const poolProgressPercentage = isPooling && cluster.poolCurrent && cluster.poolTarget ? (cluster.poolCurrent / cluster.poolTarget) * 100 : 0;

  const numericAmount = parseFloat(investmentAmount.replace(/,/g, '')) || 0;

  const handleInvest = () => {
    // In a real app, this would trigger an API call
    console.log(`Investing ${numericAmount} in ${cluster.name}`);
    setShowConfirm(false);
    setTimeout(() => setShowSuccess(true), 500); // Simulate API call
  };

  const closeAllAndReset = () => {
    setShowSuccess(false);
    setOpen(false);
    setInvestmentAmount('');
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    setInvestmentAmount(formattedValue);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/market">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-xl font-bold font-headline mx-auto pr-8">{cluster.name}</h1>
      </header>

      <main className="flex-1 p-4 space-y-6">

        <Card className="bg-card border-0 shadow-sm">
            <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Est. ROI</p>
                    <p className="font-bold text-lg text-primary">{cluster.performance}%</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Cycle</p>
                    <p className="font-bold text-lg">{cluster.cycle}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Repayment</p>
                    <p className="font-bold text-lg">{cluster.repayment}</p>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">About this Cluster</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{cluster.description}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Traders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cluster.traders?.map((trader: Trader, index: number) => (
                <div key={index} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                    <AvatarImage src={trader.avatar} />
                    <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                    <p className="font-semibold">{trader.name}</p>
                    <p className="text-sm text-muted-foreground">{trader.experience} experience</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{trader.rating}</span>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{isPooling ? 'Funding Progress' : 'Cycle Timeline'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="space-y-2">
                <Progress value={isPooling ? poolProgressPercentage : cycleProgressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    {isPooling ? (
                        <>
                            <span>₦{(cluster.poolCurrent || 0).toLocaleString()}</span>
                            <span>Target: ₦{(cluster.poolTarget || 0).toLocaleString()}</span>
                        </>
                    ) : (
                        <>
                            <span>{cluster.cycleProgress?.daysElapsed || 0} of {cluster.cycleProgress?.daysTotal || 0} days</span>
                            <span>{daysLeft} days left</span>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center text-sm border-t pt-3 mt-3">
                <span className="text-muted-foreground">Total Invested Volume</span>
                <span className="font-bold text-base">₦{isPooling ? (cluster.poolCurrent || 0).toLocaleString() : cluster.totalVolume?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    { cluster.activities?.map((activity: Activity, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className={cn("flex items-center justify-center h-8 w-8 rounded-full", activity.bgColor)}>
                                <activity.icon className={cn("h-4 w-4", activity.color)} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{activity.message}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">User Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            { cluster.sentiments?.map((sentiment: Sentiment, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={sentiment.avatar} />
                  <AvatarFallback>{sentiment.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{sentiment.user}</p>
                    <div className="flex items-center gap-0.5 text-primary">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < sentiment.rating ? 'fill-current' : ''}`} />)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{sentiment.comment}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
         <Card className="bg-card border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">Similar Clusters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                { similarClusters.map((similarCluster: Cluster) => (
                    <Link to={`/clusters/${similarCluster.id}`} key={similarCluster.id} className="block">
                        <div className="p-3 rounded-lg hover:bg-muted/50 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{similarCluster.name}</p>
                                <p className="text-sm text-muted-foreground">{similarCluster.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary">{similarCluster.performance}%</p>
                                <p className="text-xs text-muted-foreground">Est. ROI</p>
                            </div>
                        </div>
                    </Link>
                ))}
                { similarClusters.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No similar clusters found.</p>
                )}
            </CardContent>
        </Card>

      </main>
      {isPooling && (
        <div className="sticky bottom-0 p-4 bg-background border-t">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">Invest in {cluster.name}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invest in {cluster.name}</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to invest. The funds will be deducted from your wallet.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input 
                            id="amount" 
                            type="text"
                            inputMode="decimal"
                            placeholder="e.g., 50000" 
                            value={investmentAmount} 
                            onChange={handleAmountChange}
                        />
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wallet className="h-4 w-4"/>
                        <span>Wallet Balance: <span className="font-semibold text-primary">₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
                    </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={() => setShowConfirm(true)} 
                    disabled={numericAmount <= 0 || numericAmount > walletBalance}
                  >
                    Proceed
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

             <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Investment</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to invest ₦{numericAmount.toLocaleString()} in {cluster.name}. Do you want to proceed?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleInvest}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
                <AlertDialogContent>
                    <AlertDialogHeader className="items-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                            <PartyPopper className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <AlertDialogTitle>Investment Successful!</AlertDialogTitle>
                        <AlertDialogDescription>
                           Your investment of ₦{numericAmount.toLocaleString()} in {cluster.name} has been confirmed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <AlertDialogAction onClick={closeAllAndReset} className="w-full">Done</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      )}
    </div>
  );
}

    