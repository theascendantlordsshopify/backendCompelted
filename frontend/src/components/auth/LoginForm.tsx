'use client';

import { useState } from 'react';
import { MFALoginStep } from '@/components/mfa/MFALoginStep';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';
import { LoginCredentials } from '@/types/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSSODiscovery?: (domain: string) => void;
  showSSOOption?: boolean;
}

export function LoginForm({ onSSODiscovery, showSSOOption = true }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMfaStep, setShowMfaStep] = useState(false);
  const [mfaUserData, setMfaUserData] = useState<any>(null);
  
  const { login, initiateSso, ssoDiscovery } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember_me: false,
    },
  });

  const emailValue = watch('email');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      try {
        await login(data);
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
          variant: 'success',
        });
      } catch (loginError: any) {
        // Check if MFA is required
        if (loginError.response?.data?.code === 'mfa_required') {
          setMfaUserData({
            email: data.email,
            mfa_devices: loginError.response.data.mfa_devices || []
          });
          setShowMfaStep(true);
          return;
        }
        throw loginError;
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      // Handle specific error cases
      if (err.response?.data?.code === 'password_expired') {
        toast({
          title: 'Password Expired',
          description: 'Your password has expired. Please check your email for reset instructions.',
          variant: 'warning',
        });
      } else if (err.response?.data?.code === 'account_locked') {
        toast({
          title: 'Account Locked',
          description: 'Your account has been temporarily locked due to multiple failed login attempts.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSODiscovery = async () => {
    if (!emailValue || !emailValue.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address to check for SSO options.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSsoLoading(true);
      const domain = emailValue.split('@')[1];
      const response = await ssoDiscovery(domain);
      
      if (response.providers && response.providers.length > 0) {
        onSSODiscovery?.(domain);
        toast({
          title: 'SSO Available',
          description: `Single Sign-On is available for ${domain}`,
          variant: 'info',
        });
      } else {
        toast({
          title: 'No SSO Found',
          description: `No SSO configuration found for ${domain}. Please use email and password.`,
          variant: 'info',
        });
      }
    } catch (err) {
      console.error('SSO discovery error:', err);
      // Don't show error for SSO discovery failure - just continue with normal login
    } finally {
      setSsoLoading(false);
    }
  };

  const handleMfaSuccess = () => {
    setShowMfaStep(false);
    setMfaUserData(null);
    toast({
      title: 'Welcome back!',
      description: 'You have been successfully authenticated.',
      variant: 'success',
    });
  };

  const handleMfaBack = () => {
    setShowMfaStep(false);
    setMfaUserData(null);
    setError(null);
  };

  if (showMfaStep && mfaUserData) {
    return (
      <MFALoginStep
        userEmail={mfaUserData.email}
        mfaDevices={mfaUserData.mfa_devices}
        onSuccess={handleMfaSuccess}
        onBack={handleMfaBack}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center text-enterprise-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-enterprise-600">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-enterprise-700">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="enterprise-focus"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-enterprise-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="enterprise-focus pr-10"
                {...register('password')}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-enterprise-400" />
                ) : (
                  <Eye className="h-4 w-4 text-enterprise-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember_me"
                {...register('remember_me')}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember_me"
                className="text-sm text-enterprise-600 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 enterprise-transition"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="enterprise"
            size="lg"
            disabled={isLoading || isSubmitting}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {showSSOOption && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-enterprise-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-enterprise-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="enterprise-outline"
              size="lg"
              className="w-full"
              onClick={handleSSODiscovery}
              disabled={!emailValue || ssoLoading || isLoading}
            >
              {ssoLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking SSO...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Single Sign-On
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-enterprise-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-primary hover:text-primary/80 font-medium enterprise-transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}