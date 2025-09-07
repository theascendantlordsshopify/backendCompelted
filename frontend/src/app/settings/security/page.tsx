'use client';

import { useState } from 'react';
import { Shield, Key, Monitor, Building2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { MFAEnrollmentWizard } from '@/components/mfa/MFAEnrollmentWizard';
import { MFADeviceList } from '@/components/mfa/MFADeviceList';
import { DisableMFAForm } from '@/components/mfa/DisableMFAForm';
import { RegenerateBackupCodesForm } from '@/components/mfa/RegenerateBackupCodesForm';
import { SessionList } from '@/components/sessions/SessionList';
import { SSOSessionList } from '@/components/sso/SSOSessionList';
import { useAuth } from '@/hooks/useAuth';
import { useRequireAuth } from '@/hooks/useAuth';

export default function SecuritySettingsPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { user } = useAuth();
  const [showMFAEnrollment, setShowMFAEnrollment] = useState(false);
  const [showDisableMFA, setShowDisableMFA] = useState(false);
  const [showRegenerateBackup, setShowRegenerateBackup] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-enterprise-900">Security Settings</h1>
          <p className="text-enterprise-600 mt-2">
            Manage your account security, authentication methods, and active sessions
          </p>
        </div>

        <Tabs defaultValue="password" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="password" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Password</span>
            </TabsTrigger>
            <TabsTrigger value="mfa" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>MFA</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="sso" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>SSO</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-6">
            <ChangePasswordForm />
          </TabsContent>

          <TabsContent value="mfa" className="space-y-6">
            {showMFAEnrollment ? (
              <MFAEnrollmentWizard
                onComplete={() => setShowMFAEnrollment(false)}
                onCancel={() => setShowMFAEnrollment(false)}
              />
            ) : showDisableMFA ? (
              <DisableMFAForm
                onSuccess={() => setShowDisableMFA(false)}
                onCancel={() => setShowDisableMFA(false)}
              />
            ) : showRegenerateBackup ? (
              <RegenerateBackupCodesForm
                onSuccess={() => setShowRegenerateBackup(false)}
                onCancel={() => setShowRegenerateBackup(false)}
              />
            ) : (
              <div className="space-y-6">
                <MFADeviceList
                  devices={[]} // TODO: Fetch from API
                  onAddDevice={() => setShowMFAEnrollment(true)}
                />
                
                {user?.is_mfa_enabled && (
                  <Card className="enterprise-shadow">
                    <CardHeader>
                      <CardTitle className="text-enterprise-900">MFA Management</CardTitle>
                      <CardDescription className="text-enterprise-600">
                        Additional MFA options and settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-4">
                        <Button
                          variant="enterprise-outline"
                          onClick={() => setShowRegenerateBackup(true)}
                        >
                          Regenerate Backup Codes
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setShowDisableMFA(true)}
                        >
                          Disable MFA
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <SessionList
              sessions={[]} // TODO: Fetch from API
              onSessionRevoke={(sessionId) => {
                // TODO: Implement session revocation
                console.log('Revoke session:', sessionId);
              }}
              onRevokeAllOthers={() => {
                // TODO: Implement revoke all others
                console.log('Revoke all other sessions');
              }}
            />
          </TabsContent>

          <TabsContent value="sso" className="space-y-6">
            <SSOSessionList
              sessions={[]} // TODO: Fetch from API
              onSessionRevoke={(sessionId) => {
                // TODO: Implement SSO session revocation
                console.log('Revoke SSO session:', sessionId);
              }}
              onRevokeAll={() => {
                // TODO: Implement revoke all SSO sessions
                console.log('Revoke all SSO sessions');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}