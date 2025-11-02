import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PiggyBank, Plus, Zap, Settings, CheckCircle, Wallet, CreditCard, Eye, EyeOff, Landmark } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SuccessDialog } from '@/components/modals/success-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Progress } from '@/components/ui/progress';
import { mockSavingsHistory, maturityConfig } from '@/data/trader';
import type { SavingsItem } from '@/types';
import { Link } from 'react-router';
import toast from 'react-hot-toast';

export default function EsusuPage() {
    const [esusuBalance, setEsusuBalance] = useState(25000);
    const [amountToSave, setAmountToSave] = useState('');
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [savedAmount, setSavedAmount] = useState(0);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [timeline, setTimeline] = useState({ progressPercentage: 0, daysLeft: 0 });

    useEffect(() => {
        const today = new Date();
        const { startDate, maturityDate } = maturityConfig;
        const totalDuration = maturityDate.getTime() - startDate.getTime();
        const elapsedDuration = today.getTime() - startDate.getTime();
        
        let progress = 0;
        let remainingDays = 0;

        if (totalDuration > 0) {
             if (elapsedDuration > 0) {
                progress = Math.min(100, (elapsedDuration / totalDuration) * 100);
                const remainingTime = Math.max(0, maturityDate.getTime() - today.getTime());
                remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
            } else {
                remainingDays = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));
            }
        } else {
            progress = 100;
        }

        setTimeline({ progressPercentage: progress, daysLeft: remainingDays });
    }, []);


    const handleSaveClick = () => {
        const numericAmount = parseFloat(amountToSave);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.success('Please enter a valid amount to save.');
            return;
        }
        setShowConfirmDialog(true);
    };

    const handleConfirmSave = () => {
        const numericAmount = parseFloat(amountToSave);
        
        // Here you would typically check wallet balance
        setEsusuBalance(prev => prev + numericAmount);
        setSavedAmount(numericAmount);
        setAmountToSave('');
        setShowConfirmDialog(false);
        setShowSuccessDialog(true);
    };

    const handleWithdraw = () => {
        toast.success(`₦${esusuBalance.toLocaleString()} has been moved to your main wallet.`);
        setEsusuBalance(0);
    };
    
    const handleUpdateAutoSave = () => {
        toast.success('Your automated savings settings have been saved.');
    };

    return (
        <>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/trader/dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline mx-auto pr-8 flex items-center gap-2">
                    <PiggyBank className="h-6 w-6" /> Esusu Savings
                </h1>
            </header>

            <main className="flex-1 p-4 space-y-4">
                <Card className="bg-primary text-primary-foreground text-center">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-normal text-primary-foreground/80 flex items-center justify-center gap-2">
                            <span>Total Saved</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-primary-foreground/80 hover:bg-white/20"
                                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                            >
                                {isBalanceVisible ? (
                                <Eye className="h-4 w-4" />
                                ) : (
                                <EyeOff className="h-4 w-4" />
                                )}
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-4xl font-bold">
                             {isBalanceVisible ? `₦${esusuBalance.toLocaleString()}` : '∗∗∗∗∗∗∗'}
                        </p>
                        <div className="mt-4 space-y-2">
                            <Progress value={timeline.progressPercentage} className="h-2 bg-white/30 [&>div]:bg-white" />
                            <div className="flex justify-between text-xs text-primary-foreground/80">
                                <span>Timeline</span>
                                <span>{timeline.daysLeft} days to maturity</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">Contribute to Savings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="save-amount">Amount</Label>
                            <div className="flex gap-2">
                                <Input 
                                    id="save-amount"
                                    type="number"
                                    placeholder="e.g. 1000"
                                    value={amountToSave}
                                    onChange={(e) => setAmountToSave(e.target.value)}
                                />
                                <Button onClick={handleSaveClick}>
                                    <Plus className="mr-2 h-4 w-4" /> Save
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2">
                            {[500, 1000, 2000, 5000, 10000].map(val => (
                                <Button key={val} variant="outline" size="sm" onClick={() => setAmountToSave(val.toString())}>
                                    ₦{val >= 1000 ? `${val / 1000}k` : val}
                                </Button>
                            ))}
                        </div>
                         <div className="border-t pt-4">
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleWithdraw}
                                disabled={timeline.daysLeft > 0}
                            >
                                <Landmark className="mr-2 h-4 w-4" />
                                Withdraw to Wallet
                            </Button>
                            {timeline.daysLeft > 0 && (
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    Withdrawal will be available in {timeline.daysLeft} days.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Automated Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-full">
                                   <Zap className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Enable Auto-Save</p>
                                    <p className="text-xs text-muted-foreground">Save automatically every day.</p>
                                </div>
                            </div>
                            <Switch checked={autoSaveEnabled} onCheckedChange={setAutoSaveEnabled} />
                        </div>
                        {autoSaveEnabled && (
                            <div className="mt-4 space-y-4 animate-in fade-in-50">
                                <div className="space-y-2">
                                    <Label htmlFor="auto-save-amount">Daily Amount</Label>
                                    <Input id="auto-save-amount" type="number" placeholder="e.g. 1000" defaultValue="1000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="auto-save-source">Source</Label>
                                    <Select defaultValue="wallet">
                                        <SelectTrigger id="auto-save-source">
                                            <SelectValue placeholder="Select funding source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="wallet">
                                                <div className="flex items-center gap-2">
                                                   <Wallet className="h-4 w-4 text-muted-foreground" />
                                                   <span>MIX Wallet</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="card">
                                                <div className="flex items-center gap-2">
                                                   <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                   <span>Card (**** 7134)</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full" onClick={handleUpdateAutoSave}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Update Auto-Save Settings
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Savings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockSavingsHistory.map((item: SavingsItem) => (
                            <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{item.type === 'auto' ? 'Auto Saving' : 'Manual Saving'}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-sm">+₦{item.amount.toLocaleString()}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </main>
        </div>
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Confirm Savings</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to move ₦{parseFloat(amountToSave || '0').toLocaleString()} from your MIX wallet to your Esusu savings. Do you want to proceed?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSave}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <SuccessDialog
            open={showSuccessDialog}
            onClose={() => setShowSuccessDialog(false)}
            title="Contribution Successful!"
            description={`You have successfully saved ₦${savedAmount.toLocaleString()} to your Esusu.`}
        />
        </>
    );
}
