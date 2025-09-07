'use client';

import { useState } from 'react';
import { OIDCConfigurationList } from '@/components/sso/OIDCConfigurationList';
import { OIDCConfigurationForm } from '@/components/sso/OIDCConfigurationForm';
import { useRequireAuth, usePermissions } from '@/hooks/useAuth';

export default function OIDCConfigPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { hasPermission } = usePermissions();
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !hasPermission('can_manage_sso')) {
    return <div>Access denied</div>;
  }

  const handleEdit = (config: any) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingConfig(null);
    setShowForm(true);
  };

  const handleSave = async (data: any) => {
    // TODO: Implement API call
    console.log('Save OIDC config:', data);
    setShowForm(false);
    setEditingConfig(null);
  };

  const handleDelete = async (configId: string) => {
    // TODO: Implement API call
    console.log('Delete OIDC config:', configId);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <OIDCConfigurationForm
          config={editingConfig}
          roles={[]} // TODO: Fetch roles from API
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          onTest={(data) => console.log('Test OIDC config:', data)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <OIDCConfigurationList
        configurations={[]} // TODO: Fetch from API
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
    </div>
  );
}