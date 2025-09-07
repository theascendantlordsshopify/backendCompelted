'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Key, Copy, Download, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, copyToClipboard } from '@/lib/utils';

const regenerateBackupCodesSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type RegenerateBackupCodesFormData = z.infer<typeof regenerateBackupCodesSchema>;

interface RegenerateBackupCodesFormProps {
  onSuccess?: (codes: string[]) => void;
  onCancel?: () => void;
}

export function RegenerateBackupCodesForm({ onSuccess, onCancel }: RegenerateBackupCodesFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showCodes, setShowCodes] = useState(false);
  
  const { regenerateBackupCodes } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegenerateBackupCodesFormData>({
    resolver: zodResolver(regenerateBackupCodesSchema),
  });

  const onSubmit = async (data: RegenerateBackupCodesFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await regenerateBackupCodes(data);
      setBackupCodes(response.backup_codes);
      setShowCodes(true);
      
      toast({
        title: 'Backup codes regenerated',
        description: 'New backup codes have been generated. Please save them securely.',
        variant: 'success',
      });

      onSuccess?.(response.backup_codes);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      toast({
        title: 'Failed to regenerate codes',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyAllCodes = async () => {
    const codesText = backupCodes.join('\n');
    const success = await copyToClipboard(codesText);
    
    if (success) {
      toast({
        title: 'Copied to clipboard',
        description: 'All backup codes have been copied to your clipboard.',
        variant: 'success',
      });
    }
  };

  const downloadCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Codes downloaded',
      description: 'Backup codes have been downloaded as a text file.',
      variant: 'success',
    });
  };

  if (showCodes) {
    return (
      <Card className="enterprise-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-enterprise-900">
            <Key className="mr-2 h-5 w-5" />
            New Backup Codes Generated
          </CardTitle>
          <CardDescription className="text-enterprise-600">
            Save these codes in a secure location. Each code can only be used once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Your old backup codes are no longer valid. 
              Make sure to save these new codes before closing this window.
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

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="enterprise-outline"
                className="flex-1"
                onClick={copyAllCodes}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
              <Button
                type="button"
                variant="enterprise-outline"
                className="flex-1"
                onClick={downloadCodes}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="enterprise"
              onClick={() => {
                setShowCodes(false);
                onCancel?.();
              }}
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-enterprise-900">
          <Key className="mr-2 h-5 w-5" />
          Regenerate Backup Codes
        </CardTitle>
        <CardDescription className="text-enterprise-600">
          Generate new backup codes for account recovery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Regenerating backup codes will invalidate all existing codes. 
            Make sure you have access to your primary MFA device.
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
              variant="enterprise"
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                'Regenerate Codes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}