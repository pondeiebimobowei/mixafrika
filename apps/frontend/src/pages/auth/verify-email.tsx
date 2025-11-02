
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import { Link } from 'react-router';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <MailCheck className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold font-headline">Check Your Email</CardTitle>
          <CardDescription>We've sent a verification link to your email address. Please click the link to verify your account.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or you can resend the email.
            </p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button variant="outline" className="w-full">Resend Verification Email</Button>
            <Link to="/login" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                Back to Login
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
