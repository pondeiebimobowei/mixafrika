import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Investment } from '@/types';
import { Link } from 'react-router';


interface InvestmentsSheetProps {
    activeInvestments: Investment[];
    pastInvestments: Investment[];
}

export function InvestmentsSheet({ activeInvestments, pastInvestments }: InvestmentsSheetProps) {

    return (
        <div className="bg-background text-foreground h-full flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-4 border-b">
                <div className="flex justify-between items-center">
                    <SheetTitle className="text-lg font-bold">My Investments</SheetTitle>
                    <SheetClose asChild>
                        <Button>Done</Button>
                    </SheetClose>
                </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sticky top-0 bg-background rounded-none border-b z-10">
                        <TabsTrigger value="active">Active Cycles</TabsTrigger>
                        <TabsTrigger value="past">Past Cycles</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                         <div className="p-4 space-y-3">
                            {activeInvestments.map((investment) => (
                                <Link to={`/investments/${investment.id}`} key={investment.id} className="block">
                                <Card className="bg-card">
                                    <CardContent className="p-3 space-y-2">
                                        <h3 className="font-semibold text-base">{investment.name}</h3>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-base font-bold text-primary">
                                                    ₦{investment.currentValue?.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    Initial: ₦{investment.amountInvested.toLocaleString()}
                                                </span>
                                            </div>
                                            <Progress value={investment.cycleProgress} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    <span>+{(investment.currentValue! - investment.amountInvested).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{investment.cycleEnds}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                </Link>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="past">
                         <div className="p-4 space-y-3">
                            {pastInvestments.map((investment) => (
                                <Link to={`/investments/${investment.id}`} key={investment.id} className="block">
                                <Card key={investment.id} className="bg-card">
                                    <CardContent className="p-3 flex justify-between items-center">
                                        <div>
                                           <h3 className="font-semibold text-base">{investment.name}</h3>
                                           <p className="text-sm text-muted-foreground">Invested: ₦{investment.amountInvested.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-base text-primary">+₦{investment.return?.toLocaleString()}</p>
                                            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3"/>
                                                <span>{investment.date}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                </Link>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <div className="p-4 bg-background border-t">
                <Button size="lg" className="w-full" asChild>
                    <Link to="/markets">Explore New Clusters</Link>
                </Button>
            </div>
        </div>
    );
}
