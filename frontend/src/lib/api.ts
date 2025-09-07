import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookie
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // Handle permission denied
      console.error('Permission denied:', error.response.data);
    }
    
    // Handle 429 Rate Limited
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API client class for organized endpoint management
export class ApiClient {
  // Authentication endpoints
  static auth = {
    login: (data: { email: string; password: string; remember_me?: boolean }) =>
      api.post('/users/login/', data),
    
    register: (data: { 
      email: string; 
      first_name: string; 
      last_name: string; 
      password: string; 
      password_confirm: string; 
      terms_accepted: boolean 
    }) => api.post('/users/register/', data),
    
    logout: () => api.post('/users/logout/'),
    
    verifyEmail: (data: { token: string }) => api.post('/users/verify-email/', data),
    
    requestPasswordReset: (data: { email: string }) => 
      api.post('/users/request-password-reset/', data),
    
    confirmPasswordReset: (data: { 
      token: string; 
      new_password: string; 
      new_password_confirm: string 
    }) => api.post('/users/confirm-password-reset/', data),
    
    changePassword: (data: { 
      old_password: string; 
      new_password: string; 
      new_password_confirm: string 
    }) => api.post('/users/change-password/', data),
    
    // SSO endpoints
    initiateSso: (data: { 
      sso_type: 'saml' | 'oidc'; 
      organization_domain: string; 
      redirect_url?: string 
    }) => api.post('/users/sso/initiate/', data),
    
    ssoDiscovery: (domain: string) => api.get(`/users/sso/discovery/?domain=${domain}`),
  };

  // User management endpoints
  static users = {
    getProfile: () => api.get('/users/profile/'),
    updateProfile: (data: any) => api.patch('/users/profile/', data),
    getPublicProfile: (slug: string) => api.get(`/users/public/${slug}/`),
    
    // MFA endpoints
    getMfaDevices: () => api.get('/users/mfa/devices/'),
    setupMfa: (data: { device_type: string; device_name: string; phone_number?: string }) =>
      api.post('/users/mfa/setup/', data),
    verifyMfa: (data: { otp_code: string; device_id?: string }) =>
      api.post('/users/mfa/verify/', data),
    disableMfa: (data: { password: string }) => api.post('/users/mfa/disable/', data),
    regenerateBackupCodes: (data: { password: string }) =>
      api.post('/users/mfa/backup-codes/regenerate/', data),
    
    // Session management
    getSessions: () => api.get('/users/sessions/'),
    revokeSession: (sessionId: string) => api.post(`/users/sessions/${sessionId}/revoke/`),
    revokeAllSessions: () => api.post('/users/sessions/revoke-all/'),
    
    // Invitations
    getInvitations: () => api.get('/users/invitations/'),
    sendInvitation: (data: { invited_email: string; role: string; message?: string }) =>
      api.post('/users/invitations/', data),
    respondToInvitation: (data: any) => api.post('/users/invitations/respond/', data),
    
    // Audit logs
    getAuditLogs: () => api.get('/users/audit-logs/'),
    
    // Roles and permissions
    getRoles: () => api.get('/users/roles/'),
    getPermissions: () => api.get('/users/permissions/'),
  };

  // Event management endpoints
  static events = {
    getEventTypes: () => api.get('/events/event-types/'),
    createEventType: (data: any) => api.post('/events/event-types/', data),
    getEventType: (id: string) => api.get(`/events/event-types/${id}/`),
    updateEventType: (id: string, data: any) => api.patch(`/events/event-types/${id}/`, data),
    deleteEventType: (id: string) => api.delete(`/events/event-types/${id}/`),
    
    // Public endpoints
    getPublicOrganizer: (slug: string) => api.get(`/events/public/${slug}/`),
    getPublicEventType: (organizerSlug: string, eventTypeSlug: string) =>
      api.get(`/events/public/${organizerSlug}/${eventTypeSlug}/`),
    getAvailableSlots: (organizerSlug: string, eventTypeSlug: string, params: any) =>
      api.get(`/events/slots/${organizerSlug}/${eventTypeSlug}/`, { params }),
    
    // Booking management
    getBookings: (params?: any) => api.get('/events/bookings/', { params }),
    getBooking: (id: string) => api.get(`/events/bookings/${id}/`),
    updateBooking: (id: string, data: any) => api.patch(`/events/bookings/${id}/`, data),
    createBooking: (data: any) => api.post('/events/bookings/create/', data),
    
    // Public booking management
    getBookingByToken: (token: string) => api.get(`/events/booking/${token}/manage/`),
    manageBooking: (token: string, data: any) => api.post(`/events/booking/${token}/manage/`, data),
    
    // Group booking management
    addAttendee: (bookingId: string, data: any) =>
      api.post(`/events/bookings/${bookingId}/attendees/add/`, data),
    removeAttendee: (bookingId: string, attendeeId: string) =>
      api.post(`/events/bookings/${bookingId}/attendees/${attendeeId}/remove/`),
    
    // Analytics
    getBookingAnalytics: (params?: any) => api.get('/events/analytics/', { params }),
    getBookingAuditLogs: (bookingId: string) => api.get(`/events/bookings/${bookingId}/audit/`),
  };

  // Availability management endpoints
  static availability = {
    // Rules
    getRules: () => api.get('/availability/rules/'),
    createRule: (data: any) => api.post('/availability/rules/', data),
    getRule: (id: string) => api.get(`/availability/rules/${id}/`),
    updateRule: (id: string, data: any) => api.patch(`/availability/rules/${id}/`, data),
    deleteRule: (id: string) => api.delete(`/availability/rules/${id}/`),
    
    // Date overrides
    getOverrides: () => api.get('/availability/overrides/'),
    createOverride: (data: any) => api.post('/availability/overrides/', data),
    getOverride: (id: string) => api.get(`/availability/overrides/${id}/`),
    updateOverride: (id: string, data: any) => api.patch(`/availability/overrides/${id}/`, data),
    deleteOverride: (id: string) => api.delete(`/availability/overrides/${id}/`),
    
    // Blocked times
    getBlockedTimes: () => api.get('/availability/blocked/'),
    createBlockedTime: (data: any) => api.post('/availability/blocked/', data),
    getBlockedTime: (id: string) => api.get(`/availability/blocked/${id}/`),
    updateBlockedTime: (id: string, data: any) => api.patch(`/availability/blocked/${id}/`, data),
    deleteBlockedTime: (id: string) => api.delete(`/availability/blocked/${id}/`),
    
    // Recurring blocked times
    getRecurringBlocks: () => api.get('/availability/recurring-blocks/'),
    createRecurringBlock: (data: any) => api.post('/availability/recurring-blocks/', data),
    getRecurringBlock: (id: string) => api.get(`/availability/recurring-blocks/${id}/`),
    updateRecurringBlock: (id: string, data: any) => api.patch(`/availability/recurring-blocks/${id}/`, data),
    deleteRecurringBlock: (id: string) => api.delete(`/availability/recurring-blocks/${id}/`),
    
    // Buffer settings
    getBufferSettings: () => api.get('/availability/buffer/'),
    updateBufferSettings: (data: any) => api.patch('/availability/buffer/', data),
    
    // Calculated slots
    getCalculatedSlots: (organizerSlug: string, params: any) =>
      api.get(`/availability/calculated-slots/${organizerSlug}/`, { params }),
    
    // Statistics and management
    getStats: () => api.get('/availability/stats/'),
    clearCache: () => api.post('/availability/cache/clear/'),
    precomputeCache: (data?: any) => api.post('/availability/cache/precompute/', data),
  };

  // Integration endpoints
  static integrations = {
    // Calendar integrations
    getCalendarIntegrations: () => api.get('/integrations/calendar/'),
    getCalendarIntegration: (id: string) => api.get(`/integrations/calendar/${id}/`),
    updateCalendarIntegration: (id: string, data: any) => api.patch(`/integrations/calendar/${id}/`, data),
    deleteCalendarIntegration: (id: string) => api.delete(`/integrations/calendar/${id}/`),
    refreshCalendarSync: (id: string) => api.post(`/integrations/calendar/${id}/refresh/`),
    forceCalendarSync: (id: string) => api.post(`/integrations/calendar/${id}/force-sync/`),
    
    // Video integrations
    getVideoIntegrations: () => api.get('/integrations/video/'),
    getVideoIntegration: (id: string) => api.get(`/integrations/video/${id}/`),
    updateVideoIntegration: (id: string, data: any) => api.patch(`/integrations/video/${id}/`, data),
    deleteVideoIntegration: (id: string) => api.delete(`/integrations/video/${id}/`),
    
    // Webhook integrations
    getWebhooks: () => api.get('/integrations/webhooks/'),
    createWebhook: (data: any) => api.post('/integrations/webhooks/', data),
    getWebhook: (id: string) => api.get(`/integrations/webhooks/${id}/`),
    updateWebhook: (id: string, data: any) => api.patch(`/integrations/webhooks/${id}/`, data),
    deleteWebhook: (id: string) => api.delete(`/integrations/webhooks/${id}/`),
    testWebhook: (id: string) => api.post(`/integrations/webhooks/${id}/test/`),
    
    // OAuth flows
    initiateOauth: (data: { 
      provider: string; 
      integration_type: string; 
      redirect_uri: string 
    }) => api.post('/integrations/oauth/initiate/', data),
    
    oauthCallback: (data: { 
      provider: string; 
      integration_type: string; 
      code: string; 
      state?: string 
    }) => api.post('/integrations/oauth/callback/', data),
    
    // Health and monitoring
    getIntegrationHealth: () => api.get('/integrations/health/'),
    getIntegrationLogs: () => api.get('/integrations/logs/'),
    getCalendarConflicts: () => api.get('/integrations/calendar/conflicts/'),
  };

  // Workflow endpoints
  static workflows = {
    getWorkflows: () => api.get('/workflows/'),
    createWorkflow: (data: any) => api.post('/workflows/', data),
    getWorkflow: (id: string) => api.get(`/workflows/${id}/`),
    updateWorkflow: (id: string, data: any) => api.patch(`/workflows/${id}/`, data),
    deleteWorkflow: (id: string) => api.delete(`/workflows/${id}/`),
    duplicateWorkflow: (id: string) => api.post(`/workflows/${id}/duplicate/`),
    
    // Workflow actions
    getWorkflowActions: (workflowId: string) => api.get(`/workflows/${workflowId}/actions/`),
    createWorkflowAction: (workflowId: string, data: any) =>
      api.post(`/workflows/${workflowId}/actions/`, data),
    getWorkflowAction: (id: string) => api.get(`/workflows/actions/${id}/`),
    updateWorkflowAction: (id: string, data: any) => api.patch(`/workflows/actions/${id}/`, data),
    deleteWorkflowAction: (id: string) => api.delete(`/workflows/actions/${id}/`),
    
    // Testing and validation
    testWorkflow: (id: string, data: any) => api.post(`/workflows/${id}/test/`, data),
    validateWorkflow: (id: string) => api.post(`/workflows/${id}/validate/`),
    getExecutionSummary: (id: string) => api.get(`/workflows/${id}/execution-summary/`),
    
    // Executions
    getExecutions: () => api.get('/workflows/executions/'),
    
    // Templates
    getTemplates: () => api.get('/workflows/templates/'),
    createFromTemplate: (data: any) => api.post('/workflows/templates/create-from/', data),
    
    // Bulk operations
    bulkTest: (data: any) => api.post('/workflows/bulk-test/', data),
    getPerformanceStats: () => api.get('/workflows/performance-stats/'),
  };

  // Notification endpoints
  static notifications = {
    // Templates
    getTemplates: () => api.get('/notifications/templates/'),
    createTemplate: (data: any) => api.post('/notifications/templates/', data),
    getTemplate: (id: string) => api.get(`/notifications/templates/${id}/`),
    updateTemplate: (id: string, data: any) => api.patch(`/notifications/templates/${id}/`, data),
    deleteTemplate: (id: string) => api.delete(`/notifications/templates/${id}/`),
    testTemplate: (id: string) => api.post(`/notifications/templates/${id}/test/`),
    
    // Preferences
    getPreferences: () => api.get('/notifications/preferences/'),
    updatePreferences: (data: any) => api.patch('/notifications/preferences/', data),
    
    // Logs
    getLogs: () => api.get('/notifications/logs/'),
    resendNotification: (id: string) => api.post(`/notifications/${id}/resend/`),
    
    // Scheduled notifications
    getScheduled: () => api.get('/notifications/scheduled/'),
    cancelScheduled: (id: string) => api.post(`/notifications/scheduled/${id}/cancel/`),
    
    // Manual sending
    sendNotification: (data: any) => api.post('/notifications/send/', data),
    
    // Statistics
    getStats: () => api.get('/notifications/stats/'),
    getHealth: () => api.get('/notifications/health/'),
  };

  // Contact endpoints
  static contacts = {
    getContacts: (params?: any) => api.get('/contacts/', { params }),
    createContact: (data: any) => api.post('/contacts/', data),
    getContact: (id: string) => api.get(`/contacts/${id}/`),
    updateContact: (id: string, data: any) => api.patch(`/contacts/${id}/`, data),
    deleteContact: (id: string) => api.delete(`/contacts/${id}/`),
    
    // Contact interactions
    getContactInteractions: (contactId: string) => api.get(`/contacts/${contactId}/interactions/`),
    addContactInteraction: (contactId: string, data: any) =>
      api.post(`/contacts/${contactId}/interactions/add/`, data),
    
    // Contact groups
    getGroups: () => api.get('/contacts/groups/'),
    createGroup: (data: any) => api.post('/contacts/groups/', data),
    getGroup: (id: string) => api.get(`/contacts/groups/${id}/`),
    updateGroup: (id: string, data: any) => api.patch(`/contacts/groups/${id}/`, data),
    deleteGroup: (id: string) => api.delete(`/contacts/groups/${id}/`),
    addContactToGroup: (contactId: string, groupId: string) =>
      api.post(`/contacts/${contactId}/groups/${groupId}/add/`),
    removeContactFromGroup: (contactId: string, groupId: string) =>
      api.post(`/contacts/${contactId}/groups/${groupId}/remove/`),
    
    // Import/Export
    importContacts: (data: FormData) => api.post('/contacts/import/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    exportContacts: () => api.get('/contacts/export/', { responseType: 'blob' }),
    
    // Merging
    mergeContacts: (data: { primary_contact_id: string; duplicate_contact_ids: string[] }) =>
      api.post('/contacts/merge/', data),
    
    // Statistics
    getStats: () => api.get('/contacts/stats/'),
  };
}

export default api;
export { api };