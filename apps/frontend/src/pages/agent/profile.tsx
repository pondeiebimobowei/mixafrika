
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Bell, Shield, Mail, Phone, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router';
import { SettingsSheet } from '@/components/modals/settings-sheet';

export default function AgentProfilePage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/agent-dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline mx-auto pr-8">My Profile</h1>
            </header>

            <main className="flex-1 p-4 space-y-6">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                            <AvatarImage src="https://picsum.photos/seed/601/200/200" />
                            <AvatarFallback>{user?.first_name?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold">{user?.first_name}</h2>
                        <p className="text-muted-foreground">{user?.email}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4"/>Email</span>
                            <span className="font-semibold">{user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4"/>Phone</span>
                            <span className="font-semibold">08012345678</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4"/>Region</span>
                            <span className="font-semibold">Lagos Mainland</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Settings & Security</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                         <Sheet>
                            <SheetTrigger asChild>
                                <div className="flex justify-between items-center py-3 cursor-pointer">
                                    <span className="font-medium flex items-center gap-2"><Settings className="h-4 w-4 text-muted-foreground"/> App Settings</span>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                                </div>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-3xl p-0">
                                <SettingsSheet />
                            </SheetContent>
                        </Sheet>
                        <div className="flex justify-between items-center py-3 cursor-pointer">
                            <span className="font-medium flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground"/> Change Password</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                        </div>
                         <div className="flex justify-between items-center py-3 cursor-pointer">
                            <span className="font-medium flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground"/> Notification Settings</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                        </div>
                    </CardContent>
                </Card>
                
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Log Out
                </Button>
            </main>
        </div>
    );
}

