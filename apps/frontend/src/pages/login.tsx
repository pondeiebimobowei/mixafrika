import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp } from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">Welcome Back</CardTitle>
          <CardDescription>Please select your role to sign in.</CardDescription>
        </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/investor/login" className="block">
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    <TrendingUp className="mb-3 h-6 w-6" />
                    I am an Investor
                </div>
            </Link>
            <Link to="/trader/login" className="block">
                 <div className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    <Briefcase className="mb-3 h-6 w-6" />
                    I am a Trader
                </div>
            </Link>
          </CardContent>
      </Card>
    </div>
  );
}
