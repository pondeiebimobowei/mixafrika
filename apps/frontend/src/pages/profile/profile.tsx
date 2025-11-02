import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell,
  ArrowDown,
  Send,
  Settings,
  Landmark,
  Wallet,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUp,
  X,
  Users,
  PiggyBank,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Notification, Goal } from '@/types';
import { useTransactionsStore, useNotificationsStore, useGoalsStore } from '@/store';
import { allClustersForReinvest, activeInvestments, pastInvestments } from '@/data/profile';
import { Link } from 'react-router';
import { NotificationsSheet } from '@/components/modals/notification-sheet';
import { SettingsSheet } from '@/components/modals/settings-sheet';
import { InvestmentsSheet } from '@/components/modals/investment-sheet';
import { WithdrawSheet } from '@/components/modals/withdraw-sheet';
import { ReinvestSheet } from '@/components/modals/reinvest-sheet';
import { SendSheet } from '@/components/modals/send-sheet';
import { FundSheet } from '@/components/modals/fund-sheet';
import { GoalsSheet } from '@/components/modals/goals-sheet';


const transactionIcons = {
  credit: ArrowDown,
  debit: ArrowUp,
  failed: X,
};

const transactionColors = {
  credit: 'text-primary',
  debit: 'text-foreground',
  failed: 'text-destructive',
};

const transactionIconBg = {
  credit: 'bg-green-100 dark:bg-green-900/30',
  debit: 'bg-gray-100 dark:bg-gray-800/70',
  failed: 'bg-red-100 dark:bg-red-900/30',
};

const transactionIconColor = {
  credit: 'text-green-600 dark:text-green-400',
  debit: 'text-gray-600 dark:text-gray-400',
  failed: 'text-red-600 dark:text-red-400',
};


export default function ProfilePage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [balance, setBalance] = useState(521078);
  
  const { transactions, addTransaction } = useTransactionsStore();
  const { addNotification } = useNotificationsStore();
  const { goals, addContribution } = useGoalsStore();

  const handleSendMoney = (amount: number, recipientName: string) => {
    setBalance(prev => prev - amount);
    
    addTransaction({
      type: 'debit',
      title: `Sent to ${recipientName}`,
      amount: amount,
      category: 'withdrawal',
    });


    const newNotification: Notification = {
      id: Date.now(),
      type: 'new_match',
      title: 'Funds Sent',
      message: `You sent ₦${amount.toLocaleString()} to ${recipientName}.`,
      read: false,
      timestamp: 'Just now',
    };
    addNotification(newNotification);
  };

  const handleSendToGoal = (amount: number, goal: Goal) => {
    setBalance(prev => prev - amount);
    
    addTransaction({
      type: 'debit',
      title: `Contribution to ${goal.name}`,
      amount: amount,
      category: 'investment',
    });

    const newNotification: Notification = {
      id: Date.now(),
      type: 'goal_achieved',
      title: 'Goal Contribution',
      message: `You added ₦${amount.toLocaleString()} to your '${goal.name}' goal.`,
      read: false,
      timestamp: 'Just now',
    };
    addNotification(newNotification);
    addContribution(goal.id, amount);
  };

  const handleReinvest = (amount: number, clusterName: string) => {
    setBalance(prev => prev - amount);

    addTransaction({
      type: 'debit',
      title: `Reinvested in ${clusterName}`,
      amount: amount,
      category: 'investment',
    });


    const newNotification: Notification = {
      id: Date.now(),
      type: 'new_cluster',
      title: 'Reinvestment Successful',
      message: `You reinvested ₦${amount.toLocaleString()} in ${clusterName}.`,
      read: false,
      timestamp: 'Just now',
    };
    addNotification(newNotification);
  };

  const formatAmount = (amount: number, type: 'credit' | 'debit' | 'failed') => {
    const prefix = type === 'credit' ? '+₦' : '-₦';
    return `${prefix}${amount.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary-foreground">
      <header className="flex items-center justify-between p-4 pt-8">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src="https://picsum.photos/seed/104/200/200"
              alt="Kelvin"
              data-ai-hint="profile picture"
            />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm">Hello,</p>
            <p className="text-lg font-semibold -mt-1">Kelvin</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/10 rounded-xl">
                <Bell />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full">
                <SheetTitle className="sr-only">Notifications</SheetTitle>
                <NotificationsSheet />
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/10 rounded-xl">
                <Settings />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-0">
              <SheetTitle className="sr-only">Settings</SheetTitle>
              <SettingsSheet />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 mt-6">
        <div className="text-center px-4">
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-primary-foreground/80">
              Your Wallet Balance
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground/80"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              {isBalanceVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-4xl font-bold mt-1">
            {isBalanceVisible ? `₦${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '∗∗∗∗∗∗∗∗∗∗'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 px-4">
          <Sheet>
              <SheetTrigger asChild>
                <Button className="py-6 bg-accent text-accent-foreground font-bold hover:bg-accent/90">
                  Investments
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full">
                <SheetTitle className="sr-only">My Investments</SheetTitle>
                <InvestmentsSheet activeInvestments={activeInvestments} pastInvestments={pastInvestments} />
              </SheetContent>
          </Sheet>
          <Sheet>
              <SheetTrigger asChild>
                <Button className="py-6 bg-accent text-accent-foreground font-bold hover:bg-accent/90">
                  Goals
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full">
                <SheetTitle className="sr-only">Goals</SheetTitle>
                <GoalsSheet />
              </SheetContent>
          </Sheet>
        </div>

        <div className="mt-8 bg-background text-foreground flex-1 px-4 py-6 rounded-t-3xl">
          <div className="grid grid-cols-4 gap-4 text-center">
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-primary/10 text-primary"
                  >
                    <Wallet className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium">Fund</span>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0">
                <SheetTitle className="sr-only">Fund Wallet</SheetTitle>
                <FundSheet />
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-primary/10 text-primary"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium">Send</span>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0 h-full">
                 <SheetTitle className="sr-only">Send Money</SheetTitle>
                <SendSheet 
                  balance={balance} 
                  goals={goals} 
                  onSendMoney={handleSendMoney}
                  onSendToGoal={handleSendToGoal}
                />
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-primary/10 text-primary"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium">Reinvest</span>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0">
                 <SheetTitle className="sr-only">Reinvest Earnings</SheetTitle>
                <ReinvestSheet balance={balance} onReinvest={handleReinvest} clusters={allClustersForReinvest} />
              </SheetContent>
            </Sheet>
             <Sheet>
              <SheetTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-primary/10 text-primary"
                  >
                    <Landmark className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium">Withdraw</span>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0">
                 <SheetTitle className="sr-only">Withdraw Funds</SheetTitle>
                <WithdrawSheet />
              </SheetContent>
            </Sheet>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <Button variant="link" className="text-primary" asChild>
                <Link to="/transactions">See all</Link>
              </Button>
            </div>
            <div className="space-y-3 mt-4">
              {transactions.slice(0,5).map((transaction) => {
                const Icon = transactionIcons[transaction.type as keyof typeof transactionIcons] || Send;
                const titleParts = transaction.title.split(' - ');
                const isWithdrawal = transaction.category === 'withdrawal';
                const isSuccessfulInvestment = transaction.category === 'investment' && transaction.type === 'debit';
                const isEarning = transaction.category === 'earnings';

                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-card rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex items-center justify-center h-10 w-10 rounded-full", 
                        isWithdrawal ? 'bg-destructive/10' :
                        isSuccessfulInvestment ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        isEarning ? transactionIconBg['credit'] :
                        transactionIconBg[transaction.type as keyof typeof transactionIconBg]
                      )}>
                        <Icon className={cn("h-5 w-5", 
                          isWithdrawal ? 'text-destructive' :
                          isSuccessfulInvestment ? 'text-yellow-600 dark:text-yellow-400' :
                          isEarning ? transactionIconColor['credit'] :
                          transactionIconColor[transaction.type as keyof typeof transactionIconColor]
                        )} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{titleParts[0]}</p>
                        {titleParts.length > 1 && <p className="text-xs text-muted-foreground">{titleParts[1]}</p>}
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={cn("font-bold text-sm whitespace-nowrap", 
                      isWithdrawal ? 'text-destructive' : 
                      isSuccessfulInvestment ? 'text-yellow-600 dark:text-yellow-400' :
                      isEarning ? transactionColors['credit'] :
                      transactionColors[transaction.type as keyof typeof transactionColors]
                    )}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8">
              <Card className="bg-primary/5 border-primary/20 border-dashed">
                <CardContent className="p-6 text-center">
                    <div className="flex justify-center items-center gap-2 mb-2 text-primary">
                        <PiggyBank className="h-6 w-6" strokeWidth={1.5} />
                         <h3 className="text-lg font-semibold text-foreground">Affiliate Program</h3>
                    </div>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Invite your friends to MIX and earn rewards when they start investing.
                  </p>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Invite a Friend
                  </Button>
                </CardContent>
              </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
