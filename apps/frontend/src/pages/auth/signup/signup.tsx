
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Briefcase, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'investor' | 'trader' | 'agent' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuthStore(state => ({ login: state.login, user: state.user }));
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
        if(user.role === 'investor') navigate('/investor/dashboard');
        else if (user.role === 'trader') navigate('/trader/dashboard');
        else if (user.role === 'agent') navigate('/agent/dashboard');
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast('Please select your role.');
      return;
    }
    setIsLoading(true);

    // Simulate API call for signup
    setTimeout(() => {
        login(email, role);
        setIsLoading(false);
        toast.success("Welcome to ClustrTrade!");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">Create an Account</CardTitle>
          <CardDescription>Join our community of investors, traders, and agents.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
             <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup value={role || ''} onValueChange={(value) => setRole(value as 'investor' | 'trader' | 'agent')} className="grid grid-cols-3 gap-2">
                <div>
                  <RadioGroupItem value="investor" id="investor" className="sr-only" />
                  <Label htmlFor="investor" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer h-full", role === 'investor' && "border-primary")}>
                    <TrendingUp className="mb-2 h-5 w-5" />
                    <span className="text-sm">Investor</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="trader" id="trader" className="sr-only" />
                  <Label htmlFor="trader" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer h-full", role === 'trader' && "border-primary")}>
                    <Briefcase className="mb-2 h-5 w-5" />
                    <span className="text-sm">Trader</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="agent" id="agent" className="sr-only" />
                  <Label htmlFor="agent" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer h-full", role === 'agent' && "border-primary")}>
                    <Shield className="mb-2 h-5 w-5" />
                    <span className="text-sm">Agent</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading || !role}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
