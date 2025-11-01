import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Flag, Plus, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import { AvatarFallback  } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { traderDetailsData } from '@/data/agent';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import type { INotesWithUser } from '../../../../../packages/shared/src/types/notes';
import type { ITransaction } from '../../../../../packages/shared/src/types/transaction';


const TransactionRow = ({ tx }: { tx: ITransaction }) => {
    const isSuccess = tx.status === 'completed';
    const isFailed = tx.status === 'failed';
    const isDisbursement = tx.type === 'disbursement';
    
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
            <div className="flex items-center gap-3">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-full",
                    isSuccess && !isDisbursement && "bg-green-500/10",
                    isFailed && "bg-red-500/10",
                    isDisbursement && "bg-blue-500/10"
                )}>
                    {isSuccess && !isDisbursement && <TrendingUp className="h-5 w-5 text-green-500" />}
                    {isFailed && <XCircle className="h-5 w-5 text-red-500" />}
                    {isDisbursement && <TrendingDown className="h-5 w-5 text-blue-500" />}
                </div>
                <div>
                    <p className="font-semibold text-sm capitalize">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.createdAt}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={cn("font-bold text-sm", isDisbursement ? "text-blue-500" : "text-green-500")}>
                    {isDisbursement ? '-' : '+'}₦{tx.amount.toLocaleString()}
                </p>
                <p className={cn("text-xs",
                    isSuccess ? "text-green-600" : "text-red-600"
                )}>
                    {tx.status}
                </p>
            </div>
        </div>
    )
};

const NoteCard = ({ note }: { note: INotesWithUser }) => (
    <Card className="bg-secondary">
        <CardContent className="p-3">
            <p className="text-sm text-foreground">{note.note}</p>
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>by {note.user.first_name}</span>
                <span>{note.createdAt}</span>
            </div>
        </CardContent>
    </Card>
);

export default function TraderProfilePage({ params }: { params: { id: string } }) {
    const trader = traderDetailsData[params.id];
    const [notes, setNotes] = useState<INotesWithUser[]>(trader?.trader?.notes || []);
    const [newNote, setNewNote] = useState('');
    
    if (!trader) {
        return <div className="flex min-h-screen items-center justify-center">Trader not found.</div>;
    }

    const repaymentPercentage = trader.trader && (trader.trader.stats.repayment_progress / trader.trader.stats.total_repayment) * 100;
    
    const handleAddNote = () => {
        if (newNote.trim() === '') return;
        const note: INotesWithUser = {
            id: `note-${Date.now()}`,
            createdAt: new Date().toLocaleDateString('en-CA'),
            user: { first_name: 'Agent Smith' }, // In a real app, this would come from the logged-in user
            note: newNote,
        };
        setNotes([note, ...notes]);
        setNewNote('');
        toast.success("Your note has been saved.");
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/agent/traders">
                        <ArrowLeft />
                    </Link>
                </Button>
                <div className="flex items-center gap-3 mx-auto pr-8">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={trader.image || ''} />
                        <AvatarFallback>{trader.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <h1 className="text-xl font-bold font-headline">{trader.first_name}</h1>
                </div>
            </header>

            <main className="flex-1 p-4 space-y-6">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base">Loan Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Repayment</p>
                            <p className="text-3xl font-bold">₦{trader.trader?.stats.total_repayment.toLocaleString()}</p>
                        </div>
                        <Progress value={repaymentPercentage} className="h-2" />
                        <div className="flex justify-between text-xs font-medium">
                            <span>Repaid: <span className="text-primary">₦{trader.trader?.stats.repayment_progress.toLocaleString()}</span></span>
                            {/* @ts-expect-error */}
                            <span>Remaining: ₦{( trader.trader.stats.total_repayment - trader.trader.stats.repayment_progress).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base">Trader Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Credit Score</span>
                            <span className="font-semibold">{trader.credit_score}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={trader.trader?.status === 'active' ? 'default' : 'destructive'}>{trader.trader?.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Business Type</span>
                            <span className="font-semibold">{trader.business.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Address</span>
                            <span className="font-semibold truncate">{trader.business.address}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone Number</span>
                            <span className="font-semibold">{trader.business.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Activity</span>
                            <span className="font-semibold">{trader.trader?.last_activity}</span>
                        </div>
                    </CardContent>
                </Card>

                 <Tabs defaultValue="transactions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="transactions">
                        <Card>
                            <CardContent className="p-2 space-y-1">
                                {trader.transactions.length > 0 ? (
                                    trader.transactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)
                                ) : (
                                    <p className="text-center text-sm text-muted-foreground p-4">No transactions found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notes">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Textarea 
                                    placeholder="Add a new note..." 
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <Button className="w-full" onClick={handleAddNote} disabled={!newNote.trim()}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Note
                                </Button>
                            </div>
                            {notes.map(note => <NoteCard key={note.id} note={note} />)}
                            {notes.length === 0 && (
                                 <p className="text-center text-sm text-muted-foreground py-4">No notes for this trader yet.</p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
                
                <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                         <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" className="w-full">
                            <Flag className="mr-2 h-4 w-4" /> Flag Trader for Review
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
