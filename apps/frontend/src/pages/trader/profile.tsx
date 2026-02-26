import { useState } from 'react';
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
  FilePenLine,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuthStore, useUserBusiness } from '@/store';
import { Link } from 'react-router';
import { SettingsSheet } from '@/components/modals/settings-sheet';
import { FundSheet } from '@/components/modals/fund-sheet';
import { MakeRepaymentSheet } from '@/components/sheets/make-repayment-sheet';
import { WithdrawSheet } from '@/components/modals/withdraw-sheet';
import { TraderTransactions } from '@/components/transactions';
import { useFetchBusiness } from '@/store/hooks/business';
import { useFetchWallet, useWalletState } from '@/store/hooks/wallet.hook';
import { AddBusinessDetailsSheet } from '@/components/sheets/add-business-details-sheet';


export default function TraderProfilePage() {
    const { user } = useAuthStore();
    const { business } = useUserBusiness()
    const { data } = useWalletState()
    const [isSheetOpen, setIsSheetOpen] = useState(false);


    useFetchBusiness()
    useFetchWallet()
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary-foreground">
      <header className="flex items-center justify-between p-4 pt-8">
        <Button variant="ghost" size="icon" className="bg-white/10 rounded-xl" asChild>
          <Link to="/trader/dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
          <Avatar>
            <AvatarImage
              src={user?.image || "https://picsum.photos/seed/301/200/200"}
              alt="Trader"
              data-ai-hint="profile picture"
            />
            <AvatarFallback>{business?.name?.charAt(0) || user?.first_name?.charAt(0) || 'T'}</AvatarFallback>
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
        <p className="text-lg font-semibold">{business?.name || `${user?.first_name} ${user?.last_name}`}</p>
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
            {isBalanceVisible ? `₦${(data.available_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '∗∗∗∗∗∗∗∗∗∗'}
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
                <MakeRepaymentSheet upcomingRepayment={{ amount: 5500, dueDate: "Tomorrow" }} walletBalance={data.available_balance || 0} />
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
            {!business ? (
                 <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Card className="bg-card border-dashed border-primary/50 cursor-pointer hover:bg-muted">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                    <FilePenLine className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">Complete Your Profile</h3>
                                <p className="text-sm text-muted-foreground mt-1">Add your business details to get started and apply for funding.</p>
                            </CardContent>
                        </Card>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-3xl p-0">
                        <AddBusinessDetailsSheet 
                           onSuccess={() => setIsSheetOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" />Business Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm grid grid-cols-[120px_1fr] items-center">
                        <p className="font-semibold text-muted-foreground">Business Name</p>
                        <p className="font-medium text-right">{business.name}</p>
                        <p className="font-semibold text-muted-foreground">Business Type</p>
                        <p className="font-medium text-right">{business.type}</p>
                        <p className="font-semibold text-muted-foreground">Phone</p>
                        <p className="font-medium text-right">{business.phone}</p>
                        <p className="font-semibold text-muted-foreground">Address</p>
                        <p className="font-medium text-right">{business.street_address + ', ' + business.city + ', ' + business.state}</p>
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
