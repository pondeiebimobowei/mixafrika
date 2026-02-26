import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Shield, TrendingUp, Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-sm bg-card/90 z-10">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline tracking-tight">Welcome to MixAfrique</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-2">
            Choose your portal to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <RoleCard
            to="/investor/login"
            icon={TrendingUp}
            title="Investor"
            description="Monitor your portfolio and explore markets"
            color="text-grass-green"
          />
          <RoleCard
            to="/trader/login"
            icon={Briefcase}
            title="Trader"
            description="Manage your business and access loans"
            color="text-blue-500"
          />
          <RoleCard
            to="/agent/login"
            icon={Shield}
            title="Field Agent"
            description="Oversee clusters and manage traders"
            color="text-amber-500"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function RoleCard({ to, icon: Icon, title, description, color }: any) {
  return (
    <Link to={to} className="block group">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/10 hover:border-primary/50 transition-all duration-300">
        <div className={`p-3 rounded-lg bg-background border border-border group-hover:border-primary/20 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  )
}
