'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Smartphone, QrCode, Key, Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';
import { MFADevice } from '@/types';

const mfaVerificationSchema = z.object({
  otp_code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must contain only numbers'),
  device_id: z.string().optional(),
});

type MFAVerificationFormData = z.infer<typeof mfaVerificationSchema>;

interface MFALoginStepProps {
  userEmail: string;
  mfaDevices: MFADevice[];
  onSuccess: () => void;
  onBack: () => void;
}

export function MFALoginStep({ userEmail, mfaDevices, onSuccess, onBack }: MFALoginStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms' | 'backup'>('totp');
  const [smsCodeSent, setSmsCodeSent] = useState(false);
  
  const { verifyMfa, sendSmsMfaCode } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MFAVerificationFormData>({
    resolver: zodResolver(mfaVerificationSchema),
  });

  const totpDevices = mfaDevices.filter(d => d.device_type === 'totp' && d.is_active);
  const smsDevices = mfaDevices.filter(d => d.device_type === 'sms' && d.is_active);
  const hasBackupCodes = mfaDevices.some(d => d.device_type === 'backup' && d.is_active);

  const handleSendSmsCode = async (deviceId: string) => {
    try {
      setIsLoading(true);
      await sendSmsMfaCode(deviceId);
      setSmsCodeSent(true);
      
      toast({
        title: 'SMS code sent',
        description: 'A verification code has been sent to your phone.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      toast({
        title: 'Failed to send SMS',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MFAVerificationFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await verifyMfa(data);
      onSuccess();
      
      toast({
        title: 'Login successful',
        description: 'You have been successfully authenticated.',
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

  return (
    <Card className="w-full max-w-md mx-auto enterprise-shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center text-enterprise-900">
          Two-Factor Authentication
        </CardTitle>
        <CardDescription className="text-center text-enterprise-600">
          Enter your verification code to complete sign in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            {totpDevices.length > 0 && (
              <TabsTrigger value="totp" className="flex items-center space-x-1">
                <QrCode className="h-4 w-4" />
                <span className="hidden sm:inline">App</span>
              </TabsTrigger>
            )}
            {smsDevices.length > 0 && (
              <TabsTrigger value="sms" className="flex items-center space-x-1">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">SMS</span>
              </TabsTrigger>
            )}
            {hasBackupCodes && (
              <TabsTrigger value="backup" className="flex items-center space-x-1">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Backup</span>
              </TabsTrigger>
            )}
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {totpDevices.length > 0 && (
              <TabsContent value="totp" className="space-y-4">
                <div className="text-center space-y-2">
                  <QrCode className="mx-auto h-8 w-8 text-enterprise-600" />
                  <p className="text-sm text-enterprise-600">
                    Open your authenticator app and enter the 6-digit code
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totp_code" className="text-enterprise-700">
                    Verification Code
                  </Label>
                  <Input
                    id="totp_code"
                    placeholder="123456"
                    className="enterprise-focus text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                    {...register('otp_code')}
                    disabled={isLoading}
                  />
                  {errors.otp_code && (
                    <p className="text-sm text-red-600">{errors.otp_code.message}</p>
                  )}
                </div>
              </TabsContent>
            )}

            {smsDevices.length > 0 && (
              <TabsContent value="sms" className="space-y-4">
                <div className="text-center space-y-2">
                  <Smartphone className="mx-auto h-8 w-8 text-enterprise-600" />
                  <p className="text-sm text-enterprise-600">
                    We'll send a verification code to your phone
                  </p>
                </div>

                {!smsCodeSent ? (
                  <div className="space-y-4">
                    {smsDevices.map((device) => (
                      <Button
                        key={device.id}
                        type="button"
                        variant="enterprise-outline"
                        className="w-full"
                        onClick={() => {
                          setValue('device_id', device.id);
                          handleSendSmsCode(device.id);
                        }}
                        disabled={isLoading}
                      >
                        Send code to •••• {device.phone_number.slice(-4)}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="sms_code" className="text-enterprise-700">
                      Verification Code
                    </Label>
                    <Input
                      id="sms_code"
                      placeholder="123456"
                      className="enterprise-focus text-center text-lg tracking-widest font-mono"
                      maxLength={6}
                      {...register('otp_code')}
                      disabled={isLoading}
                    />
                    {errors.otp_code && (
                      <p className="text-sm text-red-600">{errors.otp_code.message}</p>
                    )}
                  </div>
                )}
              </TabsContent>
            )}

            {hasBackupCodes && (
              <TabsContent value="backup" className="space-y-4">
                <div className="text-center space-y-2">
                  <Key className="mx-auto h-8 w-8 text-enterprise-600" />
                  <p className="text-sm text-enterprise-600">
                    Enter one of your backup codes
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup_code" className="text-enterprise-700">
                    Backup Code
                  </Label>
                  <Input
                    id="backup_code"
                    placeholder="Enter backup code"
                    className="enterprise-focus text-center font-mono"
                    {...register('otp_code')}
                    disabled={isLoading}
                  />
                  {errors.otp_code && (
                    <p className="text-sm text-red-600">{errors.otp_code.message}</p>
                  )}
                </div>
              </TabsContent>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                variant="enterprise"
                disabled={isLoading || isSubmitting || (selectedMethod === 'sms' && !smsCodeSent)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Sign In'
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}