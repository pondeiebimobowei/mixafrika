import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Wallet, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SuccessDialog } from "@/components/modals/success-dialog";
import toast from "react-hot-toast";


interface MakeRepaymentSheetProps {
    upcomingRepayment: {
        amount: number;
        dueDate: string;
    };
    walletBalance: number;
    dailyRepaymentAmount?: number;
    isMissedPayment?: boolean;
    onPaymentSuccess?: () => void;
    onSheetClose?: () => void;
}

export function MakeRepaymentSheet({ upcomingRepayment, walletBalance, dailyRepaymentAmount = 5500, isMissedPayment = false, onPaymentSuccess, onSheetClose }: MakeRepaymentSheetProps) {
    const [amount, setAmount] = useState(upcomingRepayment.amount.toString());
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedDays, setSelectedDays] = useState<number | null>(isMissedPayment ? null : 1);
    const [isMissedDay, setIsMissedDay] = useState(isMissedPayment);
    const [isCustomDays, setIsCustomDays] = useState(false);
    const [customDays, setCustomDays] = useState('');

    useEffect(() => {
        setAmount(upcomingRepayment.amount.toString());
        setIsMissedDay(isMissedPayment);
        setSelectedDays(isMissedPayment ? null : 1);
        setIsCustomDays(false);
        setCustomDays('');
    }, [upcomingRepayment, isMissedPayment]);


    const handleRepay = () => {
        const repayAmount = parseFloat(amount);
        if (repayAmount > walletBalance) {
            toast.success('Insufficient funds');
            return;
        }

        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            if (onPaymentSuccess) {
                onPaymentSuccess();
            }
        }, 1500);
    }
    
    const setRepaymentDays = (days: number) => {
        setAmount((dailyRepaymentAmount * days).toString());
        setSelectedDays(days);
        setIsMissedDay(false);
        setIsCustomDays(false);
        setCustomDays('');
    }

    const handleCustomDaysClick = () => {
        setIsCustomDays(true);
        setSelectedDays(null);
    }
    
    const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const days = e.target.value;
        setCustomDays(days);
        const numericDays = parseInt(days);
        if (!isNaN(numericDays) && numericDays > 0) {
            setAmount((dailyRepaymentAmount * numericDays).toString());
        } else {
            setAmount('');
        }
    }


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
        if (!isMissedPayment) {
            setSelectedDays(null);
            setIsMissedDay(false);
        }
    }
    
    const handleSuccessClose = () => {
        setIsSuccess(false);
        if (onSheetClose) {
            onSheetClose();
        }
    }

    const numericAmount = parseFloat(amount) || 0;

    return (
        <>
        <div className="bg-card text-foreground rounded-t-3xl">
            <SheetHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <SheetTitle className="text-lg font-semibold">Make Repayment</SheetTitle>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={onSheetClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </SheetClose>
                </div>
            </SheetHeader>
            <div className="px-4 py-6 space-y-6">
                 {(isMissedDay || isMissedPayment) && (
                    <Alert variant="destructive" className="flex items-start gap-3">
                         <AlertTriangle className="h-5 w-5 mt-0.5"/>
                         <div>
                            <AlertTitle className="font-semibold">Missed Payment</AlertTitle>
                            <AlertDescription className="text-xs">
                                You are paying for a missed day. Late payment can affect your credit score.
                            </AlertDescription>
                        </div>
                    </Alert>
                )}
                <div>
                    <Label htmlFor="repayment-amount">Amount</Label>
                    <Input 
                        id="repayment-amount"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        className="h-12 text-lg"
                        readOnly={isMissedPayment || isCustomDays || (selectedDays !== null && !isCustomDays)}
                    />
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Wallet className="h-4 w-4"/>
                        <span>Wallet Balance: <span className="font-semibold text-primary">₦{walletBalance.toLocaleString()}</span></span>
                    </div>
                </div>
                {!isMissedPayment && (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <Button variant={selectedDays === 1 ? 'default' : 'secondary'} className="flex-1" onClick={() => setRepaymentDays(1)}>1 Day</Button>
                            <Button variant={selectedDays === 7 ? 'default' : 'secondary'} className="flex-1" onClick={() => setRepaymentDays(7)}>7 Days</Button>
                            <Button variant={isCustomDays ? 'default' : 'secondary'} className="flex-1" onClick={handleCustomDaysClick}>Custom</Button>
                        </div>
                        {isCustomDays && (
                             <div className="relative pt-2">
                                 <Input 
                                     type="number" 
                                     placeholder="Enter number of days" 
                                     value={customDays}
                                     onChange={handleCustomDaysChange}
                                 />
                             </div>
                        )}
                    </div>
                )}
                <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                    {isMissedPayment ? (
                         <p>You are paying the missed repayment of <span className="font-semibold text-foreground">₦{upcomingRepayment.amount.toLocaleString()}</span> from <span className="font-semibold text-foreground">{upcomingRepayment.dueDate.replace('for ','')}</span>.</p>
                    ) : (
                         <p>Your upcoming repayment of <span className="font-semibold text-foreground">₦{upcomingRepayment.amount.toLocaleString()}</span> is due <span className="font-semibold text-foreground">{upcomingRepayment.dueDate}</span>.</p>
                    )}
                </div>
            </div>
            <div className="p-4 border-t">
                <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleRepay} 
                    disabled={isProcessing || numericAmount <= 0 || numericAmount > walletBalance}
                >
                    {isProcessing ? 'Processing...' : `Pay ₦${numericAmount.toLocaleString()}`}
                </Button>
            </div>
        </div>

        <SuccessDialog
            open={isSuccess}
            onClose={handleSuccessClose}
            title="Repayment Successful"
            description={`Your payment of ₦${numericAmount.toLocaleString()} has been successfully processed.`}
            icon="Check"
        />
        </>
    );
}
