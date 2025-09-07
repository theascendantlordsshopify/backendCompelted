// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/users/login/',
  REGISTER: '/users/register/',
  LOGOUT: '/users/logout/',
  VERIFY_EMAIL: '/users/verify-email/',
  REQUEST_PASSWORD_RESET: '/users/request-password-reset/',
  CONFIRM_PASSWORD_RESET: '/users/confirm-password-reset/',
  CHANGE_PASSWORD: '/users/change-password/',
  
  // Profile
  PROFILE: '/users/profile/',
  PUBLIC_PROFILE: (slug: string) => `/users/public/${slug}/`,
  
  // MFA
  MFA_DEVICES: '/users/mfa/devices/',
  MFA_SETUP: '/users/mfa/setup/',
  MFA_VERIFY: '/users/mfa/verify/',
  MFA_DISABLE: '/users/mfa/disable/',
  MFA_BACKUP_CODES: '/users/mfa/backup-codes/regenerate/',
  
  // Sessions
  SESSIONS: '/users/sessions/',
  REVOKE_SESSION: (id: string) => `/users/sessions/${id}/revoke/`,
  REVOKE_ALL_SESSIONS: '/users/sessions/revoke-all/',
  
  // Event Types
  EVENT_TYPES: '/events/event-types/',
  EVENT_TYPE: (id: string) => `/events/event-types/${id}/`,
  
  // Public booking
  PUBLIC_ORGANIZER: (slug: string) => `/events/public/${slug}/`,
  PUBLIC_EVENT_TYPE: (organizerSlug: string, eventTypeSlug: string) => 
    `/events/public/${organizerSlug}/${eventTypeSlug}/`,
  AVAILABLE_SLOTS: (organizerSlug: string, eventTypeSlug: string) => 
    `/events/slots/${organizerSlug}/${eventTypeSlug}/`,
  
  // Bookings
  BOOKINGS: '/events/bookings/',
  BOOKING: (id: string) => `/events/bookings/${id}/`,
  CREATE_BOOKING: '/events/bookings/create/',
  BOOKING_MANAGEMENT: (token: string) => `/events/booking/${token}/manage/`,
  
  // Availability
  AVAILABILITY_RULES: '/availability/rules/',
  AVAILABILITY_RULE: (id: string) => `/availability/rules/${id}/`,
  DATE_OVERRIDES: '/availability/overrides/',
  DATE_OVERRIDE: (id: string) => `/availability/overrides/${id}/`,
  BLOCKED_TIMES: '/availability/blocked/',
  BLOCKED_TIME: (id: string) => `/availability/blocked/${id}/`,
  RECURRING_BLOCKS: '/availability/recurring-blocks/',
  RECURRING_BLOCK: (id: string) => `/availability/recurring-blocks/${id}/`,
  BUFFER_SETTINGS: '/availability/buffer/',
  
  // Integrations
  CALENDAR_INTEGRATIONS: '/integrations/calendar/',
  VIDEO_INTEGRATIONS: '/integrations/video/',
  WEBHOOKS: '/integrations/webhooks/',
  OAUTH_INITIATE: '/integrations/oauth/initiate/',
  OAUTH_CALLBACK: '/integrations/oauth/callback/',
  
  // Workflows
  WORKFLOWS: '/workflows/',
  WORKFLOW: (id: string) => `/workflows/${id}/`,
  WORKFLOW_ACTIONS: (workflowId: string) => `/workflows/${workflowId}/actions/`,
  
  // Notifications
  NOTIFICATION_TEMPLATES: '/notifications/templates/',
  NOTIFICATION_PREFERENCES: '/notifications/preferences/',
  NOTIFICATION_LOGS: '/notifications/logs/',
  
  // Contacts
  CONTACTS: '/contacts/',
  CONTACT: (id: string) => `/contacts/${id}/`,
  CONTACT_GROUPS: '/contacts/groups/',
} as const;

// Application constants
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Calendly Clone',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  DESCRIPTION: 'Enterprise-grade scheduling platform',
  SUPPORT_EMAIL: 'support@calendlyclone.com',
  COMPANY_NAME: 'Calendly Clone Inc.',
} as const;

// Feature flags
export const FEATURES = {
  SSO: process.env.NEXT_PUBLIC_ENABLE_SSO === 'true',
  MFA: process.env.NEXT_PUBLIC_ENABLE_MFA === 'true',
  WORKFLOWS: process.env.NEXT_PUBLIC_ENABLE_WORKFLOWS === 'true',
  INTEGRATIONS: process.env.NEXT_PUBLIC_ENABLE_INTEGRATIONS === 'true',
  REAL_TIME: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME === 'true',
  ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const;

// UI constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  
  // Animation durations (in ms)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 200,
  ANIMATION_SLOW: 300,
  
  // Debounce delays (in ms)
  SEARCH_DEBOUNCE: 300,
  INPUT_DEBOUNCE: 500,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Time constants
export const TIME_CONFIG = {
  WEEKDAYS: [
    { value: 0, label: 'Monday', short: 'Mon' },
    { value: 1, label: 'Tuesday', short: 'Tue' },
    { value: 2, label: 'Wednesday', short: 'Wed' },
    { value: 3, label: 'Thursday', short: 'Thu' },
    { value: 4, label: 'Friday', short: 'Fri' },
    { value: 5, label: 'Saturday', short: 'Sat' },
    { value: 6, label: 'Sunday', short: 'Sun' },
  ],
  
  DURATIONS: [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
  ],
  
  TIMEZONES: [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ],
} as const;

// Status constants
export const STATUS_CONFIG = {
  ACCOUNT_STATUS: {
    active: { label: 'Active', color: 'green' },
    inactive: { label: 'Inactive', color: 'gray' },
    suspended: { label: 'Suspended', color: 'red' },
    pending_verification: { label: 'Pending Verification', color: 'yellow' },
    password_expired: { label: 'Password Expired', color: 'orange' },
    password_expired_grace_period: { label: 'Password Expired (Grace)', color: 'orange' },
  },
  
  BOOKING_STATUS: {
    confirmed: { label: 'Confirmed', color: 'blue' },
    cancelled: { label: 'Cancelled', color: 'red' },
    rescheduled: { label: 'Rescheduled', color: 'yellow' },
    completed: { label: 'Completed', color: 'green' },
    no_show: { label: 'No Show', color: 'gray' },
  },
  
  INTEGRATION_STATUS: {
    connected: { label: 'Connected', color: 'green' },
    disconnected: { label: 'Disconnected', color: 'red' },
    error: { label: 'Error', color: 'red' },
    syncing: { label: 'Syncing', color: 'blue' },
    token_expired: { label: 'Token Expired', color: 'orange' },
  },
  
  WORKFLOW_STATUS: {
    active: { label: 'Active', color: 'green' },
    inactive: { label: 'Inactive', color: 'gray' },
    draft: { label: 'Draft', color: 'yellow' },
  },
  
  NOTIFICATION_STATUS: {
    pending: { label: 'Pending', color: 'yellow' },
    sent: { label: 'Sent', color: 'blue' },
    delivered: { label: 'Delivered', color: 'green' },
    failed: { label: 'Failed', color: 'red' },
    bounced: { label: 'Bounced', color: 'red' },
    opened: { label: 'Opened', color: 'green' },
    clicked: { label: 'Clicked', color: 'green' },
  },
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 254,
  PHONE_MAX_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 1000,
  WEBHOOK_URL_MAX_LENGTH: 2048,
  
  // Regex patterns
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s\-\(\)]{10,}$/,
  URL_PATTERN: /^https?:\/\/.+/,
  SLUG_PATTERN: /^[a-z0-9-]+$/,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  TERMS_REQUIRED: 'You must accept the terms and conditions',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'The requested resource was not found',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGOUT_SUCCESS: 'Successfully logged out',
  REGISTER_SUCCESS: 'Account created successfully. Please check your email to verify your account.',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  MFA_ENABLED: 'Multi-factor authentication enabled successfully',
  MFA_DISABLED: 'Multi-factor authentication disabled successfully',
  SESSION_REVOKED: 'Session revoked successfully',
  INVITATION_SENT: 'Invitation sent successfully',
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  BOOKING_RESCHEDULED: 'Booking rescheduled successfully',
  INTEGRATION_CONNECTED: 'Integration connected successfully',
  WORKFLOW_CREATED: 'Workflow created successfully',
  NOTIFICATION_SENT: 'Notification sent successfully',
  CONTACT_CREATED: 'Contact created successfully',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_MODE: 'theme_mode',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  RECENT_SEARCHES: 'recent_searches',
  DRAFT_FORMS: 'draft_forms',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  // User
  USER_PROFILE: ['user', 'profile'],
  USER_SESSIONS: ['user', 'sessions'],
  USER_MFA_DEVICES: ['user', 'mfa', 'devices'],
  USER_AUDIT_LOGS: ['user', 'audit-logs'],
  
  // Event Types
  EVENT_TYPES: ['event-types'],
  EVENT_TYPE: (id: string) => ['event-types', id],
  PUBLIC_ORGANIZER: (slug: string) => ['public', 'organizer', slug],
  PUBLIC_EVENT_TYPE: (organizerSlug: string, eventTypeSlug: string) => 
    ['public', 'event-type', organizerSlug, eventTypeSlug],
  
  // Bookings
  BOOKINGS: ['bookings'],
  BOOKING: (id: string) => ['bookings', id],
  BOOKING_ANALYTICS: ['bookings', 'analytics'],
  AVAILABLE_SLOTS: (organizerSlug: string, eventTypeSlug: string, params: any) => 
    ['available-slots', organizerSlug, eventTypeSlug, params],
  
  // Availability
  AVAILABILITY_RULES: ['availability', 'rules'],
  DATE_OVERRIDES: ['availability', 'overrides'],
  BLOCKED_TIMES: ['availability', 'blocked'],
  RECURRING_BLOCKS: ['availability', 'recurring-blocks'],
  BUFFER_SETTINGS: ['availability', 'buffer'],
  AVAILABILITY_STATS: ['availability', 'stats'],
  
  // Integrations
  CALENDAR_INTEGRATIONS: ['integrations', 'calendar'],
  VIDEO_INTEGRATIONS: ['integrations', 'video'],
  WEBHOOKS: ['integrations', 'webhooks'],
  INTEGRATION_HEALTH: ['integrations', 'health'],
  INTEGRATION_LOGS: ['integrations', 'logs'],
  
  // Workflows
  WORKFLOWS: ['workflows'],
  WORKFLOW: (id: string) => ['workflows', id],
  WORKFLOW_ACTIONS: (workflowId: string) => ['workflows', workflowId, 'actions'],
  WORKFLOW_EXECUTIONS: ['workflows', 'executions'],
  WORKFLOW_TEMPLATES: ['workflows', 'templates'],
  
  // Notifications
  NOTIFICATION_TEMPLATES: ['notifications', 'templates'],
  NOTIFICATION_PREFERENCES: ['notifications', 'preferences'],
  NOTIFICATION_LOGS: ['notifications', 'logs'],
  NOTIFICATION_STATS: ['notifications', 'stats'],
  
  // Contacts
  CONTACTS: ['contacts'],
  CONTACT: (id: string) => ['contacts', id],
  CONTACT_GROUPS: ['contacts', 'groups'],
  CONTACT_STATS: ['contacts', 'stats'],
} as const;

// Theme configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    ENTERPRISE: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    TEAL: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
  },
  
  FONTS: {
    SANS: ['Inter', 'system-ui', 'sans-serif'],
    MONO: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  
  SHADOWS: {
    ENTERPRISE: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    ENTERPRISE_LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    ENTERPRISE_XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

// Permissions
export const PERMISSIONS = {
  // User management
  VIEW_USERS: 'can_view_users',
  CREATE_USERS: 'can_create_users',
  EDIT_USERS: 'can_edit_users',
  DELETE_USERS: 'can_delete_users',
  
  // Event management
  VIEW_EVENTS: 'can_view_events',
  CREATE_EVENTS: 'can_create_events',
  EDIT_EVENTS: 'can_edit_events',
  DELETE_EVENTS: 'can_delete_events',
  MANAGE_BOOKINGS: 'can_manage_bookings',
  
  // Administration
  VIEW_ADMIN: 'can_view_admin',
  MANAGE_ROLES: 'can_manage_roles',
  VIEW_AUDIT_LOGS: 'can_view_audit_logs',
  MANAGE_INTEGRATIONS: 'can_manage_integrations',
  
  // Billing
  VIEW_BILLING: 'can_view_billing',
  MANAGE_BILLING: 'can_manage_billing',
  
  // Reporting
  VIEW_REPORTS: 'can_view_reports',
  EXPORT_DATA: 'can_export_data',
} as const;

// Default values
export const DEFAULTS = {
  EVENT_TYPE: {
    DURATION: 30,
    MAX_ATTENDEES: 1,
    MIN_SCHEDULING_NOTICE: 60, // 1 hour
    MAX_SCHEDULING_HORIZON: 43200, // 30 days
    BUFFER_TIME_BEFORE: 0,
    BUFFER_TIME_AFTER: 0,
    SLOT_INTERVAL_MINUTES: 15,
    LOCATION_TYPE: 'video_call' as const,
  },
  
  AVAILABILITY: {
    START_TIME: '09:00',
    END_TIME: '17:00',
    BUFFER_BEFORE: 0,
    BUFFER_AFTER: 0,
    MINIMUM_GAP: 0,
    SLOT_INTERVAL: 15,
  },
  
  NOTIFICATION: {
    REMINDER_MINUTES_BEFORE: 60,
    DAILY_AGENDA_TIME: '08:00',
    MAX_REMINDERS_PER_DAY: 10,
  },
  
  WORKFLOW: {
    DELAY_MINUTES: 0,
  },
} as const;

// Integration providers
export const INTEGRATION_PROVIDERS = {
  CALENDAR: [
    { value: 'google', label: 'Google Calendar', icon: 'google' },
    { value: 'outlook', label: 'Microsoft Outlook', icon: 'microsoft' },
    { value: 'apple', label: 'Apple Calendar', icon: 'apple' },
  ],
  
  VIDEO: [
    { value: 'zoom', label: 'Zoom', icon: 'zoom' },
    { value: 'google_meet', label: 'Google Meet', icon: 'google' },
    { value: 'microsoft_teams', label: 'Microsoft Teams', icon: 'microsoft' },
    { value: 'webex', label: 'Cisco Webex', icon: 'webex' },
  ],
} as const;

// Workflow triggers and actions
export const WORKFLOW_CONFIG = {
  TRIGGERS: [
    { value: 'booking_created', label: 'Booking Created' },
    { value: 'booking_cancelled', label: 'Booking Cancelled' },
    { value: 'booking_completed', label: 'Booking Completed' },
    { value: 'before_meeting', label: 'Before Meeting' },
    { value: 'after_meeting', label: 'After Meeting' },
  ],
  
  ACTIONS: [
    { value: 'send_email', label: 'Send Email' },
    { value: 'send_sms', label: 'Send SMS' },
    { value: 'webhook', label: 'Trigger Webhook' },
    { value: 'update_booking', label: 'Update Booking' },
  ],
  
  RECIPIENTS: [
    { value: 'organizer', label: 'Organizer' },
    { value: 'invitee', label: 'Invitee' },
    { value: 'both', label: 'Both' },
    { value: 'custom', label: 'Custom Email' },
  ],
  
  CONDITION_OPERATORS: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' },
  ],
} as const;