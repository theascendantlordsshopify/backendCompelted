'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X, Loader2, Mail, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, getFieldErrors } from '@/lib/utils';
import { InvitationResponse } from '@/types/auth';

const invitationResponseSchema = z.object({
  token: z.string().min(1, 'Invalid invitation token'),
  action: z.enum(['accept', 'decline']),
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  password_confirm: z.string().optional(),
}).refine(data => {
  if (data.action === 'accept' && data.password) {
    return data.password === data.password_confirm;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

type InvitationResponseFormData = z.infer<typeof invitationResponseSchema>;

interface InvitationData {
  invited_email: string;
  role_name: string;
  invited_by_name: string;
  message: string;
  expires_at: string;
  organization?: string;
}

interface InvitationResponseFormProps {
  invitationData?: InvitationData;
  onSuccess?: () => void;
}

export function InvitationResponseForm({ invitationData, onSuccess }: InvitationResponseFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [needsRegistration, setNeedsRegistration] = useState(false);
  
  const searchParams = useSearchParams();
  const { respondToInvitation } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvitationResponseFormData>({
    resolver: zodResolver(invitationResponseSchema),
    defaultValues: {
      action: 'accept',
    },
  });

  // Set token from URL params
  React.useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setValue('token', token);
    }
  }, [searchParams, setValue]);

  const selectedAction = watch('action');
  const passwordValue = watch('password');

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

  const onSubmit = async (data: InvitationResponseFormData) => {
    try {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);

      if (data.action === 'decline') {
        await respondToInvitation(data);
        setIsDeclined(true);
        toast({
          title: 'Invitation declined',
          description: 'You have declined the team invitation.',
          variant: 'info',
        });
        return;
      }

      // Handle acceptance
      const response = await respondToInvitation(data);
      
      setIsSuccess(true);
      toast({
        title: 'Welcome to the team!',
        description: 'You have successfully joined the organization.',
        variant: 'success',
      });

      onSuccess?.();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      const fieldErrs = getFieldErrors(err);
      
      // Check if user needs to register
      if (err.response?.data?.code === 'user_not_found') {
        setNeedsRegistration(true);
        return;
      }
      
      setError(errorMessage);
      setFieldErrors(fieldErrs);
      
      toast({
        title: 'Response failed',
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
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-enterprise-900">
            Welcome to the team!
          </CardTitle>
          <CardDescription className="text-enterprise-600">
            You have successfully joined {invitationData?.organization || 'the organization'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="enterprise" size="lg" className="w-full" onClick={onSuccess}>
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isDeclined) {
    return (
      <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <X className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-enterprise-900">
            Invitation Declined
          </CardTitle>
          <CardDescription className="text-enterprise-600">
            You have declined the invitation to join the team
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto enterprise-shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-enterprise-900">Team Invitation</CardTitle>
            <CardDescription className="text-enterprise-600">
              You've been invited to join a team
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invitation Details */}
        {invitationData && (
          <div className="p-4 bg-enterprise-50 rounded-lg border border-enterprise-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-enterprise-700">Email:</span>
                <span className="text-sm text-enterprise-900">{invitationData.invited_email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-enterprise-700">Role:</span>
                <Badge variant="outline" className="text-enterprise-700">
                  {invitationData.role_name}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-enterprise-700">Invited by:</span>
                <span className="text-sm text-enterprise-900">{invitationData.invited_by_name}</span>
              </div>
              {invitationData.message && (
                <div className="pt-2 border-t border-enterprise-200">
                  <p className="text-sm text-enterprise-600 italic">
                    "{invitationData.message}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hidden token field */}
          <input type="hidden" {...register('token')} />

          {/* Action Selection */}
          <div className="space-y-4">
            <Label className="text-enterprise-700">Your Response</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer enterprise-transition ${
                  selectedAction === 'accept'
                    ? 'border-green-500 bg-green-50'
                    : 'border-enterprise-200 hover:border-enterprise-300'
                }`}
                onClick={() => setValue('action', 'accept')}
              >
                <div className="text-center">
                  <Check className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="font-medium text-enterprise-900">Accept</p>
                  <p className="text-xs text-enterprise-600">Join the team</p>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer enterprise-transition ${
                  selectedAction === 'decline'
                    ? 'border-red-500 bg-red-50'
                    : 'border-enterprise-200 hover:border-enterprise-300'
                }`}
                onClick={() => setValue('action', 'decline')}
              >
                <div className="text-center">
                  <X className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <p className="font-medium text-enterprise-900">Decline</p>
                  <p className="text-xs text-enterprise-600">No thanks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Fields (if accepting and user doesn't exist) */}
          {selectedAction === 'accept' && (needsRegistration || !invitationData) && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <UserPlus className="h-5 w-5 text-primary" />
                <Label className="text-enterprise-700 font-medium">
                  Complete Your Registration
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-enterprise-700">
                    First Name *
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="John"
                    className="enterprise-focus"
                    {...register('first_name')}
                    disabled={isLoading}
                  />
                  {(errors.first_name || fieldErrors.first_name) && (
                    <p className="text-sm text-red-600">
                      {errors.first_name?.message || fieldErrors.first_name?.[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-enterprise-700">
                    Last Name *
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Doe"
                    className="enterprise-focus"
                    {...register('last_name')}
                    disabled={isLoading}
                  />
                  {(errors.last_name || fieldErrors.last_name) && (
                    <p className="text-sm text-red-600">
                      {errors.last_name?.message || fieldErrors.last_name?.[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-enterprise-700">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                
                {(errors.password || fieldErrors.password) && (
                  <p className="text-sm text-red-600">
                    {errors.password?.message || fieldErrors.password?.[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm" className="text-enterprise-700">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="enterprise-focus pr-10"
                    {...register('password_confirm')}
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
                {(errors.password_confirm || fieldErrors.password_confirm) && (
                  <p className="text-sm text-red-600">
                    {errors.password_confirm?.message || fieldErrors.password_confirm?.[0]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col space-y-3">
            {selectedAction === 'accept' ? (
              <Button
                type="submit"
                variant="enterprise"
                size="lg"
                className="w-full"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {needsRegistration ? 'Creating account...' : 'Accepting invitation...'}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {needsRegistration ? 'Create Account & Join' : 'Accept Invitation'}
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="destructive"
                size="lg"
                className="w-full"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Declining invitation...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Decline Invitation
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Invitation Expiry Warning */}
        {invitationData?.expires_at && (
          <Alert>
            <AlertDescription>
              This invitation expires on {new Date(invitationData.expires_at).toLocaleDateString()}.
              Please respond before it expires.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}