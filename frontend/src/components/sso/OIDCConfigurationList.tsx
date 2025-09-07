'use client';

import { useState } from 'react';
import { Globe, Plus, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatDateTime } from '@/lib/utils';

interface OIDCConfiguration {
  id: string;
  organization_name: string;
  organization_domain: string;
  issuer: string;
  client_id: string;
  scopes: string[];
  email_claim: string;
  first_name_claim: string;
  last_name_claim: string;
  role_claim: string;
  is_active: boolean;
  auto_provision_users: boolean;
  default_role: string | null;
  created_at: string;
  updated_at: string;
}

interface OIDCConfigurationListProps {
  configurations: OIDCConfiguration[];
  onEdit?: (config: OIDCConfiguration) => void;
  onDelete?: (configId: string) => void;
  onCreate?: () => void;
}

export function OIDCConfigurationList({ 
  configurations, 
  onEdit, 
  onDelete, 
  onCreate 
}: OIDCConfigurationListProps) {
  const [deletingConfig, setDeletingConfig] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (configId: string) => {
    try {
      setDeletingConfig(configId);
      await onDelete?.(configId);
      
      toast({
        title: 'OIDC configuration deleted',
        description: 'The OIDC configuration has been successfully deleted.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Deletion failed',
        description: 'Failed to delete OIDC configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingConfig(null);
    }
  };

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-enterprise-900">
              <Globe className="mr-2 h-5 w-5" />
              OIDC Configurations
            </CardTitle>
            <CardDescription className="text-enterprise-600">
              Manage OpenID Connect configurations for modern authentication
            </CardDescription>
          </div>
          <Button variant="enterprise" onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add OIDC Config
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {configurations.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="mx-auto h-12 w-12 text-enterprise-400 mb-4" />
            <h3 className="text-lg font-medium text-enterprise-900 mb-2">
              No OIDC configurations
            </h3>
            <p className="text-enterprise-600 mb-4">
              Set up OpenID Connect for modern enterprise authentication
            </p>
            <Button variant="enterprise" onClick={onCreate}>
              Create First OIDC Config
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auto Provision</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configurations.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      <p className="font-medium text-enterprise-900">
                        {config.organization_name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-enterprise-700">
                        {config.organization_domain}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-enterprise-600 max-w-xs truncate">
                        {config.issuer}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {config.is_active ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <Badge variant="success">Active</Badge>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <Badge variant="outline" className="text-red-700">Inactive</Badge>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {config.auto_provision_users ? (
                        <Badge variant="info">Enabled</Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-enterprise-600">
                      {formatDateTime(config.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit?.(config)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(config.id)}
                            disabled={deletingConfig === config.id}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
                OIDC configurations enable modern OAuth 2.0 / OpenID Connect authentication flows.
                Test configurations thoroughly before enabling for production use.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}