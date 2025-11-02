import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
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
import type { ReinvestCluster } from '@/types';

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


interface ReinvestSheetProps {
  balance: number;
  onReinvest: (amount: number, clusterName: string) => void;
  clusters: ReinvestCluster[];
}

export function ReinvestSheet({ balance, onReinvest, clusters }: ReinvestSheetProps) {
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reinvestedAmount, setReinvestedAmount] = useState('');

  const poolingClusters = useMemo(() => {
    return clusters.filter(c => c.status === 'pooling');
  }, [clusters]);

  useEffect(() => {
    if (poolingClusters.length > 0 && !selectedClusterId) {
      setSelectedClusterId(poolingClusters[0].id);
    }
  }, [poolingClusters, selectedClusterId]);

  const handleMaxClick = () => {
    const availableToReinvest = balance > 0 ? balance : 0;
    setAmount(availableToReinvest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    setAmount(formattedValue);
  }
  
  const handleReinvestClick = () => {
    setShowConfirmDialog(true);
  };
  
  const selectedCluster = poolingClusters.find(c => c.id === selectedClusterId);

  const handleConfirmReinvest = () => {
    if (!selectedCluster || !amount) return;

    setIsProcessing(true);
    setTimeout(() => {
      onReinvest(parseFormattedNumber(amount), selectedCluster.name);
      
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setReinvestedAmount(amount);
      setShowSuccess(true);
    }, 2000);
  };
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Optionally reset state or navigate back
  }

  const numericAmount = parseFormattedNumber(amount || '0');

  return (
    <>
    <div className="bg-card text-foreground rounded-t-3xl">
      <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold">Reinvest Earnings</SheetTitle>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                </Button>
            </SheetClose>
          </div>
      </SheetHeader>
      <div className="px-6 py-6 space-y-6">
        <div>
            <Label htmlFor="amount" className="text-sm font-semibold text-muted-foreground mb-2 block">Amount to Reinvest</Label>
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
            <p className="text-xs text-muted-foreground mt-2">Available to reinvest: <span className="font-semibold text-primary">₦{balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Select Cluster to Reinvest In</h3>
          {poolingClusters.length > 0 ? (
            <RadioGroup
              value={selectedClusterId ?? ''}
              onValueChange={setSelectedClusterId}
              className="space-y-1"
            >
              {poolingClusters.map((cluster) => (
                <Label
                  key={cluster.id}
                  htmlFor={cluster.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                    selectedClusterId === cluster.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-transparent border-border hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", cluster.bgColor)}>
                      <cluster.logo className={cn("h-5 w-5", cluster.color)} />
                    </div>
                    <div>
                      <p className="font-semibold">{cluster.name}</p>
                    </div>
                  </div>
                  <RadioGroupItem value={cluster.id} id={cluster.id} className="h-5 w-5" />
                </Label>
              ))}
            </RadioGroup>
          ) : (
             <div className="text-center py-6 text-muted-foreground bg-muted/50 rounded-lg">
                <p>No clusters are currently pooling for funds.</p>
             </div>
          )}
        </div>
      </div>
      <SheetFooter className="p-6 bg-card border-t">
        <Button size="lg" className="w-full" onClick={handleReinvestClick} disabled={!numericAmount || !selectedClusterId || numericAmount <= 0 || numericAmount > balance}>
          Reinvest ₦{numericAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
        </Button>
      </SheetFooter>
    </div>

    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Reinvestment</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to reinvest ₦{numericAmount.toLocaleString()} in {selectedCluster?.name}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>No</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmReinvest} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Yes, Reinvest'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
    <SuccessDialog 
      open={showSuccess}
      onClose={handleCloseSuccess}
      title="Reinvestment Successful!"
      description={`You have successfully reinvested ₦${parseFormattedNumber(reinvestedAmount || '0').toLocaleString()} in ${selectedCluster?.name}.`}
    />
    </>
  );
}
