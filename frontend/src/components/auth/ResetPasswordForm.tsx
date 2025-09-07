'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, getFieldErrors } from '@/lib/utils';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  new_password_confirm: z.string(),
}).refine(data => data.new_password === data.new_password_confirm, {
  message: "Passwords don't match",
  path: ['new_password_confirm'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const searchParams = useSearchParams();
  const { confirmPasswordReset } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Set token from URL params
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setValue('token', token);
    }
  }, [searchParams, setValue]);

  const passwordValue = watch('new_password');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = passwordValue ? getPasswordStrength(passwordValue) : 0;

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);
      
      await confirmPasswordReset(data);
      
      setIsSuccess(true);
      toast({
        title: 'Password reset successful',
        description: 'Your password has been reset. You can now sign in with your new password.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      const fieldErrs = getFieldErrors(err);
      
      setError(errorMessage);
      setFieldErrors(fieldErrs);
      
      toast({
        title: 'Reset failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-enterprise-900">
            Password reset successful
          </CardTitle>
          <CardDescription className="text-enterprise-600">
            Your password has been successfully reset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="enterprise" size="lg" className="w-full">
            <Link href="/login">Continue to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center text-enterprise-900">
          Set new password
        </CardTitle>
        <CardDescription className="text-center text-enterprise-600">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden token field */}
          <input type="hidden" {...register('token')} />

          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-enterprise-700">
              New password
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                className="enterprise-focus pr-10"
                {...register('new_password')}
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
            
            {/* Password strength indicator */}
            {passwordValue && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength >= level
                          ? passwordStrength <= 2
                            ? 'bg-red-400'
                            : passwordStrength <= 3
                            ? 'bg-yellow-400'
                            : 'bg-green-400'
                          : 'bg-enterprise-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-enterprise-500">
                  Password strength: {
                    passwordStrength <= 2 ? 'Weak' :
                    passwordStrength <= 3 ? 'Fair' :
                    passwordStrength <= 4 ? 'Good' : 'Strong'
                  }
                </p>
              </div>
            )}
            
            {(errors.new_password || fieldErrors.new_password) && (
              <p className="text-sm text-red-600">
                {errors.new_password?.message || fieldErrors.new_password?.[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password_confirm" className="text-enterprise-700">
              Confirm new password
            </Label>
            <div className="relative">
              <Input
                id="new_password_confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                className="enterprise-focus pr-10"
                {...register('new_password_confirm')}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-enterprise-400" />
                ) : (
                  <Eye className="h-4 w-4 text-enterprise-400" />
                )}
              </button>
            </div>
            {(errors.new_password_confirm || fieldErrors.new_password_confirm) && (
              <p className="text-sm text-red-600">
                {errors.new_password_confirm?.message || fieldErrors.new_password_confirm?.[0]}
              </p>
            )}
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
                Resetting password...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button asChild variant="ghost" className="text-enterprise-600">
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