'use client';

import { useState } from 'react';
import { Smartphone, QrCode, Key, MoreHorizontal, Trash2, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatRelativeTime } from '@/lib/utils';
import { MFADevice } from '@/types';

interface MFADeviceListProps {
  devices: MFADevice[];
  onDeviceRemove?: (deviceId: string) => void;
  onDeviceEdit?: (device: MFADevice) => void;
  onAddDevice?: () => void;
}

export function MFADeviceList({ 
  devices, 
  onDeviceRemove, 
  onDeviceEdit, 
  onAddDevice 
}: MFADeviceListProps) {
  const [removingDevice, setRemovingDevice] = useState<string | null>(null);
  const { toast } = useToast();

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'totp':
        return <QrCode className="h-5 w-5" />;
      case 'sms':
        return <Smartphone className="h-5 w-5" />;
      case 'backup':
        return <Key className="h-5 w-5" />;
      default:
        return <Key className="h-5 w-5" />;
    }
  };

  const getDeviceColor = (deviceType: string, isActive: boolean) => {
    if (!isActive) return 'text-enterprise-400';
    
    switch (deviceType) {
      case 'totp':
        return 'text-blue-600';
      case 'sms':
        return 'text-green-600';
      case 'backup':
        return 'text-yellow-600';
      default:
        return 'text-enterprise-600';
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      setRemovingDevice(deviceId);
      
      // Call API to remove device
      await onDeviceRemove?.(deviceId);
      
      toast({
        title: 'Device removed',
        description: 'MFA device has been successfully removed.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Removal failed',
        description: 'Failed to remove MFA device. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRemovingDevice(null);
    }
  };

  if (devices.length === 0) {
    return (
      <Card className="enterprise-shadow">
        <CardHeader>
          <CardTitle className="text-enterprise-900">MFA Devices</CardTitle>
          <CardDescription className="text-enterprise-600">
            No MFA devices configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Key className="mx-auto h-12 w-12 text-enterprise-400 mb-4" />
            <h3 className="text-lg font-medium text-enterprise-900 mb-2">
              No MFA devices
            </h3>
            <p className="text-enterprise-600 mb-4">
              Add a multi-factor authentication device to secure your account
            </p>
            <Button variant="enterprise" onClick={onAddDevice}>
              Add MFA Device
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="enterprise-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-enterprise-900">MFA Devices</CardTitle>
            <CardDescription className="text-enterprise-600">
              Manage your multi-factor authentication devices
            </CardDescription>
          </div>
          <Button variant="enterprise-outline" size="sm" onClick={onAddDevice}>
            Add Device
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center justify-between p-4 border border-enterprise-200 rounded-lg hover:border-enterprise-300 enterprise-transition"
          >
            <div className="flex items-center space-x-4">
              <div className={`${getDeviceColor(device.device_type, device.is_active)}`}>
                {getDeviceIcon(device.device_type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-enterprise-900">{device.name}</h4>
                  {device.is_primary && (
                    <Badge variant="secondary" className="text-xs">
                      Primary
                    </Badge>
                  )}
                  {!device.is_active && (
                    <Badge variant="outline" className="text-xs text-enterprise-500">
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-enterprise-600">
                  <span>{device.device_type_display}</span>
                  {device.phone_number && (
                    <span>•••• {device.phone_number.slice(-4)}</span>
                  )}
                  {device.last_used_at && (
                    <span>• Last used {formatRelativeTime(device.last_used_at)}</span>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDeviceEdit?.(device)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRemoveDevice(device.id)}
                  disabled={removingDevice === device.id}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {devices.length === 1 && (
          <Alert>
            <AlertDescription>
              Consider adding a backup MFA method in case you lose access to your primary device.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}