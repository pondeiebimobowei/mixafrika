import { Button } from '@/components/ui/button';
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Shield, User, LogOut, ChevronRight, Mail, MessageCircle, X, Repeat } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useTheme } from '@/context/theme-context';
import { useNavigate } from 'react-router';

const SettingsItem = ({ icon: Icon, title, description, action: Action, href, onClick }: { icon: React.ElementType, title: string, description?: string, action?: React.ReactNode, href?: string, onClick?: () => void }) => {
    const content = (
        <div className="flex items-center justify-between p-2 rounded-lg border">
            <div className="flex items-center gap-3">
                <div className='flex items-center justify-center h-9 w-9 rounded-full bg-primary/10'>
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="font-semibold text-sm">{title}</p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>
            {Action}
        </div>
    );

    const Wrapper = href ? 'a' : 'div';
    const props = href ? { href } : { onClick, className: onClick ? 'cursor-pointer' : '' };

    return <Wrapper {...props}>{content}</Wrapper>;
}

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <SettingsItem 
            icon={theme === 'dark' ? Moon : Sun}
            title="Dark Mode"
            description="Toggle light and dark theme"
            action={
                <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    aria-label="Toggle dark mode"
                />
            }
        />
    )
}

export function SettingsSheet() {
  const { user, logout, login } = useAuthStore();
  const navigate = useNavigate();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = async () => {
    if (!user) return;
    setIsSwitchingRole(true);
    const newRole = user.role === 'investor' ? 'trader' : 'investor';
    
    // Simulate logging in with the new role
    login(user.email, newRole);
    
    if (newRole === 'investor') {
        navigate('/investor-dashboard');
    } else {
        navigate('/trader-dashboard');
    }
    
    setIsSwitchingRole(false);
  };
  
  return (
    <div className="bg-card text-foreground rounded-t-3xl">
      <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold">Settings</SheetTitle>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                </Button>
            </SheetClose>
          </div>
      </SheetHeader>
      <div className="px-4 py-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Appearance</h3>
          <DarkModeToggle />
        </div>

        <Separator />
        
        {user?.role && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Account Actions</h3>
                <SettingsItem 
                    icon={Repeat}
                    title={`Switch to ${user.role === 'investor' ? 'Trader' : 'Investor'} View`}
                    onClick={handleSwitchRole}
                    action={
                        <Button variant="secondary" size="sm" onClick={handleSwitchRole} disabled={isSwitchingRole} className="border border-primary">
                            {isSwitchingRole ? 'Switching...' : 'Switch'}
                        </Button>
                    }
                />
            </div>
            <Separator />
          </>
        )}


        <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Notifications</h3>
            <div className="space-y-2">
                 <SettingsItem 
                    icon={Mail}
                    title="Email Notifications"
                    action={<Switch defaultChecked />}
                />
                <SettingsItem 
                    icon={MessageCircle}
                    title="Push Notifications"
                    action={<Switch />}
                />
            </div>
        </div>

        <Separator />
        
        <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Security & Account</h3>
            <div className="space-y-2">
                <SettingsItem 
                    icon={User}
                    title="Edit Profile"
                    action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
                />
                <SettingsItem 
                    icon={Shield}
                    title="Change Password"
                    action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
                />
            </div>
        </div>

        <Separator />

        <div className="p-2">
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
        </Button>
        </div>

      </div>
    </div>
  );
}
