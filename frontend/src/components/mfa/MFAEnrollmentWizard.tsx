'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Smartphone, 
  QrCode, 
  Key, 
  Loader2, 
  Check, 
  Copy,
  ArrowLeft,
  ArrowRight 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils';
import { MFASetup, TOTPSetupResponse, BackupCodesResponse } from '@/types/auth';

const mfaSetupSchema = z.object({
  device_type: z.enum(['totp', 'sms']),
  device_name: z.string().min(1, 'Device name is required'),
  phone_number: z.string().optional(),
});

const verificationSchema = z.object({
  otp_code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must contain only numbers'),
});

type MFASetupFormData = z.infer<typeof mfaSetupSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;

type SetupStep = 'device-selection' | 'totp-setup' | 'sms-setup' | 'verification' | 'backup-codes' | 'complete';

interface MFAEnrollmentWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function MFAEnrollmentWizard({ onComplete, onCancel }: MFAEnrollmentWizardProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>('device-selection');
  const [setupData, setSetupData] = useState<MFASetupFormData | null>(null);
  const [totpData, setTotpData] = useState<TOTPSetupResponse | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setupMfa, verifyMfa } = useAuth();
  const { toast } = useToast();

  const setupForm = useForm<MFASetupFormData>({
    resolver: zodResolver(mfaSetupSchema),
    defaultValues: {
      device_type: 'totp',
      device_name: 'Authenticator App',
    },
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const handleDeviceSelection = async (data: MFASetupFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      setSetupData(data);

      const response = await setupMfa(data);

      if (data.device_type === 'totp') {
        setTotpData(response as TOTPSetupResponse);
        setCurrentStep('totp-setup');
      } else {
        setCurrentStep('sms-setup');
      }

      toast({
        title: 'MFA setup initiated',
        description: `${data.device_type === 'totp' ? 'TOTP' : 'SMS'} setup started`,
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      toast({
        title: 'Setup failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (data: VerificationFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await verifyMfa(data);
      
      if (response.backup_codes) {
        setBackupCodes(response.backup_codes);
        setCurrentStep('backup-codes');
      } else {
        setCurrentStep('complete');
      }

      toast({
        title: 'MFA enabled',
        description: 'Multi-factor authentication has been successfully enabled.',
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

  const copyBackupCodes = async () => {
    const codesText = backupCodes.join('\n');
    const success = await copyToClipboard(codesText);
    
    if (success) {
      toast({
        title: 'Copied to clipboard',
        description: 'Backup codes have been copied to your clipboard.',
        variant: 'success',
      });
    }
  };

  const renderDeviceSelection = () => (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="text-enterprise-900">Choose MFA Method</CardTitle>
        <CardDescription className="text-enterprise-600">
          Select how you'd like to receive your second factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={setupForm.handleSubmit(handleDeviceSelection)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer enterprise-transition ${
                  setupForm.watch('device_type') === 'totp'
                    ? 'border-primary bg-primary/5'
                    : 'border-enterprise-200 hover:border-enterprise-300'
                }`}
                onClick={() => setupForm.setValue('device_type', 'totp')}
              >
                <div className="flex items-center space-x-3">
                  <QrCode className="h-8 w-8 text-enterprise-600" />
                  <div>
                    <h3 className="font-medium text-enterprise-900">Authenticator App</h3>
                    <p className="text-sm text-enterprise-600">
                      Use Google Authenticator, Authy, or similar
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer enterprise-transition ${
                  setupForm.watch('device_type') === 'sms'
                    ? 'border-primary bg-primary/5'
                    : 'border-enterprise-200 hover:border-enterprise-300'
                }`}
                onClick={() => setupForm.setValue('device_type', 'sms')}
              >
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-8 w-8 text-enterprise-600" />
                  <div>
                    <h3 className="font-medium text-enterprise-900">SMS</h3>
                    <p className="text-sm text-enterprise-600">
                      Receive codes via text message
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device_name" className="text-enterprise-700">
              Device Name
            </Label>
            <Input
              id="device_name"
              placeholder="e.g., My iPhone, Work Phone"
              className="enterprise-focus"
              {...setupForm.register('device_name')}
              disabled={isLoading}
            />
            {setupForm.formState.errors.device_name && (
              <p className="text-sm text-red-600">
                {setupForm.formState.errors.device_name.message}
              </p>
            )}
          </div>

          {setupForm.watch('device_type') === 'sms' && (
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-enterprise-700">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="enterprise-focus"
                {...setupForm.register('phone_number')}
                disabled={isLoading}
              />
              {setupForm.formState.errors.phone_number && (
                <p className="text-sm text-red-600">
                  {setupForm.formState.errors.phone_number.message}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="enterprise"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderTOTPSetup = () => (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="text-enterprise-900">Set up Authenticator App</CardTitle>
        <CardDescription className="text-enterprise-600">
          Scan the QR code with your authenticator app or enter the key manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {totpData && (
          <div className="space-y-6">
            {/* QR Code */}
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-white rounded-lg border">
                <img
                  src={totpData.qr_code}
                  alt="QR Code for TOTP setup"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-enterprise-600">
                Scan this QR code with your authenticator app
              </p>
            </div>

            {/* Manual Entry */}
            <div className="space-y-2">
              <Label className="text-enterprise-700">Manual Entry Key</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={totpData.manual_entry_key}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="enterprise-outline"
                  size="sm"
                  onClick={() => copyToClipboard(totpData.manual_entry_key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-enterprise-500">
                Enter this key manually if you can't scan the QR code
              </p>
            </div>

            <Alert>
              <AlertDescription>
                After adding the account to your authenticator app, enter the 6-digit code below to complete setup.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCurrentStep('device-selection')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            variant="enterprise"
            onClick={() => setCurrentStep('verification')}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSMSSetup = () => (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="text-enterprise-900">SMS Verification</CardTitle>
        <CardDescription className="text-enterprise-600">
          We've sent a verification code to your phone number
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            A 6-digit verification code has been sent to {setupData?.phone_number}. 
            Enter the code below to complete setup.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCurrentStep('device-selection')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            variant="enterprise"
            onClick={() => setCurrentStep('verification')}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderVerification = () => (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="text-enterprise-900">Enter Verification Code</CardTitle>
        <CardDescription className="text-enterprise-600">
          Enter the 6-digit code from your {setupData?.device_type === 'totp' ? 'authenticator app' : 'phone'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={verificationForm.handleSubmit(handleVerification)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp_code" className="text-enterprise-700">
              Verification Code
            </Label>
            <Input
              id="otp_code"
              placeholder="123456"
              className="enterprise-focus text-center text-lg tracking-widest font-mono"
              maxLength={6}
              {...verificationForm.register('otp_code')}
              disabled={isLoading}
            />
            {verificationForm.formState.errors.otp_code && (
              <p className="text-sm text-red-600">
                {verificationForm.formState.errors.otp_code.message}
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCurrentStep(setupData?.device_type === 'totp' ? 'totp-setup' : 'sms-setup')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              variant="enterprise"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Enable MFA'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderBackupCodes = () => (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="text-enterprise-900">Save Your Backup Codes</CardTitle>
        <CardDescription className="text-enterprise-600">
          Store these backup codes in a safe place. You can use them to access your account if you lose your device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            <strong>Important:</strong> These codes can only be used once each. 
            Store them securely and don't share them with anyone.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-4 bg-enterprise-50 rounded-lg border">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="font-mono text-sm text-center py-2 px-3 bg-white rounded border"
              >
                {code}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="enterprise-outline"
            className="w-full"
            onClick={copyBackupCodes}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy All Codes
          </Button>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="enterprise"
            onClick={() => setCurrentStep('complete')}
          >
            I've Saved My Codes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderComplete = () => (
    <Card className="enterprise-shadow">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-enterprise-900">MFA Setup Complete</CardTitle>
        <CardDescription className="text-enterprise-600">
          Your account is now protected with multi-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                {setupData?.device_type === 'totp' ? (
                  <QrCode className="h-4 w-4 text-green-600" />
                ) : (
                  <Smartphone className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-green-900">{setupData?.device_name}</p>
                <p className="text-sm text-green-700">
                  {setupData?.device_type === 'totp' ? 'Authenticator App' : 'SMS Authentication'}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            Remember to keep your backup codes safe and accessible. 
            You can regenerate them anytime from your security settings.
          </AlertDescription>
        </Alert>

        <Button
          type="button"
          variant="enterprise"
          className="w-full"
          onClick={onComplete}
        >
          Complete Setup
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-md mx-auto">
      {currentStep === 'device-selection' && renderDeviceSelection()}
      {currentStep === 'totp-setup' && renderTOTPSetup()}
      {currentStep === 'sms-setup' && renderSMSSetup()}
      {currentStep === 'verification' && renderVerification()}
      {currentStep === 'backup-codes' && renderBackupCodes()}
      {currentStep === 'complete' && renderComplete()}
    </div>
  );
}