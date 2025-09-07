'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Check, X, Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';

export function EmailVerificationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  
  const searchParams = useSearchParams();
  const { verifyEmail, user, resendVerification } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      handleVerification(token);
    } else {
      setIsLoading(false);
      setError('No verification token provided');
    }
  }, [searchParams]);

  const handleVerification = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await verifyEmail(token);
      
      setIsSuccess(true);
      toast({
        title: 'Email verified!',
        description: 'Your email has been successfully verified.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      toast({
        title: 'Verification failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'No email address found. Please try logging in again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsResending(true);
      await resendVerification(user.email);
      
      toast({
        title: 'Verification email sent',
        description: 'A new verification email has been sent to your inbox.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      toast({
        title: 'Failed to resend',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-semibold text-enterprise-900">
            Verifying your email
          </CardTitle>
          <CardDescription className="text-enterprise-600">
            Please wait while we verify your email address
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-enterprise-900">
            Email verified!
          </CardTitle>
          <CardDescription className="text-enterprise-600">
            Your email has been successfully verified. You can now access all features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="enterprise" size="lg" className="w-full">
            <Link href="/dashboard">Continue to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <X className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-semibold text-enterprise-900">
          Verification failed
        </CardTitle>
        <CardDescription className="text-enterprise-600">
          We couldn't verify your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            type="button"
            variant="enterprise"
            size="lg"
            className="w-full"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending verification email...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send new verification email
              </>
            )}
          </Button>

          <Button asChild variant="ghost" size="lg" className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}