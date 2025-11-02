import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Settings,
  Wallet,
  Repeat,
  Landmark,
  History,
  Eye,
  EyeOff,
  Briefcase,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';
import { traderProfileData } from '@/data';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { SettingsSheet } from '@/components/modals/settings-sheet';
import { FundSheet } from '@/components/modals/fund-sheet';
import { MakeRepaymentSheet } from '@/components/sheets/make-repayment-sheet';
import { WithdrawSheet } from '@/components/modals/withdraw-sheet';
import { TraderTransactions } from '@/components/transactions';


export default function TraderProfilePage() {
    const { user } = useAuthStore();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        phoneNumber: '',
        address: '',
        businessType: '',
    });
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    const displayData = traderProfileData;

    useEffect(() => {
        if (displayData) {
            setFormData({
                businessName: displayData.businessName || '',
                phoneNumber: displayData.phoneNumber || '',
                address: displayData.address || '',
                businessType: displayData.businessType || '',
            });
        }
    }, [displayData]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        // In a real app, this would be an API call
        toast.success("Profile updated successfully!");
        setIsEditing(false);
    };

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary-foreground">
      <header className="flex items-center justify-between p-4 pt-8">
        <Button variant="ghost" size="icon" className="bg-white/10 rounded-xl" asChild>
          <Link to="/trader-dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
          <Avatar>
            <AvatarImage
              src="https://picsum.photos/seed/301/200/200"
              alt="Trader"
              data-ai-hint="profile picture"
            />
            <AvatarFallback>{displayData?.businessName?.charAt(0) || 'T'}</AvatarFallback>
          </Avatar>
        </div>
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/10 rounded-xl">
                <Settings />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-0">
              <SheetTitle className="sr-only">Settings</SheetTitle>
              <SettingsSheet />
            </SheetContent>
          </Sheet>
      </header>

      <div className="text-center mt-4">
        <p className="text-lg font-semibold">{displayData?.businessName || 'Trader'}</p>
        <p className="text-sm text-primary-foreground/80">{user?.email}</p>
      </div>

      <main className="flex-1 mt-6">
        <div className="text-center px-4">
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-primary-foreground/80">
              Your Wallet Balance
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground/80"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              {isBalanceVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-4xl font-bold mt-1">
            {isBalanceVisible ? `₦${(displayData?.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '∗∗∗∗∗∗∗∗∗∗'}
          </p>
        </div>

        <div className="mt-8 bg-background text-foreground flex-1 px-4 py-6 rounded-t-3xl">
          <div className="grid grid-cols-4 gap-4 text-center">
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <Wallet className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium">Fund</span>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0">
                 <SheetTitle className="sr-only">Fund Wallet</SheetTitle>
                <FundSheet />
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <Repeat className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium">Repay</span>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl">
                <MakeRepaymentSheet upcomingRepayment={{ amount: 5500, dueDate: "Tomorrow" }} walletBalance={displayData?.walletBalance || 0} />
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium">Withdraw</span>
                </div>
              </SheetTrigger>
               <SheetContent side="bottom" className="rounded-t-3xl p-0">
                 <SheetTitle className="sr-only">Withdraw Funds</SheetTitle>
                <WithdrawSheet />
              </SheetContent>
            </Sheet>

            <Link to="/transactions" className="flex flex-col items-center gap-2">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-primary/10 text-primary">
                <History className="h-5 w-5" />
              </Button>
              <span className="text-xs font-medium">History</span>
            </Link>
          </div>

          <div className="mt-8">
            <TraderTransactions />
          </div>

          <div className="mt-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" />Business Profile</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                   {isEditing ? (
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input id="businessName" value={formData.businessName} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="businessType">Business Type</Label>
                                <Input id="businessType" value={formData.businessType} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button onClick={handleSave} className="w-full">Save Changes</Button>
                            </div>
                        </div>
                    ) : (
                         <div className="space-y-4 text-sm pt-2 grid grid-cols-[120px_1fr] items-center">
                            <p className="font-semibold text-muted-foreground">Business Name</p>
                            <p className="font-medium text-right">{displayData?.businessName || 'Not set'}</p>
                            <p className="font-semibold text-muted-foreground">Business Type</p>
                            <p className="font-medium text-right">{displayData?.businessType || 'Not set'}</p>
                            <p className="font-semibold text-muted-foreground">Phone</p>
                            <p className="font-medium text-right">{displayData?.phoneNumber || 'Not set'}</p>
                            <p className="font-semibold text-muted-foreground">Address</p>
                            <p className="font-medium text-right">{displayData?.address || 'Not set'}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
