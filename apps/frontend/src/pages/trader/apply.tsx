import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ArrowLeft, Fingerprint, Briefcase, MapPin, Wallet, Calendar, Repeat, Lightbulb } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SuccessDialog } from '@/components/modals/success-dialog';
import { DURATION_RATES, requiredDocs } from '@/data/trader';
import type { UploadedFilesState } from '@/types';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export default function FundApplicationPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [businessType, setBusinessType] = useState('');
    const [businessLocation, setBusinessLocation] = useState('');
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [showFingerprintDialog, setShowFingerprintDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});


    useEffect(() => {
        if (showValidationDialog) {
            const getCameraPermission = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setHasCameraPermission(true);

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                    toast('Please enable camera permissions to complete validation.');
                }
            };
            getCameraPermission();
        } else {
            // Turn off camera when dialog is closed
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [showValidationDialog, toast]);

    const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFiles(prev => ({ ...prev, [docId]: e.target.files![0] }));
        }
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowValidationDialog(true);
    };

    const handleFacialScanSuccess = () => {
        setShowValidationDialog(false);
        setShowFingerprintDialog(true);
    };

    const handleFingerprintSuccess = () => {
        setShowFingerprintDialog(false);
        setIsLoading(true);
        // Simulate API call after successful validation
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccessDialog(true);
        }, 2000);
    };

    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);
        navigate('/trader-dashboard');
    }

    const { interestAmount, totalRepayment, interestRate, dailyRepayment } = useMemo(() => {
        const numericAmount = parseFloat(amount);
        const numericDuration = parseInt(duration);
        if (isNaN(numericAmount) || isNaN(numericDuration) || !DURATION_RATES[duration]) {
            return { interestAmount: 0, totalRepayment: 0, interestRate: 0, dailyRepayment: 0 };
        }

        const rate = DURATION_RATES[duration];
        const interest = numericAmount * rate;
        const total = numericAmount + interest;
        const daily = total / numericDuration;

        return { interestAmount: interest, totalRepayment: total, interestRate: rate * 100, dailyRepayment: daily };
    }, [amount, duration]);

    return (
        <>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold font-headline mx-auto pr-8">Apply for Funds</h1>
            </header>

            <main className="flex-1">
                <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
                    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                        <div className="space-y-2">
                            <Label htmlFor="businessType">Business Type</Label>
                             <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Select required onValueChange={setBusinessType} value={businessType}>
                                    <SelectTrigger id="businessType" className={cn("pl-10", !businessType && "text-muted-foreground")}>
                                        <SelectValue placeholder="Select business category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                                        <SelectItem value="electronics">Consumer Electronics</SelectItem>
                                        <SelectItem value="manufacturing">Artisanal Manufacturing</SelectItem>
                                        <SelectItem value="agriculture">Agriculture</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {businessType === 'other' && (
                            <div className="space-y-2 animate-in fade-in">
                                <Label htmlFor="otherBusinessType">Specify Business Type</Label>
                                <div className="relative">
                                     <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="otherBusinessType" placeholder="e.g., Logistics and Delivery" required className="pl-10" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="businessLocation">Business Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Select required onValueChange={setBusinessLocation} value={businessLocation}>
                                    <SelectTrigger id="businessLocation" className={cn("pl-10", !businessLocation && "text-muted-foreground")}>
                                        <SelectValue placeholder="Select your primary market" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lagos">Lagos (Balogun, etc.)</SelectItem>
                                        <SelectItem value="onitsha">Onitsha (Main Market)</SelectItem>
                                        <SelectItem value="aba">Aba (Ariaria, etc.)</SelectItem>
                                        <SelectItem value="kano">Kano (Kantin Kwari, etc.)</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Funding Amount Requested (₦)</Label>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    placeholder="e.g., 500000" 
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Repayment Duration</Label>
                                 <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Select required onValueChange={setDuration} value={duration}>
                                        <SelectTrigger id="duration" className={cn("pl-10", !duration && "text-muted-foreground")}>
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 Days</SelectItem>
                                            <SelectItem value="60">60 Days</SelectItem>
                                            <SelectItem value="90">90 Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="repaymentPlan">Repayment Plan</Label>
                                <div className="relative">
                                    <Repeat className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="repaymentPlan" placeholder="e.g., Daily" defaultValue="Daily" disabled className="pl-10" />
                                </div>
                            </div>
                        </div>

                        {totalRepayment > 0 && (
                            <Card className="bg-muted/50 border-dashed animate-in fade-in">
                                <CardContent className="p-4 text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Interest ({interestRate}%)</span>
                                        <span className="font-semibold">₦{interestAmount.toLocaleString()}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="text-muted-foreground">Daily Repayment</span>
                                        <span className="font-semibold text-primary">~ ₦{dailyRepayment.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                                    </div>
                                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                        <span>Total to Repay</span>
                                        <span>₦{totalRepayment.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="purpose">Purpose of Funds</Label>
                            <div className="relative">
                                 <Lightbulb className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Textarea id="purpose" placeholder="Describe how you will use the funds..." required className="pl-10" />
                            </div>
                        </div>
                         <div className="space-y-4">
                            <Label>Required Documents</Label>
                            <Card className="bg-muted/50">
                                <CardContent className="p-4 space-y-3">
                                    {requiredDocs.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
                                            <div className="flex items-center gap-3 text-sm">
                                                <doc.icon className="h-5 w-5 text-primary"/>
                                                <div>
                                                    <span className="font-medium">{doc.name}</span>
                                                    {uploadedFiles[doc.id] && (
                                                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{uploadedFiles[doc.id]?.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <Label htmlFor={doc.id} className={cn(
                                                "shrink-0",
                                                buttonVariants({ variant: uploadedFiles[doc.id] ? 'secondary' : 'default', size: 'sm' })
                                            )}>
                                                {uploadedFiles[doc.id] ? 'Change' : 'Upload'}
                                            </Label>
                                            <Input id={doc.id} type="file" className="hidden" onChange={(e) => handleFileChange(doc.id, e)} />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="p-4 bg-background border-t sticky bottom-0">
                         <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit Application"}
                        </Button>
                    </div>
                </form>
            </main>
        </div>

        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Facial Scan Verification</DialogTitle>
                    <DialogDescription>
                        Please position your face in the frame to verify your identity.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted mt-4">
                    <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Alert variant="destructive" className="w-auto">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                Please allow camera access to use this feature.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                     <div className="absolute inset-4 border-2 border-dashed border-primary rounded-lg"></div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setShowValidationDialog(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleFacialScanSuccess} disabled={!hasCameraPermission}>Verify</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <Dialog open={showFingerprintDialog} onOpenChange={setShowFingerprintDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fingerprint Verification</DialogTitle>
                    <DialogDescription>
                        Please place your finger on the scanner to confirm your application.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center h-48 w-full my-4">
                    <div className="relative h-28 w-28">
                        <Fingerprint className="h-full w-full text-muted-foreground/30" />
                        <div className="absolute top-0 left-0 h-full w-full bg-linear-to-b from-primary/50 to-transparent animate-pulse rounded-full" style={{ animation: 'scanner-pulse 2s infinite' }}></div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setShowFingerprintDialog(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleFingerprintSuccess}>Verify</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <SuccessDialog
            open={showSuccessDialog}
            onClose={handleSuccessDialogClose}
            title="Application Submitted!"
            description="Your funding application has been received and is under review."
            icon="Check"
        />

        </>
    );
}
