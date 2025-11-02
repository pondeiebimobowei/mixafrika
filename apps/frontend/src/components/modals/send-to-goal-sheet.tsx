import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Wallet } from 'lucide-react';
import type { Goal } from '@/types';
import { SuccessDialog } from './success-dialog';
import { GoalSelect } from './goal-select';

interface SendToGoalSheetProps {
  onBack: () => void;
  balance: number;
  goals: Goal[];
  onSendToGoal: (amount: number, goal: Goal) => void;
}

export function SendToGoalSheet({ onBack, balance, goals, onSendToGoal }: SendToGoalSheetProps) {
  const [amount, setAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentAmount, setSentAmount] = useState('');

  const handleSend = () => {
    const numericAmount = parseFloat(amount);
    const selectedGoal = goals.find(g => g.id.toString() === selectedGoalId);

    if (!numericAmount || !selectedGoal) return;

    onSendToGoal(numericAmount, selectedGoal);
    setSentAmount(amount);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onBack(); // Go back to the previous view after closing success dialog
  }

  return (
    <>
      <div className="bg-card text-foreground rounded-t-3xl flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="-ml-2" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
              </Button>
              <SheetTitle className="text-lg font-semibold mx-auto pr-8">Send to Goal</SheetTitle>
            </div>
        </SheetHeader>

        <div className="px-6 py-6 space-y-6 flex-1">
          <div>
              <Label htmlFor="amount" className="text-sm font-semibold text-muted-foreground mb-2 block">Amount to Send</Label>
              <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold">₦</span>
                  <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 pr-24 text-lg h-12 font-bold"
                  />
                  <Button variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 h-8" onClick={() => setAmount(balance.toString())}>Max</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Wallet className="h-3 w-3"/>
                  Available balance: <span className="font-semibold text-primary">₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
          </div>

          <div>
              <Label htmlFor="goal" className="text-sm font-semibold text-muted-foreground mb-2 block">Select Goal</Label>
              <GoalSelect goals={goals} onValueChange={(value) => setSelectedGoalId(value)} />
          </div>
        </div>

        <SheetFooter className="p-6 bg-card border-t mt-auto">
          <Button size="lg" className="w-full" onClick={handleSend} disabled={!amount || !selectedGoalId || parseFloat(amount) <= 0 || parseFloat(amount) > balance}>
            Send Funds
          </Button>
        </SheetFooter>
      </div>
      <SuccessDialog 
        open={showSuccess}
        onClose={handleCloseSuccess}
        title="Funds Sent!"
        description={`You have successfully sent ₦${parseFloat(sentAmount || '0').toLocaleString()} to your goal.`}
      />
    </>
  );
}
