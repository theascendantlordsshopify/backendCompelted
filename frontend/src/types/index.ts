// Base types
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

// User and Authentication types
export interface User extends BaseModel {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_organizer: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_mfa_enabled: boolean;
  account_status: 'active' | 'inactive' | 'suspended' | 'pending_verification' | 'password_expired' | 'password_expired_grace_period';
  roles: Role[];
  profile: Profile;
  last_login: string | null;
  date_joined: string;
}

export interface Profile extends BaseModel {
  organizer_slug: string;
  display_name: string;
  bio: string;
  profile_picture: string | null;
  phone: string;
  website: string;
  company: string;
  job_title: string;
  timezone_name: string;
  language: string;
  date_format: string;
  time_format: string;
  brand_color: string;
  brand_logo: string | null;
  public_profile: boolean;
  show_phone: boolean;
  show_email: boolean;
  reasonable_hours_start: number;
  reasonable_hours_end: number;
}

export interface Role extends BaseModel {
  name: string;
  role_type: 'admin' | 'organizer' | 'team_member' | 'billing_manager' | 'viewer';
  description: string;
  parent: string | null;
  parent_name: string;
  children_count: number;
  role_permissions: Permission[];
  total_permissions: number;
  is_system_role: boolean;
}

export interface Permission extends BaseModel {
  codename: string;
  name: string;
  description: string;
  category: string;
}

export interface MFADevice extends BaseModel {
  device_type: 'totp' | 'sms' | 'backup';
  device_type_display: string;
  name: string;
  phone_number: string;
  is_active: boolean;
  is_primary: boolean;
  last_used_at: string | null;
}

export interface UserSession extends BaseModel {
  session_key: string;
  ip_address: string;
  country: string;
  city: string;
  location: string;
  user_agent: string;
  device_info: Record<string, any>;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
  is_current: boolean;
  is_expired: boolean;
}

export interface Invitation extends BaseModel {
  invited_email: string;
  role: string;
  role_name: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invited_by_name: string;
  expires_at: string;
}

// Event types
export interface EventType extends BaseModel {
  organizer: User;
  name: string;
  event_type_slug: string;
  description: string;
  duration: number;
  max_attendees: number;
  enable_waitlist: boolean;
  is_active: boolean;
  is_private: boolean;
  min_scheduling_notice: number;
  max_scheduling_horizon: number;
  buffer_time_before: number;
  buffer_time_after: number;
  max_bookings_per_day: number | null;
  slot_interval_minutes: number;
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrence_rule: string;
  max_occurrences: number | null;
  recurrence_end_date: string | null;
  location_type: 'video_call' | 'phone_call' | 'in_person' | 'custom';
  location_details: string;
  redirect_url_after_booking: string;
  confirmation_workflow: string | null;
  reminder_workflow: string | null;
  cancellation_workflow: string | null;
  questions: CustomQuestion[];
  is_group_event: boolean;
  total_duration_with_buffers: number;
}

export interface CustomQuestion extends BaseModel {
  question_text: string;
  question_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'email' | 'phone' | 'number' | 'date' | 'time' | 'url';
  question_type_display: string;
  is_required: boolean;
  order: number;
  options: string[];
  conditions: any[];
  validation_rules: Record<string, any>;
}

export interface Booking extends BaseModel {
  event_type: EventType;
  organizer: User;
  invitee_name: string;
  invitee_email: string;
  invitee_phone: string;
  invitee_timezone: string;
  attendee_count: number;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'no_show';
  status_display: string;
  recurrence_id: string | null;
  is_recurring_exception: boolean;
  recurrence_sequence: number | null;
  custom_answers: Record<string, any>;
  meeting_link: string;
  meeting_id: string;
  meeting_password: string;
  calendar_sync_status: 'pending' | 'succeeded' | 'failed' | 'not_required';
  attendees: Attendee[];
  duration_minutes: number;
  can_cancel: boolean;
  can_reschedule: boolean;
  is_access_token_valid: boolean;
  cancelled_at: string | null;
  cancelled_by: 'organizer' | 'invitee' | 'system' | null;
  cancellation_reason: string;
  rescheduled_at: string | null;
}

export interface Attendee extends BaseModel {
  name: string;
  email: string;
  phone: string;
  status: 'confirmed' | 'cancelled' | 'no_show';
  status_display: string;
  custom_answers: Record<string, any>;
  joined_at: string;
  cancelled_at: string | null;
  cancellation_reason: string;
}

// Availability types
export interface AvailabilityRule extends BaseModel {
  day_of_week: number;
  day_of_week_display: string;
  start_time: string;
  end_time: string;
  event_types: string[];
  event_types_count: number;
  spans_midnight: boolean;
  is_active: boolean;
}

export interface DateOverrideRule extends BaseModel {
  date: string;
  is_available: boolean;
  start_time: string | null;
  end_time: string | null;
  event_types: string[];
  event_types_count: number;
  spans_midnight: boolean;
  reason: string;
  is_active: boolean;
}

export interface BlockedTime extends BaseModel {
  start_datetime: string;
  end_datetime: string;
  reason: string;
  source: 'manual' | 'google_calendar' | 'outlook_calendar' | 'apple_calendar' | 'external_sync';
  source_display: string;
  external_id: string;
  external_updated_at: string | null;
  is_active: boolean;
}

export interface RecurringBlockedTime extends BaseModel {
  name: string;
  day_of_week: number;
  day_of_week_display: string;
  start_time: string;
  end_time: string;
  start_date: string | null;
  end_date: string | null;
  spans_midnight: boolean;
  is_active: boolean;
}

export interface BufferTimeSettings {
  default_buffer_before: number;
  default_buffer_after: number;
  minimum_gap: number;
  slot_interval_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
  duration_minutes: number;
  local_start_time?: string;
  local_end_time?: string;
  invitee_times?: Record<string, any>;
  fairness_score?: number;
}

// Integration types
export interface CalendarIntegration extends BaseModel {
  provider: 'google' | 'outlook' | 'apple';
  provider_display: string;
  provider_email: string;
  calendar_id: string;
  is_active: boolean;
  sync_enabled: boolean;
  is_token_expired: boolean;
}

export interface VideoConferenceIntegration extends BaseModel {
  provider: 'zoom' | 'google_meet' | 'microsoft_teams' | 'webex';
  provider_display: string;
  provider_email: string;
  is_active: boolean;
  auto_generate_links: boolean;
  is_token_expired: boolean;
}

export interface WebhookIntegration extends BaseModel {
  name: string;
  webhook_url: string;
  events: string[];
  secret_key: string;
  headers: Record<string, string>;
  is_active: boolean;
  retry_failed: boolean;
  max_retries: number;
}

export interface IntegrationLog extends BaseModel {
  log_type: 'calendar_sync' | 'video_link_created' | 'webhook_sent' | 'error';
  log_type_display: string;
  integration_type: string;
  booking_id: string | null;
  message: string;
  details: Record<string, any>;
  success: boolean;
}

// Workflow types
export interface Workflow extends BaseModel {
  name: string;
  description: string;
  trigger: 'booking_created' | 'booking_cancelled' | 'booking_completed' | 'before_meeting' | 'after_meeting';
  trigger_display: string;
  event_types_count: number;
  delay_minutes: number;
  is_active: boolean;
  success_rate: number;
  execution_stats: {
    total_executions: number;
    successful_executions: number;
    failed_executions: number;
    last_executed_at: string | null;
  };
  actions: WorkflowAction[];
}

export interface WorkflowAction extends BaseModel {
  name: string;
  action_type: 'send_email' | 'send_sms' | 'webhook' | 'update_booking';
  action_type_display: string;
  order: number;
  recipient: 'organizer' | 'invitee' | 'both' | 'custom';
  recipient_display: string;
  custom_email: string;
  subject: string;
  message: string;
  webhook_url: string;
  webhook_data: Record<string, any>;
  conditions: any[];
  update_booking_fields: Record<string, any>;
  is_active: boolean;
  success_rate: number;
  execution_stats: {
    total_executions: number;
    successful_executions: number;
    failed_executions: number;
    last_executed_at: string | null;
  };
}

export interface WorkflowExecution extends BaseModel {
  workflow_name: string;
  booking_invitee: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  status_display: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string;
  actions_executed: number;
  actions_failed: number;
  execution_log: any[];
  execution_summary: any;
  execution_time_seconds: number | null;
}

// Notification types
export interface NotificationTemplate extends BaseModel {
  name: string;
  template_type: 'booking_confirmation' | 'booking_reminder' | 'booking_cancellation' | 'booking_rescheduled' | 'follow_up' | 'custom';
  template_type_display: string;
  notification_type: 'email' | 'sms';
  notification_type_display: string;
  subject: string;
  message: string;
  is_active: boolean;
  is_default: boolean;
}

export interface NotificationLog extends BaseModel {
  booking_id: string | null;
  template_name: string;
  notification_type: 'email' | 'sms';
  notification_type_display: string;
  recipient_email: string;
  recipient_phone: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened' | 'clicked';
  status_display: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  error_message: string;
  retry_count: number;
}

export interface NotificationPreference {
  booking_confirmations_email: boolean;
  booking_reminders_email: boolean;
  booking_cancellations_email: boolean;
  daily_agenda_email: boolean;
  booking_confirmations_sms: boolean;
  booking_reminders_sms: boolean;
  booking_cancellations_sms: boolean;
  reminder_minutes_before: number;
  daily_agenda_time: string;
  created_at: string;
  updated_at: string;
}

// Contact types
export interface Contact extends BaseModel {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  notes: string;
  tags: string[];
  total_bookings: number;
  last_booking_date: string | null;
  groups_count: number;
  is_active: boolean;
}

export interface ContactGroup extends BaseModel {
  name: string;
  description: string;
  color: string;
  contact_count: number;
  contacts: Contact[];
}

export interface ContactInteraction extends BaseModel {
  contact_name: string;
  interaction_type: 'booking_created' | 'booking_completed' | 'booking_cancelled' | 'email_sent' | 'note_added' | 'manual_entry';
  interaction_type_display: string;
  description: string;
  booking_id: string | null;
  metadata: Record<string, any>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface RegisterFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
}

export interface BookingFormData {
  organizer_slug: string;
  event_type_slug: string;
  invitee_name: string;
  invitee_email: string;
  invitee_phone: string;
  invitee_timezone: string;
  attendee_count: number;
  start_time: string;
  custom_answers: Record<string, any>;
  attendees_data?: Array<{
    name: string;
    email: string;
    phone: string;
    custom_answers: Record<string, any>;
  }>;
}

// Error types
export interface ApiError {
  message: string;
  details?: string;
  field_errors?: Record<string, string[]>;
  status_code?: number;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
  permission?: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Calendar types
export interface CalendarSlot {
  start_time: string;
  end_time: string;
  available: boolean;
  duration_minutes: number;
  local_start_time?: string;
  local_end_time?: string;
}

export interface CalendarDay {
  date: string;
  slots: CalendarSlot[];
  is_available: boolean;
  is_past: boolean;
  is_today: boolean;
}

// Statistics types
export interface BookingAnalytics {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  completed_bookings: number;
  no_show_bookings: number;
  calendar_sync_success: number;
  calendar_sync_failed: number;
  calendar_sync_pending: number;
  bookings_by_event_type: Array<{ event_type__name: string; count: number }>;
  cancellations_by_actor: Array<{ cancelled_by: string; count: number }>;
  group_event_stats: {
    total_group_bookings: number;
    average_attendees: number;
  };
}

export interface AvailabilityStats {
  total_rules: number;
  active_rules: number;
  total_overrides: number;
  total_blocks: number;
  total_recurring_blocks: number;
  average_weekly_hours: number;
  busiest_day: string;
  daily_hours: Record<string, number>;
  cache_hit_rate: number;
  performance_summary?: Record<string, any>;
}

export interface NotificationStats {
  total_notifications: number;
  total_sent: number;
  total_failed: number;
  total_pending: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  email_count: number;
  sms_count: number;
  email_delivery_rate: number;
  email_open_rate: number;
  email_click_rate: number;
  sms_delivery_rate: number;
  recent_activity: Record<string, number>;
  top_templates: Array<{ template__name: string; usage_count: number }>;
  preferences: Record<string, any>;
}

export interface ContactStats {
  total_contacts: number;
  active_contacts: number;
  total_groups: number;
  recent_interactions: number;
  top_companies: Array<{ company: string; count: number }>;
  booking_frequency: Record<string, number>;
}