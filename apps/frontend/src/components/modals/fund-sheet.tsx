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
import { Landmark, CreditCard, Phone, X, Bitcoin } from 'lucide-react';
import { cn } from '@/lib/utils';

const fundingOptions = [
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    detail: 'Add money via your bank app',
    icon: Landmark,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'card',
    name: 'Card',
    detail: 'Use a debit or credit card',
    icon: CreditCard,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'ussd',
    name: 'USSD',
    detail: 'Dial a code to fund',
    icon: Phone,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    detail: 'Fund with your crypto wallet',
    icon: Bitcoin,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
];

export function FundSheet() {
  const [selectedOption, setSelectedOption] = useState('bank-transfer');

  return (
    <div className="bg-card text-foreground rounded-t-3xl">
      <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold">Fund Wallet</SheetTitle>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                </Button>
            </SheetClose>
          </div>
      </SheetHeader>
      <div className="px-6 py-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Funding Methods</h3>
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="space-y-1"
        >
          {fundingOptions.map((option) => (
            <Label
              key={option.id}
              htmlFor={option.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                selectedOption === option.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-transparent border-border hover:bg-muted/50'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", option.bgColor)}>
                  <option.icon className={cn("h-5 w-5", option.color)} />
                </div>
                <div>
                  <p className="font-semibold">{option.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {option.detail}
                  </p>
                </div>
              </div>
              <RadioGroupItem value={option.id} id={option.id} className="h-5 w-5" />
            </Label>
          ))}
        </RadioGroup>
      </div>
      <SheetFooter className="p-6 bg-card border-t">
        <Button size="lg" className="w-full">
          Proceed
        </Button>
      </SheetFooter>
    </div>
  );
}
