'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, AlertTriangle, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';

const disableMfaSchema = z.object({
  password: z.string().min(1, 'Password is required to disable MFA'),
});

type DisableMFAFormData = z.infer<typeof disableMfaSchema>;

interface DisableMFAFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DisableMFAForm({ onSuccess, onCancel }: DisableMFAFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { disableMfa } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DisableMFAFormData>({
    resolver: zodResolver(disableMfaSchema),
  });

  const onSubmit = async (data: DisableMFAFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await disableMfa(data);
      
      toast({
        title: 'MFA disabled',
        description: 'Multi-factor authentication has been disabled for your account.',
        variant: 'success',
      });

      onSuccess?.();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      toast({
        title: 'Failed to disable MFA',
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
        <CardTitle className="flex items-center text-red-700">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Disable Multi-Factor Authentication
        </CardTitle>
        <CardDescription className="text-enterprise-600">
          This will remove all MFA protection from your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Disabling MFA will make your account less secure. 
            You'll only need your password to sign in.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-enterprise-700">
              Confirm Your Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your current password"
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling MFA...
                </>
              ) : (
                'Disable MFA'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}