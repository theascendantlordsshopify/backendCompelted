'use client';

import { useState } from 'react';
import { Building2, Globe, MoreHorizontal, Trash2, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatRelativeTime, formatDateTime } from '@/lib/utils';

interface SSOSession {
  id: string;
  sso_type: 'saml' | 'oidc';
  provider_name: string;
  ip_address: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
}

interface SSOSessionListProps {
  sessions: SSOSession[];
  onSessionRevoke?: (sessionId: string) => void;
  onRevokeAll?: () => void;
}

export function SSOSessionList({ sessions, onSessionRevoke, onRevokeAll }: SSOSessionListProps) {
  const [revokingSession, setRevokingSession] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const { toast } = useToast();

  const getSSOTypeIcon = (ssoType: string) => {
    switch (ssoType) {
      case 'saml':
        return <Building2 className="h-4 w-4" />;
      case 'oidc':
        return <Globe className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getSSOTypeBadge = (ssoType: string) => {
    switch (ssoType) {
      case 'saml':
        return <Badge variant="outline" className="text-blue-700 border-blue-200">SAML</Badge>;
      case 'oidc':
        return <Badge variant="outline" className="text-green-700 border-green-200">OIDC</Badge>;
      default:
        return <Badge variant="outline">SSO</Badge>;
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setRevokingSession(sessionId);
      await onSessionRevoke?.(sessionId);
      
      toast({
        title: 'SSO session revoked',
        description: 'The SSO session has been successfully revoked.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Revocation failed',
        description: 'Failed to revoke SSO session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRevokingSession(null);
    }
  };

  const handleRevokeAll = async () => {
    try {
      setRevokingAll(true);
      await onRevokeAll?.();
      
      toast({
        title: 'All SSO sessions revoked',
        description: 'All SSO sessions have been successfully revoked.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Revocation failed',
        description: 'Failed to revoke SSO sessions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRevokingAll(false);
    }
  };

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-enterprise-900">
              <Building2 className="mr-2 h-5 w-5" />
              SSO Sessions
            </CardTitle>
            <CardDescription className="text-enterprise-600">
              Manage your Single Sign-On sessions
            </CardDescription>
          </div>
          {sessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRevokeAll}
              disabled={revokingAll}
            >
              Revoke All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="mx-auto h-12 w-12 text-enterprise-400 mb-4" />
            <h3 className="text-lg font-medium text-enterprise-900 mb-2">
              No active SSO sessions
            </h3>
            <p className="text-enterprise-600">
              You don't have any active Single Sign-On sessions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getSSOTypeIcon(session.sso_type)}
                        <span className="font-medium text-enterprise-900">
                          {session.provider_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSSOTypeBadge(session.sso_type)}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-enterprise-600">
                        {session.ip_address}
                      </span>
                    </TableCell>
                    <TableCell className="text-enterprise-600">
                      {formatRelativeTime(session.last_activity)}
                    </TableCell>
                    <TableCell className="text-enterprise-600">
                      {new Date(session.expires_at) > new Date() ? (
                        formatRelativeTime(session.expires_at)
                      ) : (
                        <span className="text-red-600">Expired</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={revokingSession === session.id}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Revoke Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Alert>
              <AlertDescription>
                Revoking SSO sessions may require you to sign in again through your organization's identity provider.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}