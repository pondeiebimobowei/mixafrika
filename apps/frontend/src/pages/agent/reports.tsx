
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, FileText, Plus, Send, Upload, Paperclip } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const pastReports = [
    { id: 1, date: '2024-07-15', title: 'Daily Report: Balogun Market', status: 'Submitted' },
    { id: 2, date: '2024-07-14', title: 'Daily Report: Onitsha Outskirts', status: 'Submitted' },
    { id: 3, date: '2024-07-13', title: 'Daily Report: Balogun Market', status: 'Submitted' },
];

function NewReportSheet({ onClose }: { onClose: () => void }) {
    const [attachments, setAttachments] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAttachments(Array.from(event.target.files));
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        toast.success('Your daily field report has been successfully submitted.');
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <SheetTitle>New Field Report</SheetTitle>
                     <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft />
                        </Button>
                    </SheetClose>
                </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <Label htmlFor="visited-traders">Visited Traders (comma-separated)</Label>
                    <Textarea id="visited-traders" placeholder="e.g., Aunty Funke, Idris Bello" />
                </div>
                <div>
                    <Label htmlFor="repayment-confirmations">Repayment Confirmations</Label>
                    <Textarea id="repayment-confirmations" placeholder="Confirm payments collected, e.g., 'Idris Bello - N5,500'" />
                </div>
                 <div>
                    <Label htmlFor="market-feedback">Market Feedback / Observations</Label>
                    <Textarea id="market-feedback" placeholder="Any new trends, issues, or opportunities?" />
                </div>
                <div>
                    <Label htmlFor="attachments">Attachments (Photos, Receipts)</Label>
                    <div className="flex items-center gap-2">
                        <Input id="attachments" type="file" multiple onChange={handleFileChange} className="hidden" />
                        <Label htmlFor="attachments" className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed rounded-lg p-4 text-center text-muted-foreground hover:bg-muted/50">
                                <Upload className="mx-auto h-6 w-6 mb-1"/>
                                <span>{attachments.length > 0 ? `${attachments.length} file(s) selected` : 'Tap to select files'}</span>
                            </div>
                        </Label>
                    </div>
                     {attachments.length > 0 && (
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {attachments.map((file, i) => <p key={i} className="flex items-center gap-2"><Paperclip className="h-3 w-3"/>{file.name}</p>)}
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 border-t">
                <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                </Button>
            </div>
        </form>
    );
}


export default function AgentReportsPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/agent/dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline mx-auto pr-8">Field Reports</h1>
            </header>

            <main className="flex-1 p-4 space-y-4">
                 <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                         <Button className="w-full" size="lg">
                            <Plus className="mr-2 h-5 w-5" />
                            Submit New Report
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
                       <NewReportSheet onClose={() => setIsSheetOpen(false)} />
                    </SheetContent>
                </Sheet>
                
                <div className="pt-4">
                    <h2 className="text-lg font-semibold mb-2">Past Reports</h2>
                     <div className="space-y-3">
                        {pastReports.map(report => (
                            <Card key={report.id} className="bg-card">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10 text-blue-500">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{report.title}</p>
                                            <p className="text-xs text-muted-foreground">{report.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                                        <CheckCircle className="h-4 w-4" />
                                        {report.status}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

