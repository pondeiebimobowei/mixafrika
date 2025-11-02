
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Landmark, Wallet, X } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { SuccessDialog } from './success-dialog';

interface WithdrawInvestmentSheetProps {
    investmentName: string;
    availableBalance: number;
}

const accounts = [
  {
    id: 'wallet',
    name: 'MIX Wallet',
    detail: 'Instant withdrawal',
    icon: Wallet,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'checking-7134',
    name: 'Checking - 7134',
    detail: '••••7134 | Revolut',
    icon: Landmark,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
];

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

const parseFormattedNumber = (value: string) => {
    return parseFloat(value.replace(/,/g, ''));
}


export function InvestmentWithdrawalSheet({ investmentName, availableBalance }: WithdrawInvestmentSheetProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('wallet');
  const [amount, setAmount] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawnAmount, setWithdrawnAmount] = useState('');

  const handleMaxClick = () => {
    setAmount(availableBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    setAmount(formattedValue);
  };
  
  const handleWithdrawClick = () => {
    setShowConfirmDialog(true);
  };
  
  const selectedAccount = accounts.find(c => c.id === selectedAccountId);

  const handleConfirmWithdraw = () => {
    if (!selectedAccount || !amount) return;

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, call a function to handle withdrawal
      // onWithdraw(parseFormattedNumber(amount), selectedAccount.id);
      
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setWithdrawnAmount(amount);
      setShowSuccess(true);
    }, 1500);
  };
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setAmount('');
    // You might want to close the main sheet as well, by calling a prop function
  };

  const numericAmount = parseFormattedNumber(amount || '0');

  return (
    <>
      <div className="bg-card text-foreground rounded-t-3xl h-full flex flex-col">
        <SheetHeader className="p-4 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-lg font-semibold">Withdraw from {investmentName}</SheetTitle>
              <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-5 w-5" />
                  </Button>
              </SheetClose>
            </div>
        </SheetHeader>
        <div className="px-6 py-6 space-y-6 flex-1">
          <div>
              <Label htmlFor="amount" className="text-sm font-semibold text-muted-foreground mb-2 block">Amount to Withdraw</Label>
              <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold">₦</span>
                  <Input
                      id="amount"
                      type="text"
                      inputMode='decimal'
                      placeholder="0.00"
                      value={amount}
                      onChange={handleAmountChange}
                      className="pl-8 pr-24 text-lg h-12 font-bold"
                  />
                  <Button variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 h-8" onClick={handleMaxClick}>Max</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Available from this investment: <span className="font-semibold text-primary">₦{availableBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Withdraw To</h3>
            <RadioGroup
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
              className="space-y-1"
            >
              {accounts.map((account) => (
                <Label
                  key={account.id}
                  htmlFor={account.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                    selectedAccountId === account.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-transparent border-border hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", account.bgColor)}>
                      <account.icon className={cn("h-5 w-5", account.color)} />
                    </div>
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.detail}
                      </p>
                    </div>
                  </div>
                  <RadioGroupItem value={account.id} id={account.id} className="h-5 w-5" />
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>
        <SheetFooter className="p-6 bg-card border-t">
          <Button size="lg" className="w-full" onClick={handleWithdrawClick} disabled={!numericAmount || numericAmount <= 0 || numericAmount > availableBalance}>
            Withdraw ₦{numericAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
          </Button>
        </SheetFooter>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to withdraw ₦{numericAmount.toLocaleString()} to your {selectedAccount?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmWithdraw} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <SuccessDialog 
        open={showSuccess}
        onClose={handleCloseSuccess}
        title="Withdrawal Successful!"
        description={`Your withdrawal of ₦${parseFormattedNumber(withdrawnAmount || '0').toLocaleString()} is being processed.`}
      />
    </>
  );
}
