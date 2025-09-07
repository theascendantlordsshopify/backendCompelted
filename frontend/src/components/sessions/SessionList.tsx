'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, MoreHorizontal, Trash2, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatRelativeTime, formatDateTime } from '@/lib/utils';
import { UserSession } from '@/types';

interface SessionListProps {
  sessions: UserSession[];
  onSessionRevoke?: (sessionId: string) => void;
  onRevokeAllOthers?: () => void;
}

export function SessionList({ sessions, onSessionRevoke, onRevokeAllOthers }: SessionListProps) {
  const [revokingSession, setRevokingSession] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const { toast } = useToast();

  const getDeviceIcon = (deviceInfo: any) => {
    const device = deviceInfo?.device?.toLowerCase() || '';
    
    if (device.includes('mobile') || device.includes('phone')) {
      return <Smartphone className="h-5 w-5" />;
    } else if (device.includes('tablet') || device.includes('ipad')) {
      return <Tablet className="h-5 w-5" />;
    } else {
      return <Monitor className="h-5 w-5" />;
    }
  };

  const getDeviceDescription = (session: UserSession) => {
    const { device_info } = session;
    const parts = [];
    
    if (device_info?.browser) {
      parts.push(device_info.browser);
    }
    if (device_info?.os) {
      parts.push(device_info.os);
    }
    
    return parts.length > 0 ? parts.join(' on ') : 'Unknown device';
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setRevokingSession(sessionId);
      await onSessionRevoke?.(sessionId);
      
      toast({
        title: 'Session revoked',
        description: 'The session has been successfully revoked.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Revocation failed',
        description: 'Failed to revoke session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRevokingSession(null);
    }
  };

  const handleRevokeAllOthers = async () => {
    try {
      setRevokingAll(true);
      await onRevokeAllOthers?.();
      
      toast({
        title: 'Sessions revoked',
        description: 'All other sessions have been successfully revoked.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Revocation failed',
        description: 'Failed to revoke sessions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRevokingAll(false);
    }
  };

  const activeSessions = sessions.filter(s => s.is_active && !s.is_expired);
  const otherSessions = activeSessions.filter(s => !s.is_current);

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-enterprise-900">
              <Shield className="mr-2 h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription className="text-enterprise-600">
              Manage your active login sessions across devices
            </CardDescription>
          </div>
          {otherSessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRevokeAllOthers}
              disabled={revokingAll}
            >
              Revoke All Others
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSessions.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-enterprise-400 mb-4" />
            <h3 className="text-lg font-medium text-enterprise-900 mb-2">
              No active sessions
            </h3>
            <p className="text-enterprise-600">
              You don't have any active sessions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 border rounded-lg enterprise-transition ${
                  session.is_current
                    ? 'border-primary bg-primary/5'
                    : 'border-enterprise-200 hover:border-enterprise-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-enterprise-600">
                    {getDeviceIcon(session.device_info)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-enterprise-900">
                        {getDeviceDescription(session)}
                      </h4>
                      {session.is_current && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-enterprise-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location || session.ip_address}</span>
                      </div>
                      <span>• Last active {formatRelativeTime(session.last_activity)}</span>
                    </div>
                    <p className="text-xs text-enterprise-500 mt-1">
                      Created {formatDateTime(session.created_at)}
                    </p>
                  </div>
                </div>

                {!session.is_current && (
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
                )}
              </div>
            ))}
          </div>
        )}

        {activeSessions.length > 1 && (
          <Alert>
            <AlertDescription>
              You have {activeSessions.length} active sessions. 
              For security, consider revoking sessions you don't recognize.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}