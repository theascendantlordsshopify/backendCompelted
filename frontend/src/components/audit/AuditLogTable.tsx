'use client';

import { useState } from 'react';
import { 
  Shield, 
  LogIn, 
  LogOut, 
  Key, 
  User, 
  Settings,
  AlertTriangle,
  Info,
  Filter,
  Download
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatRelativeTime, formatDateTime } from '@/lib/utils';
import { AuditLog } from '@/types';

interface AuditLogTableProps {
  auditLogs: AuditLog[];
  onExport?: () => void;
}

export function AuditLogTable({ auditLogs, onExport }: AuditLogTableProps) {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'saml_login':
      case 'oidc_login':
        return <LogIn className="h-4 w-4" />;
      case 'logout':
      case 'sso_logout':
        return <LogOut className="h-4 w-4" />;
      case 'login_failed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'password_changed':
      case 'password_reset_requested':
      case 'password_reset_completed':
      case 'forced_password_change':
        return <Key className="h-4 w-4" />;
      case 'email_verified':
      case 'profile_updated':
        return <User className="h-4 w-4" />;
      case 'mfa_enabled':
      case 'mfa_disabled':
      case 'backup_codes_regenerated':
        return <Shield className="h-4 w-4" />;
      case 'role_assigned':
      case 'role_removed':
      case 'invitation_sent':
      case 'invitation_accepted':
        return <Settings className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
      case 'saml_login':
      case 'oidc_login':
      case 'email_verified':
      case 'mfa_enabled':
        return 'text-green-600';
      case 'login_failed':
      case 'account_locked':
        return 'text-red-600';
      case 'logout':
      case 'sso_logout':
      case 'mfa_disabled':
        return 'text-yellow-600';
      case 'password_changed':
      case 'password_reset_completed':
        return 'text-blue-600';
      default:
        return 'text-enterprise-600';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSearch = searchTerm === '' || 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAction && matchesSearch;
  });

  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action)));

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-enterprise-900">Audit Log</CardTitle>
            <CardDescription className="text-enterprise-600">
              View your account activity and security events
            </CardDescription>
          </div>
          {onExport && (
            <Button variant="enterprise-outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by description or IP address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="enterprise-focus"
            />
          </div>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-full sm:w-48 enterprise-focus">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audit Log Table */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-enterprise-400 mb-4" />
            <h3 className="text-lg font-medium text-enterprise-900 mb-2">
              No audit logs found
            </h3>
            <p className="text-enterprise-600">
              {searchTerm || filterAction !== 'all' 
                ? 'No logs match your current filters'
                : 'No audit logs available'
              }
            </p>
          </div>
        ) : (
          <div className="border border-enterprise-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={getActionColor(log.action)}>
                          {getActionIcon(log.action)}
                        </div>
                        <span className="font-medium text-enterprise-900">
                          {log.action_display}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-enterprise-700 max-w-md">
                        {log.description}
                      </p>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="mt-1">
                          <summary className="text-xs text-enterprise-500 cursor-pointer hover:text-enterprise-600">
                            View details
                          </summary>
                          <pre className="text-xs text-enterprise-600 mt-1 p-2 bg-enterprise-50 rounded border overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-enterprise-600">
                        {log.ip_address || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-enterprise-600">
                        <p className="text-sm">{formatRelativeTime(log.created_at)}</p>
                        <p className="text-xs text-enterprise-500">
                          {formatDateTime(log.created_at)}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredLogs.length > 0 && (
          <div className="text-center text-sm text-enterprise-500">
            Showing {filteredLogs.length} of {auditLogs.length} audit log entries
          </div>
        )}
      </CardContent>
    </Card>
  );
}