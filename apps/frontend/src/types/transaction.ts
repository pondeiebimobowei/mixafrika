
export type Transaction = {
  id: string;
  type: 'credit' | 'debit' | 'failed';
  title: string;
  amount: number;
  date: any;
  category: 'earnings' | 'withdrawal' | 'investment' | 'deposit';
};

export type TransactionTypeFilter = 'all' | 'credit' | 'debit' | 'failed' | 'earnings';
