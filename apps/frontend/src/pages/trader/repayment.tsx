import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Info, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { initialRepaymentHistory, upcomingRepayment, walletBalance } from '@/data/trader';
import type { Repayment } from '@/types';
import { Link } from 'react-router';
import { MakeRepaymentSheet } from '@/components/sheets/make-repayment-sheet';


export default function RepaymentsPage() {
    const [repaymentHistory, setRepaymentHistory] = useState<Repayment[]>(initialRepaymentHistory);
    const [selectedRepaymentId, setSelectedRepaymentId] = useState<string | null>(null);


    const handlePaymentSuccess = (repaymentId: string) => {
        setRepaymentHistory(prevHistory => 
            prevHistory.map(item => 
                item.id === repaymentId ? { ...item, status: 'Paid (Late)' } : item
            )
        );
        setSelectedRepaymentId(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-2 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/trader-dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
            </header>
            <main className="flex-1 p-4 space-y-4">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                        <CardTitle className="text-base font-normal text-primary-foreground/80">Upcoming Repayment</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <div>
                            <p className="text-2xl font-bold">₦{upcomingRepayment.amount.toLocaleString()}</p>
                            <p className="text-sm text-primary-foreground/80">Due {upcomingRepayment.dueDate}</p>
                        </div>
                         <Sheet>
                            <SheetTrigger asChild>
                                <Button className="bg-white text-primary hover:bg-white/90">Pay Now</Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-3xl">
                                <MakeRepaymentSheet 
                                    upcomingRepayment={upcomingRepayment} 
                                    walletBalance={walletBalance} 
                                />
                            </SheetContent>
                        </Sheet>
                    </CardContent>
                </Card>

                <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-4 w-4 text-yellow-600 shrink-0" />
                        <span>Your payment history is updated in real-time. Fast repayments increase credit score</span>
                    </div>
                    <h2 className="text-lg font-semibold px-1 pt-2">Past Repayments</h2>
                    {repaymentHistory.map((repayment: Repayment) => {
                        const isPaid = repayment.status === 'Paid';
                        const isPaidLate = repayment.status === 'Paid (Late)';
                        const isLate = repayment.status === 'Late';

                        return (
                            <div key={repayment.id} className="flex items-center justify-between p-3 rounded-lg bg-card">
                               <div className="flex items-center gap-3">
                                 <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", 
                                     isPaid ? 'bg-green-500/10' :
                                     isPaidLate ? 'bg-yellow-500/10' :
                                     'bg-red-500/10'
                                 )}>
                                     {isPaid ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                     ) : isPaidLate ? (
                                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                     ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                     )}
                                 </div>
                                 <div>
                                     <p className="font-semibold">₦{repayment.amount.toLocaleString()}</p>
                                     <p className="text-sm text-muted-foreground">{repayment.date}</p>
                                 </div>
                               </div>
                                {isLate ? (
                                    <Sheet open={selectedRepaymentId === repayment.id} onOpenChange={(isOpen) => !isOpen && setSelectedRepaymentId(null)}>
                                        <SheetTrigger asChild>
                                            <Button variant="destructive" size="sm" onClick={() => setSelectedRepaymentId(repayment.id)}>Pay Now</Button>
                                        </SheetTrigger>
                                        <SheetContent side="bottom" className="rounded-t-3xl">
                                            <MakeRepaymentSheet
                                                upcomingRepayment={{ amount: repayment.amount, dueDate: `for ${repayment.date}` }}
                                                walletBalance={walletBalance}
                                                isMissedPayment={true}
                                                onPaymentSuccess={() => handlePaymentSuccess(repayment.id)}
                                                onSheetClose={() => setSelectedRepaymentId(null)}
                                            />
                                        </SheetContent>
                                    </Sheet>
                                ) : (
                                    <div className={cn("text-sm font-semibold py-1 px-2.5 rounded-full",
                                        isPaid ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                                    )}>
                                        {repayment.status}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
