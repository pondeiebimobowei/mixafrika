import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Landmark, Wallet, X, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const accounts = [
  {
    id: 'cash',
    name: 'Cash account',
    detail: 'Wallet',
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
  {
    id: 'checking-5631',
    name: 'Checking - 5631',
    detail: '••••2469 | ING BANK, N.V.',
    icon: Landmark,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export function WithdrawSheet() {
  const [selectedAccount, setSelectedAccount] = useState('checking-5631');

  return (
    <div className="bg-card text-foreground rounded-t-3xl">
      <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold">Select an account</SheetTitle>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                </Button>
            </SheetClose>
          </div>
      </SheetHeader>
      <div className="px-6 py-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Accounts</h3>
        <RadioGroup
          value={selectedAccount}
          onValueChange={setSelectedAccount}
          className="space-y-1"
        >
          {accounts.map((account) => (
            <Label
              key={account.id}
              htmlFor={account.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                selectedAccount === account.id
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

        <Button variant="outline" className="w-full mt-4">
            <CreditCard className="mr-2 h-4 w-4" />
            Add New Card
        </Button>
      </div>
      <SheetFooter className="p-6 bg-card border-t">
        <Button size="lg" className="w-full">
          Confirm
        </Button>
      </SheetFooter>
    </div>
  );
}
