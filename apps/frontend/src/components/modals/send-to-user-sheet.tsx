import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Wallet, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SuccessDialog } from './success-dialog';
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


const recentRecipients = [
  { id: 'tunde', name: 'Tunde O.', avatar: 'https://picsum.photos/seed/101/150/150' },
  { id: 'aisha', name: 'Aisha B.', avatar: 'https://picsum.photos/seed/102/150/150' },
  { id: 'emeka', name: 'Emeka K.', avatar: 'https://picsum.photos/seed/103/150/150' },
  { id: 'funke', name: 'Funke A.', avatar: 'https://picsum.photos/seed/108/150/150' },
];

interface SendToUserSheetProps {
  onBack: () => void;
  balance: number;
  onSendMoney: (amount: number, recipientName: string) => void;
}

export function SendToUserSheet({ onBack, balance, onSendMoney }: SendToUserSheetProps) {
  const [amount, setAmount] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentAmount, setSentAmount] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendClick = () => {
    setShowConfirmDialog(true);
  };
  
  const handleConfirmSend = () => {
    if (!selectedRecipient || !amount) return;

    setIsProcessing(true);
    setTimeout(() => {
      onSendMoney(parseFloat(amount), selectedRecipient.name);
      
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setSentAmount(amount);
      setShowSuccess(true);
    }, 2000);
  };
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onBack();
  }

  const selectedRecipient = recentRecipients.find(r => r.id === selectedRecipientId);

  return (
    <>
      <div className="bg-card text-foreground rounded-t-3xl flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="-ml-2" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
              </Button>
              <SheetTitle className="text-lg font-semibold mx-auto pr-8">Send to User</SheetTitle>
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
                  Available balance: <span className="font-semibold text-primary">₦{balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </p>
          </div>

          <div>
              <Label htmlFor="recipient" className="text-sm font-semibold text-muted-foreground mb-2 block">Select Recipient</Label>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="recipient" placeholder="Search by @username" className="pl-10"/>
              </div>

              <h4 className="text-sm font-semibold text-muted-foreground my-4">Recent</h4>
              <ScrollArea className="h-40">
                  <div className="space-y-3 pr-4">
                      {recentRecipients.map(user => (
                          <div 
                              key={user.id}
                              className={cn(
                                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer border-2",
                                  selectedRecipientId === user.id ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted/50'
                              )}
                              onClick={() => setSelectedRecipientId(user.id)}
                          >
                              <Avatar>
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <p className="font-semibold">{user.name}</p>
                          </div>
                      ))}
                  </div>
              </ScrollArea>
          </div>
        </div>

        <SheetFooter className="p-6 bg-card border-t mt-auto">
          <Button size="lg" className="w-full" onClick={handleSendClick} disabled={!amount || !selectedRecipientId || parseFloat(amount) <= 0 || parseFloat(amount) > balance}>
            Send Funds
          </Button>
        </SheetFooter>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send ₦{parseFloat(amount || '0').toLocaleString()} to {selectedRecipient?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Yes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SuccessDialog 
        open={showSuccess}
        onClose={handleCloseSuccess}
        title="Funds Sent Successfully!"
        description={`You have sent ₦${parseFloat(sentAmount || '0').toLocaleString()} to ${selectedRecipient?.name || 'a user'}.`}
      />
    </>
  );
}

    
