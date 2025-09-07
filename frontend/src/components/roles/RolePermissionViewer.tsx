'use client';

import { useState } from 'react';
import { 
  Shield, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Unlock,
  Info,
  Search,
  Filter
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Role, Permission } from '@/types';
import { groupBy } from '@/lib/utils';

interface RolePermissionViewerProps {
  roles: Role[];
  userRoles?: Role[];
  showUserRoles?: boolean;
  onRoleSelect?: (role: Role) => void;
}

export function RolePermissionViewer({ 
  roles, 
  userRoles = [], 
  showUserRoles = false,
  onRoleSelect 
}: RolePermissionViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const toggleRoleExpansion = (roleId: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const getRoleTypeIcon = (roleType: string) => {
    switch (roleType) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'organizer':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'team_member':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'billing_manager':
        return <Shield className="h-4 w-4 text-yellow-600" />;
      case 'viewer':
        return <Lock className="h-4 w-4 text-gray-600" />;
      default:
        return <Shield className="h-4 w-4 text-enterprise-600" />;
    }
  };

  const getRoleTypeColor = (roleType: string) => {
    switch (roleType) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'organizer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'team_member':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'billing_manager':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-enterprise-100 text-enterprise-800 border-enterprise-200';
    }
  };

  const getPermissionCategoryIcon = (category: string) => {
    switch (category) {
      case 'user_management':
        return <Users className="h-4 w-4" />;
      case 'event_management':
        return <Shield className="h-4 w-4" />;
      case 'administration':
        return <Lock className="h-4 w-4" />;
      case 'billing':
        return <Shield className="h-4 w-4" />;
      case 'reporting':
        return <Shield className="h-4 w-4" />;
      default:
        return <Unlock className="h-4 w-4" />;
    }
  };

  // Filter roles based on search and category
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchTerm === '' || 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Get all permission categories
  const allPermissions = roles.flatMap(role => role.role_permissions);
  const permissionCategories = Array.from(new Set(allPermissions.map(p => p.category)));

  return (
    <div className="space-y-6">
      {/* User's Current Roles (if applicable) */}
      {showUserRoles && userRoles.length > 0 && (
        <Card className="enterprise-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-enterprise-900">
              <Shield className="mr-2 h-5 w-5" />
              Your Roles
            </CardTitle>
            <CardDescription className="text-enterprise-600">
              Roles currently assigned to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userRoles.map((role) => (
                <Badge
                  key={role.id}
                  className={`${getRoleTypeColor(role.role_type)} border`}
                >
                  <div className="flex items-center space-x-1">
                    {getRoleTypeIcon(role.role_type)}
                    <span>{role.name}</span>
                  </div>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Roles and Permissions */}
      <Card className="enterprise-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-enterprise-900">Roles & Permissions</CardTitle>
              <CardDescription className="text-enterprise-600">
                View all available roles and their associated permissions
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-enterprise-700">
              {filteredRoles.length} roles
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-enterprise-400" />
                <Input
                  placeholder="Search roles and permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 enterprise-focus"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48 enterprise-focus">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {permissionCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Roles List */}
          <div className="space-y-4">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-enterprise-400 mb-4" />
                <h3 className="text-lg font-medium text-enterprise-900 mb-2">
                  No roles found
                </h3>
                <p className="text-enterprise-600">
                  {searchTerm ? 'No roles match your search criteria' : 'No roles available'}
                </p>
              </div>
            ) : (
              filteredRoles.map((role) => {
                const isExpanded = expandedRoles.has(role.id);
                const groupedPermissions = groupBy(role.role_permissions, 'category');
                const filteredPermissions = filterCategory === 'all' 
                  ? role.role_permissions 
                  : role.role_permissions.filter(p => p.category === filterCategory);

                return (
                  <Collapsible
                    key={role.id}
                    open={isExpanded}
                    onOpenChange={() => toggleRoleExpansion(role.id)}
                  >
                    <div className="border border-enterprise-200 rounded-lg overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 hover:bg-enterprise-50 cursor-pointer enterprise-transition">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getRoleTypeIcon(role.role_type)}
                              <div>
                                <h3 className="font-semibold text-enterprise-900">{role.name}</h3>
                                <p className="text-sm text-enterprise-600">{role.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge
                                className={`${getRoleTypeColor(role.role_type)} border text-xs`}
                              >
                                {role.role_type.replace(/_/g, ' ')}
                              </Badge>
                              <p className="text-xs text-enterprise-500 mt-1">
                                {role.total_permissions} permissions
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-enterprise-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-enterprise-400" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t border-enterprise-200 bg-enterprise-25">
                          {/* Role Hierarchy */}
                          {role.parent_name && (
                            <div className="px-4 py-2 bg-enterprise-50 border-b border-enterprise-200">
                              <p className="text-sm text-enterprise-600">
                                <span className="font-medium">Inherits from:</span> {role.parent_name}
                              </p>
                            </div>
                          )}

                          {/* Permissions by Category */}
                          <div className="p-4 space-y-4">
                            {Object.entries(groupedPermissions).map(([category, permissions]) => {
                              // Apply category filter
                              const categoryPermissions = filterCategory === 'all' 
                                ? permissions 
                                : permissions.filter(p => p.category === filterCategory);

                              if (categoryPermissions.length === 0) return null;

                              return (
                                <div key={category} className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    {getPermissionCategoryIcon(category)}
                                    <h4 className="font-medium text-enterprise-800">
                                      {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h4>
                                    <Badge variant="outline" className="text-xs">
                                      {categoryPermissions.length}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                                    {categoryPermissions.map((permission) => (
                                      <TooltipProvider key={permission.id}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex items-center space-x-2 p-2 bg-white rounded border border-enterprise-100 hover:border-enterprise-200 enterprise-transition">
                                              <Unlock className="h-3 w-3 text-green-600" />
                                              <span className="text-sm text-enterprise-700 font-medium">
                                                {permission.name}
                                              </span>
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <div className="max-w-xs">
                                              <p className="font-medium">{permission.name}</p>
                                              <p className="text-sm text-muted-foreground mt-1">
                                                {permission.description}
                                              </p>
                                              <p className="text-xs text-muted-foreground mt-1">
                                                Code: {permission.codename}
                                              </p>
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}

                            {Object.keys(groupedPermissions).length === 0 && (
                              <div className="text-center py-4">
                                <Lock className="mx-auto h-8 w-8 text-enterprise-400 mb-2" />
                                <p className="text-sm text-enterprise-600">
                                  No permissions assigned to this role
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })
            )}
          </div>

          {/* Permission Legend */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Permission Categories:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 text-enterprise-600" />
                    <span>User Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-enterprise-600" />
                    <span>Event Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-3 w-3 text-enterprise-600" />
                    <span>Administration</span>
                  </div>
                </div>
                <p className="text-xs text-enterprise-500 mt-2">
                  Roles with parent relationships inherit all permissions from their parent role.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}