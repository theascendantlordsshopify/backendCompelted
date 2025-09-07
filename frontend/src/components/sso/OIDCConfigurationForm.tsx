'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Globe, Save, TestTube, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, getFieldErrors } from '@/lib/utils';

const oidcConfigSchema = z.object({
  organization_name: z.string().min(1, 'Organization name is required'),
  organization_domain: z.string().min(1, 'Organization domain is required'),
  issuer: z.string().url('Issuer must be a valid URL'),
  client_id: z.string().min(1, 'Client ID is required'),
  client_secret: z.string().min(1, 'Client secret is required'),
  authorization_endpoint: z.string().url('Authorization endpoint must be a valid URL').optional().or(z.literal('')),
  token_endpoint: z.string().url('Token endpoint must be a valid URL').optional().or(z.literal('')),
  userinfo_endpoint: z.string().url('Userinfo endpoint must be a valid URL').optional().or(z.literal('')),
  jwks_uri: z.string().url('JWKS URI must be a valid URL').optional().or(z.literal('')),
  scopes: z.array(z.string()).min(1, 'At least one scope is required'),
  email_claim: z.string().min(1, 'Email claim is required'),
  first_name_claim: z.string().min(1, 'First name claim is required'),
  last_name_claim: z.string().min(1, 'Last name claim is required'),
  role_claim: z.string().optional(),
  is_active: z.boolean(),
  auto_provision_users: z.boolean(),
  default_role: z.string().optional(),
});

type OIDCConfigFormData = z.infer<typeof oidcConfigSchema>;

interface OIDCConfigurationFormProps {
  config?: any; // OIDCConfiguration for editing
  roles?: Array<{ id: string; name: string }>;
  onSave?: (data: OIDCConfigFormData) => void;
  onCancel?: () => void;
  onTest?: (data: OIDCConfigFormData) => void;
}

export function OIDCConfigurationForm({ 
  config, 
  roles = [], 
  onSave, 
  onCancel, 
  onTest 
}: OIDCConfigurationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [customScopes, setCustomScopes] = useState<string[]>(config?.scopes || ['openid', 'email', 'profile']);
  const [newScope, setNewScope] = useState('');
  
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<OIDCConfigFormData>({
    resolver: zodResolver(oidcConfigSchema),
    defaultValues: {
      organization_name: config?.organization_name || '',
      organization_domain: config?.organization_domain || '',
      issuer: config?.issuer || '',
      client_id: config?.client_id || '',
      client_secret: config?.client_secret || '',
      authorization_endpoint: config?.authorization_endpoint || '',
      token_endpoint: config?.token_endpoint || '',
      userinfo_endpoint: config?.userinfo_endpoint || '',
      jwks_uri: config?.jwks_uri || '',
      scopes: config?.scopes || ['openid', 'email', 'profile'],
      email_claim: config?.email_claim || 'email',
      first_name_claim: config?.first_name_claim || 'given_name',
      last_name_claim: config?.last_name_claim || 'family_name',
      role_claim: config?.role_claim || '',
      is_active: config?.is_active ?? true,
      auto_provision_users: config?.auto_provision_users ?? true,
      default_role: config?.default_role || '',
    },
  });

  const addScope = () => {
    if (newScope && !customScopes.includes(newScope)) {
      const updatedScopes = [...customScopes, newScope];
      setCustomScopes(updatedScopes);
      setValue('scopes', updatedScopes);
      setNewScope('');
    }
  };

  const removeScope = (scope: string) => {
    const updatedScopes = customScopes.filter(s => s !== scope);
    setCustomScopes(updatedScopes);
    setValue('scopes', updatedScopes);
  };

  const onSubmit = async (data: OIDCConfigFormData) => {
    try {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);
      
      await onSave?.(data);
      
      toast({
        title: config ? 'OIDC configuration updated' : 'OIDC configuration created',
        description: 'The OIDC configuration has been successfully saved.',
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
        description: 'OIDC configuration test has been started.',
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
          <Globe className="mr-2 h-5 w-5" />
          {config ? 'Edit OIDC Configuration' : 'Create OIDC Configuration'}
        </CardTitle>
        <CardDescription className="text-enterprise-600">
          Configure OpenID Connect for modern enterprise authentication
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

          {/* OIDC Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-enterprise-900">OIDC Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issuer" className="text-enterprise-700">
                  Issuer URL *
                </Label>
                <Input
                  id="issuer"
                  placeholder="https://auth.acme.com"
                  className="enterprise-focus"
                  {...register('issuer')}
                  disabled={isLoading}
                />
                {(errors.issuer || fieldErrors.issuer) && (
                  <p className="text-sm text-red-600">
                    {errors.issuer?.message || fieldErrors.issuer?.[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id" className="text-enterprise-700">
                    Client ID *
                  </Label>
                  <Input
                    id="client_id"
                    placeholder="your-client-id"
                    className="enterprise-focus"
                    {...register('client_id')}
                    disabled={isLoading}
                  />
                  {(errors.client_id || fieldErrors.client_id) && (
                    <p className="text-sm text-red-600">
                      {errors.client_id?.message || fieldErrors.client_id?.[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_secret" className="text-enterprise-700">
                    Client Secret *
                  </Label>
                  <Input
                    id="client_secret"
                    type="password"
                    placeholder="your-client-secret"
                    className="enterprise-focus"
                    {...register('client_secret')}
                    disabled={isLoading}
                  />
                  {(errors.client_secret || fieldErrors.client_secret) && (
                    <p className="text-sm text-red-600">
                      {errors.client_secret?.message || fieldErrors.client_secret?.[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scopes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-enterprise-900">Scopes</h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {customScopes.map((scope) => (
                  <Badge
                    key={scope}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <span>{scope}</span>
                    <button
                      type="button"
                      onClick={() => removeScope(scope)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom scope"
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  className="enterprise-focus"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addScope())}
                />
                <Button type="button" variant="enterprise-outline" onClick={addScope}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Claims Mapping */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-enterprise-900">Claims Mapping</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email_claim" className="text-enterprise-700">
                  Email Claim *
                </Label>
                <Input
                  id="email_claim"
                  placeholder="email"
                  className="enterprise-focus"
                  {...register('email_claim')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name_claim" className="text-enterprise-700">
                  First Name Claim *
                </Label>
                <Input
                  id="first_name_claim"
                  placeholder="given_name"
                  className="enterprise-focus"
                  {...register('first_name_claim')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name_claim" className="text-enterprise-700">
                  Last Name Claim *
                </Label>
                <Input
                  id="last_name_claim"
                  placeholder="family_name"
                  className="enterprise-focus"
                  {...register('last_name_claim')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role_claim" className="text-enterprise-700">
                  Role Claim (Optional)
                </Label>
                <Input
                  id="role_claim"
                  placeholder="role"
                  className="enterprise-focus"
                  {...register('role_claim')}
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
                    Enable this OIDC configuration for user authentication
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
                    Automatically create user accounts for new OIDC users
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