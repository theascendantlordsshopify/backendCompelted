'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, getFieldErrors } from '@/lib/utils';
import { RegisterData } from '@/types/auth';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required').max(30, 'First name is too long'),
  last_name: z.string().min(1, 'Last name is required').max(30, 'Last name is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  password_confirm: z.string(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const { register: registerUser } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms_accepted: false,
    },
  });

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

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);
      
      await registerUser(data);
      
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      const fieldErrs = getFieldErrors(err);
      
      setError(errorMessage);
      setFieldErrors(fieldErrs);
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center text-enterprise-900">
          Create your account
        </CardTitle>
        <CardDescription className="text-center text-enterprise-600">
          Get started with your enterprise scheduling platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-enterprise-700">
                First name
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
                Last name
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
            <Label htmlFor="email" className="text-enterprise-700">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              className="enterprise-focus"
              {...register('email')}
              disabled={isLoading}
            />
            {(errors.email || fieldErrors.email) && (
              <p className="text-sm text-red-600">
                {errors.email?.message || fieldErrors.email?.[0]}
              </p>
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
              Confirm password
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

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms_accepted"
              {...register('terms_accepted')}
              disabled={isLoading}
              className="mt-1"
            />
            <Label
              htmlFor="terms_accepted"
              className="text-sm text-enterprise-600 cursor-pointer leading-relaxed"
            >
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {(errors.terms_accepted || fieldErrors.terms_accepted) && (
            <p className="text-sm text-red-600">
              {errors.terms_accepted?.message || fieldErrors.terms_accepted?.[0]}
            </p>
          )}

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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-enterprise-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium enterprise-transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}