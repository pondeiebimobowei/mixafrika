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
import { Users, Target, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Goal } from '@/types';
import { SendToGoalSheet } from './send-to-goal-sheet';
import { SendToUserSheet } from './send-to-user-sheet';

const sendOptions = [
  {
    id: 'to-user',
    name: 'To another MIX user',
    detail: 'Send money instantly to a friend',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'to-goal',
    name: 'To a Goal',
    detail: 'Allocate funds to one of your goals',
    icon: Target,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'lock-funds',
    name: 'Lock Funds',
    detail: 'Secure your money for a fixed period',
    icon: Lock,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

type ViewState = 'list' | 'send-to-goal' | 'send-to-user';

interface SendSheetProps {
  balance: number;
  goals: Goal[];
  onSendMoney: (amount: number, recipientName: string) => void;
  onSendToGoal: (amount: number, goal: Goal) => void;
}

export function SendSheet({ balance, goals, onSendMoney, onSendToGoal }: SendSheetProps) {
  const [selectedOption, setSelectedOption] = useState('to-user');
  const [view, setView] = useState<ViewState>('list');

  const handleProceed = () => {
    if (selectedOption === 'to-goal') {
      setView('send-to-goal');
    } else if (selectedOption === 'to-user') {
      setView('send-to-user');
    }
  };
  
  const handleBack = () => setView('list');
  
  if (view === 'send-to-goal') {
    return <SendToGoalSheet onBack={handleBack} balance={balance} goals={goals} onSendToGoal={onSendToGoal} />;
  }

  if (view === 'send-to-user') {
    return <SendToUserSheet onBack={handleBack} balance={balance} onSendMoney={onSendMoney} />;
  }

  return (
    <div className="bg-card text-foreground rounded-t-3xl">
      <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold">Send Money</SheetTitle>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                </Button>
            </SheetClose>
          </div>
      </SheetHeader>
      <div className="px-6 py-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">What do you want to do?</h3>
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="space-y-1"
        >
          {sendOptions.map((option) => (
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
        <Button size="lg" className="w-full" onClick={handleProceed}>
          Proceed
        </Button>
      </SheetFooter>
    </div>
  );
}
