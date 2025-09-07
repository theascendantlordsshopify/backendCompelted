'use client';

import { useState } from 'react';
import { Mail, Clock, Check, X, MoreHorizontal, Send, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatRelativeTime, formatDateTime, getStatusColor } from '@/lib/utils';
import { Invitation } from '@/types';

interface InvitationListProps {
  invitations: Invitation[];
  onResendInvitation?: (invitationId: string) => void;
  onCancelInvitation?: (invitationId: string) => void;
  onCreateInvitation?: () => void;
}

export function InvitationList({ 
  invitations, 
  onResendInvitation, 
  onCancelInvitation,
  onCreateInvitation 
}: InvitationListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <Check className="h-4 w-4" />;
      case 'declined':
        return <X className="h-4 w-4" />;
      case 'expired':
        return <Clock className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      setActionLoading(invitationId);
      await onResendInvitation?.(invitationId);
      
      toast({
        title: 'Invitation resent',
        description: 'The invitation has been sent again.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Resend failed',
        description: 'Failed to resend invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      setActionLoading(invitationId);
      await onCancelInvitation?.(invitationId);
      
      toast({
        title: 'Invitation cancelled',
        description: 'The invitation has been cancelled.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Cancellation failed',
        description: 'Failed to cancel invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-enterprise-900">Team Invitations</CardTitle>
            <CardDescription className="text-enterprise-600">
              Manage invitations sent to team members
            </CardDescription>
          </div>
          <Button variant="enterprise" onClick={onCreateInvitation}>
            <Send className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-enterprise-400 mb-4" />
            <h3 className="text-lg font-medium text-enterprise-900 mb-2">
              No invitations sent
            </h3>
            <p className="text-enterprise-600 mb-4">
              Start building your team by sending invitations
            </p>
            <Button variant="enterprise" onClick={onCreateInvitation}>
              Send First Invitation
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-enterprise-900">
                        {invitation.invited_email}
                      </p>
                      {invitation.message && (
                        <p className="text-sm text-enterprise-600 truncate max-w-xs">
                          {invitation.message}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-enterprise-700">
                      {invitation.role_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={getStatusColor(invitation.status)}>
                        {getStatusIcon(invitation.status)}
                      </div>
                      <span className="capitalize text-enterprise-700">
                        {invitation.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-enterprise-600">
                    {formatRelativeTime(invitation.created_at)}
                  </TableCell>
                  <TableCell className="text-enterprise-600">
                    {new Date(invitation.expires_at) > new Date() ? (
                      formatRelativeTime(invitation.expires_at)
                    ) : (
                      <span className="text-red-600">Expired</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {invitation.status === 'pending' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleResendInvitation(invitation.id)}
                            disabled={actionLoading === invitation.id}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Resend
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCancelInvitation(invitation.id)}
                            disabled={actionLoading === invitation.id}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}