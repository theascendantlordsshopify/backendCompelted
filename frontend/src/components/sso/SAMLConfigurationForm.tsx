'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building2, Save, TestTube } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, getFieldErrors } from '@/lib/utils';

const samlConfigSchema = z.object({
  organization_name: z.string().min(1, 'Organization name is required'),
  organization_domain: z.string().min(1, 'Organization domain is required'),
  entity_id: z.string().url('Entity ID must be a valid URL'),
  sso_url: z.string().url('SSO URL must be a valid URL'),
  slo_url: z.string().url('SLO URL must be a valid URL').optional().or(z.literal('')),
  x509_cert: z.string().min(1, 'X.509 certificate is required'),
  email_attribute: z.string().min(1, 'Email attribute is required'),
  first_name_attribute: z.string().min(1, 'First name attribute is required'),
  last_name_attribute: z.string().min(1, 'Last name attribute is required'),
  role_attribute: z.string().optional(),
  is_active: z.boolean(),
  auto_provision_users: z.boolean(),
  default_role: z.string().optional(),
});

type SAMLConfigFormData = z.infer<typeof samlConfigSchema>;

interface SAMLConfigurationFormProps {
  config?: any; // SAMLConfiguration for editing
  roles?: Array<{ id: string; name: string }>;
  onSave?: (data: SAMLConfigFormData) => void;
  onCancel?: () => void;
  onTest?: (data: SAMLConfigFormData) => void;
}

export function SAMLConfigurationForm({ 
  config, 
  roles = [], 
  onSave, 
  onCancel, 
  onTest 
}: SAMLConfigurationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SAMLConfigFormData>({
    resolver: zodResolver(samlConfigSchema),
    defaultValues: {
      organization_name: config?.organization_name || '',
      organization_domain: config?.organization_domain || '',
      entity_id: config?.entity_id || '',
      sso_url: config?.sso_url || '',
      slo_url: config?.slo_url || '',
      x509_cert: config?.x509_cert || '',
      email_attribute: config?.email_attribute || 'email',
      first_name_attribute: config?.first_name_attribute || 'first_name',
      last_name_attribute: config?.last_name_attribute || 'last_name',
      role_attribute: config?.role_attribute || '',
      is_active: config?.is_active ?? true,
      auto_provision_users: config?.auto_provision_users ?? true,
      default_role: config?.default_role || '',
    },
  });

  const onSubmit = async (data: SAMLConfigFormData) => {
    try {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);
      
      await onSave?.(data);
      
      toast({
        title: config ? 'SAML configuration updated' : 'SAML configuration created',
        description: 'The SAML configuration has been successfully saved.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      const fieldErrs = getFieldErrors(err);
      
      setError(errorMessage);
      setFieldErrors(fieldErrs);
      
      toast({
        title: 'Save failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setIsTesting(true);
      const formData = watch();
      await onTest?.(formData);
      
      toast({
        title: 'Test initiated',
        description: 'SAML configuration test has been started.',
        variant: 'info',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      toast({
        title: 'Test failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-enterprise-900">
          <Building2 className="mr-2 h-5 w-5" />
          {config ? 'Edit SAML Configuration' : 'Create SAML Configuration'}
        </CardTitle>
        <CardDescription className="text-enterprise-600">
          Configure SAML Single Sign-On for your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Organization Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-enterprise-900">Organization Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization_name" className="text-enterprise-700">
                  Organization Name *
                </Label>
                <Input
                  id="organization_name"
                  placeholder="Acme Corporation"
                  className="enterprise-focus"
                  {...register('organization_name')}
                  disabled={isLoading}
                />
                {(errors.organization_name || fieldErrors.organization_name) && (
                  <p className="text-sm text-red-600">
                    {errors.organization_name?.message || fieldErrors.organization_name?.[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization_domain" className="text-enterprise-700">
                  Organization Domain *
                </Label>
                <Input
                  id="organization_domain"
                  placeholder="acme.com"
                  className="enterprise-focus"
                  {...register('organization_domain')}
                  disabled={isLoading}
                />
                {(errors.organization_domain || fieldErrors.organization_domain) && (
                  <p className="text-sm text-red-600">
                    {errors.organization_domain?.message || fieldErrors.organization_domain?.[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SAML Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-enterprise-900">SAML Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entity_id" className="text-enterprise-700">
                  Entity ID (Identity Provider) *
                </Label>
                <Input
                  id="entity_id"
                  placeholder="https://idp.acme.com/saml/metadata"
                  className="enterprise-focus"
                  {...register('entity_id')}
                  disabled={isLoading}
                />
                {(errors.entity_id || fieldErrors.entity_id) && (
                  <p className="text-sm text-red-600">
                    {errors.entity_id?.message || fieldErrors.entity_id?.[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sso_url" className="text-enterprise-700">
                    SSO URL *
                  </Label>
                  <Input
                    id="sso_url"
                    placeholder="https://idp.acme.com/saml/sso"
                    className="enterprise-focus"
                    {...register('sso_url')}
                    disabled={isLoading}
                  />
                  {(errors.sso_url || fieldErrors.sso_url) && (
                    <p className="text-sm text-red-600">
                      {errors.sso_url?.message || fieldErrors.sso_url?.[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slo_url" className="text-enterprise-700">
                    SLO URL (Optional)
                  </Label>
                  <Input
                    id="slo_url"
                    placeholder="https://idp.acme.com/saml/slo"
                    className="enterprise-focus"
                    {...register('slo_url')}
                    disabled={isLoading}
                  />
                  {(errors.slo_url || fieldErrors.slo_url) && (
                    <p className="text-sm text-red-600">
                      {errors.slo_url?.message || fieldErrors.slo_url?.[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="x509_cert" className="text-enterprise-700">
                  X.509 Certificate *
                </Label>
                <Textarea
                  id="x509_cert"
                  placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                  className="enterprise-focus font-mono text-sm"
                  rows={6}
                  {...register('x509_cert')}
                  disabled={isLoading}
                />
                {(errors.x509_cert || fieldErrors.x509_cert) && (
                  <p className="text-sm text-red-600">
                    {errors.x509_cert?.message || fieldErrors.x509_cert?.[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Attribute Mapping */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-enterprise-900">Attribute Mapping</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email_attribute" className="text-enterprise-700">
                  Email Attribute *
                </Label>
                <Input
                  id="email_attribute"
                  placeholder="email"
                  className="enterprise-focus"
                  {...register('email_attribute')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name_attribute" className="text-enterprise-700">
                  First Name Attribute *
                </Label>
                <Input
                  id="first_name_attribute"
                  placeholder="first_name"
                  className="enterprise-focus"
                  {...register('first_name_attribute')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name_attribute" className="text-enterprise-700">
                  Last Name Attribute *
                </Label>
                <Input
                  id="last_name_attribute"
                  placeholder="last_name"
                  className="enterprise-focus"
                  {...register('last_name_attribute')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role_attribute" className="text-enterprise-700">
                  Role Attribute (Optional)
                </Label>
                <Input
                  id="role_attribute"
                  placeholder="role"
                  className="enterprise-focus"
                  {...register('role_attribute')}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-enterprise-900">Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-enterprise-700">Active Configuration</Label>
                  <p className="text-sm text-enterprise-600">
                    Enable this SAML configuration for user authentication
                  </p>
                </div>
                <Switch
                  checked={watch('is_active')}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-enterprise-700">Auto-Provision Users</Label>
                  <p className="text-sm text-enterprise-600">
                    Automatically create user accounts for new SAML users
                  </p>
                </div>
                <Switch
                  checked={watch('auto_provision_users')}
                  onCheckedChange={(checked) => setValue('auto_provision_users', checked)}
                  disabled={isLoading}
                />
              </div>

              {watch('auto_provision_users') && (
                <div className="space-y-2">
                  <Label htmlFor="default_role" className="text-enterprise-700">
                    Default Role for New Users
                  </Label>
                  <Select
                    value={watch('default_role')}
                    onValueChange={(value) => setValue('default_role', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="enterprise-focus">
                      <SelectValue placeholder="Select default role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isLoading}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="enterprise-outline"
                disabled={isLoading || isTesting}
                onClick={handleTest}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test Config
                  </>
                )}
              </Button>
            </div>
            <Button
              type="submit"
              variant="enterprise"
              disabled={isLoading || !isDirty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {config ? 'Update' : 'Create'} Configuration
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}