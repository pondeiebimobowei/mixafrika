import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Landmark, Eye, EyeOff, CheckCircle, Repeat, Download } from 'lucide-react';
import { Link } from 'react-router';

const commissionHistory = [
    { id: 1, type: 'Commission', date: '2024-07-15', amount: 550, description: "Aunty Funke's Repayment" },
    { id: 2, type: 'Commission', date: '2024-07-15', amount: 400, description: "Idris Bello's Repayment" },
    { id: 3, type: 'Withdrawal', date: '2024-07-12', amount: -15000, description: "To Bank Account" },
    { id: 4, type: 'Commission', date: '2024-07-11', amount: 800, description: "Chinaza Okoro's Repayment" },
    { id: 5, type: 'Incentive', date: '2024-07-10', amount: 10000, description: "Q2 Performance Bonus" },
];

export default function AgentWalletPage() {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const balance = 27500;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/agent/dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline mx-auto pr-8">My Wallet</h1>
            </header>

            <main className="flex-1 p-4 space-y-6">
                <Card className="bg-primary text-primary-foreground text-center">
                    <CardHeader>
                        <CardTitle className="text-base font-normal flex items-center justify-center gap-2">
                            <span>Available Balance</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground/80 hover:bg-white/20" onClick={() => setIsBalanceVisible(v => !v)}>
                                {isBalanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            {isBalanceVisible ? `₦${balance.toLocaleString()}` : '******'}
                        </p>
                    </CardContent>
                </Card>

                <Button size="lg" className="w-full">
                    <Landmark className="mr-2 h-4 w-4" />
                    Withdraw to Bank
                </Button>
                
                <div>
                     <div className="flex justify-between items-center mb-2 pt-4">
                        <h2 className="text-lg font-semibold">Transaction History</h2>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {commissionHistory.map(tx => {
                            const isCredit = tx.amount > 0;
                            return (
                                <Card key={tx.id}>
                                    <CardContent className="p-3 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center h-9 w-9 rounded-full ${isCredit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                {isCredit ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Repeat className="h-5 w-5 text-red-500" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{tx.type}</p>
                                                <p className="text-xs text-muted-foreground">{tx.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-sm ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
                                                {isCredit ? '+' : ''}₦{tx.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

            </main>
        </div>
    );
}

