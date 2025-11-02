import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUp, ArrowDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore, useTransactionsStore } from '@/store';
import type { Transaction, TransactionTypeFilter } from '@/types';
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
}

const transactionIconColor = {
    credit: 'text-green-600 dark:text-green-400',
    debit: 'text-gray-600 dark:text-gray-400',
    failed: 'text-red-600 dark:text-red-400',
}

const INITIAL_VISIBLE_COUNT = 10;

export default function TransactionsPage() {
  const user = useAuthStore(state => state.user);

  const allTransactions = useTransactionsStore(state => state.transactions);
  const [filter, setFilter] = useState<TransactionTypeFilter>('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const filteredTransactions = allTransactions.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'credit') return t.category === 'deposit';
    if (filter === 'debit') return t.category === 'withdrawal' || t.category === 'investment' && t.type === 'debit';
    if (filter === 'earnings') return t.category === 'earnings';
    return t.type === filter;
  });

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);

  const groupedTransactions = visibleTransactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 10);
  };
  
  const backHref = user?.role === 'trader' ? '/trader/profile' : '/profile';

  const formatAmount = (amount: number, type: 'credit' | 'debit' | 'failed') => {
    const prefix = type === 'credit' ? '+₦' : '-₦';
    return `${prefix}${amount.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" asChild>
          <Link to={backHref}>
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-xl font-bold font-headline mx-auto pr-8">My Transactions</h1>
      </header>

      <div className="px-4 pb-4 border-b">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
              <Button
                  variant={filter === 'all' ? 'default' : 'secondary'}
                  className="rounded-full"
                  onClick={() => setFilter('all')}
              >
                  All
              </Button>
              <Button
                  variant={filter === 'credit' ? 'default' : 'secondary'}
                  className="rounded-full"
                  onClick={() => setFilter('credit')}
              >
                  Deposits
              </Button>
              <Button
                  variant={filter === 'debit' ? 'default' : 'secondary'}
                  className="rounded-full"
                  onClick={() => setFilter('debit')}
              >
                  Withdrawals
              </Button>
              <Button
                  variant={filter === 'earnings' ? 'default' : 'secondary'}
                  className="rounded-full"
                  onClick={() => setFilter('earnings')}
              >
                  Earnings
              </Button>
          </div>
        </ScrollArea>
      </div>

      <main className="flex-1 p-4 space-y-4">
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">{date}</h2>
            <div className="space-y-3">
              {transactions.map((transaction) => {
                  const Icon = transactionIcons[transaction.type];
                  const titleParts = transaction.title.split(' - ');
                  return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-card rounded-xl">
                          <div className="flex items-center gap-3">
                              <div className={cn("flex items-center justify-center h-10 w-10 rounded-full", transactionIconBg[transaction.type])}>
                                  <Icon className={cn("h-5 w-5", transactionIconColor[transaction.type])} />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{titleParts[0]}</p>
                                {titleParts.length > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    {titleParts[1].replace(/\s*\(Failed\)\s*/, '')}
                                  </p>
                                )}
                              </div>
                          </div>
                          <p className={cn("font-bold text-sm whitespace-nowrap", transactionColors[transaction.type])}>
                              {formatAmount(transaction.amount, transaction.type)}
                          </p>
                      </div>
                  );
              })}
            </div>
          </div>
        ))}
         {filteredTransactions.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No transactions found for this filter.
          </div>
        )}
         {visibleCount < filteredTransactions.length && (
          <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleShowMore}
            >
              Show more
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
