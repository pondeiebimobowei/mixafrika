import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactionsStore } from '@/store';
import { Link } from 'react-router';

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

export function TraderTransactions() {
  const transactions = useTransactionsStore(state => state.transactions);

  // In a real app, you'd filter these for the trader specifically
  const traderTransactions = transactions.slice(0, 5);
  
  const formatAmount = (amount: number, type: 'credit' | 'debit' | 'failed') => {
    const prefix = type === 'credit' ? '+₦' : '-₦';
    return `${prefix}${amount.toLocaleString()}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <Button variant="link" className="text-primary" asChild>
          <Link to="/transactions">See all</Link>
        </Button>
      </div>
      <div className="space-y-3 mt-4">
        {traderTransactions.map((transaction) => {
          const Icon = transactionIcons[transaction.type as keyof typeof transactionIcons] || Send;
          const titleParts = transaction.title.split(' - ');
          const isWithdrawal = transaction.category === 'withdrawal';
          const isRepayment = transaction.title.toLowerCase().includes('repayment');

          return (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-card rounded-xl">
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-full", 
                  isWithdrawal ? 'bg-destructive/10' :
                  isRepayment ? 'bg-blue-100 dark:bg-blue-900/30' :
                  transactionIconBg[transaction.type as keyof typeof transactionIconBg]
                )}>
                  <Icon className={cn("h-5 w-5", 
                    isWithdrawal ? 'text-destructive' :
                    isRepayment ? 'text-blue-600 dark:text-blue-400' :
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
                isRepayment ? 'text-blue-600 dark:text-blue-400' :
                transactionColors[transaction.type as keyof typeof transactionColors]
              )}>
                {formatAmount(transaction.amount, transaction.type)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
