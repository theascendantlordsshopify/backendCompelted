'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, getFieldErrors } from '@/lib/utils';

const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  new_password_confirm: z.string(),
}).refine(data => data.new_password === data.new_password_confirm, {
  message: "New passwords don't match",
  path: ['new_password_confirm'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const { changePassword } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPasswordValue = watch('new_password');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = newPasswordValue ? getPasswordStrength(newPasswordValue) : 0;

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);
      
      await changePassword(data);
      
      reset();
      toast({
        title: 'Password changed',
        description: 'Your password has been successfully updated.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      const fieldErrs = getFieldErrors(err);
      
      setError(errorMessage);
      setFieldErrors(fieldErrs);
      
      toast({
        title: 'Password change failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-enterprise-900">
          <Shield className="mr-2 h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription className="text-enterprise-600">
          Update your password to keep your account secure
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
            <Label htmlFor="old_password" className="text-enterprise-700">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="old_password"
                type={showOldPassword ? 'text' : 'password'}
                placeholder="Enter your current password"
                className="enterprise-focus pr-10"
                {...register('old_password')}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowOldPassword(!showOldPassword)}
                disabled={isLoading}
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4 text-enterprise-400" />
                ) : (
                  <Eye className="h-4 w-4 text-enterprise-400" />
                )}
              </button>
            </div>
            {(errors.old_password || fieldErrors.old_password) && (
              <p className="text-sm text-red-600">
                {errors.old_password?.message || fieldErrors.old_password?.[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-enterprise-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                className="enterprise-focus pr-10"
                {...register('new_password')}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-enterprise-400" />
                ) : (
                  <Eye className="h-4 w-4 text-enterprise-400" />
                )}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {newPasswordValue && (
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
              Confirm New Password
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => reset()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="enterprise"
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing password...
                </>
              ) : (
                'Change password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}