# Frontend Development Plan: Enterprise-Grade Calendly Clone

This document outlines the phased development plan for the enterprise-grade frontend, focusing on a professional, polished, and obsessively detailed user experience. Each task includes acceptance criteria, relevant backend references, and considerations for edge cases.

---

## Theme & Design Principles

**Overall Aesthetic:** Subtle, elegant, enterprise palette. Neutral base (off-white/soft gray), deep charcoal for text, a single confident accent (muted indigo or teal), and warm rounded UI touches. Inspired by Stripe + Notion: minimal, generous spacing, clean typography, and sophisticated motion.

**UX Flourishes:** Fluid micro-animations for transitions, subtle elevation shadows, real-time inline validation, and a “spotlight” command palette for power users. Accessibility-first contrast and motion-reduced alternatives.

**Accessibility:** High contrast, keyboard navigation, screen reader compatibility, and motion-reduced alternatives.

**Responsiveness:** Mobile-first breakpoints with desktop-optimized workflows. Complex admin tasks can have richer desktop experiences, while mobile must be flawless for core actions.

---

## Phase 1: Initialization & Backend Mapping

**Objective:** Establish the foundational frontend project, deeply understand the existing backend architecture, and define precise frontend requirements per backend application.

### 1.1. Backend Architecture Mapping (Internal Analysis & Documentation)

**Description:** Revisit the entire backend codebase to map its architecture, services, APIs, models, and features. This involves a deep dive into each Django app's functionality, business logic, API contracts, validations, and edge cases. This understanding will directly inform the frontend requirements.

**Acceptance Criteria:**
*   Comprehensive internal understanding of all backend apps (`users`, `events`, `availability`, `integrations`, `workflows`, `notifications`, `contacts`).
*   Clear mental model of data flows, API request/response structures, and business logic.
*   Identification of all relevant backend endpoints and their expected behavior for frontend consumption.

**Considerations:** This is an ongoing process that will refine frontend tasks in subsequent steps.

### 1.2. Frontend Project Scaffold & Core Setup

**Description:** Initialize the Next.js project with TypeScript, configure Tailwind CSS, and set up essential development tools.

**Tasks:**
*   **1.2.1. Create Next.js Project:**
    *   `npx create-next-app@latest --typescript --tailwind --eslint --app --src --use-pnpm` (or equivalent for `pages` router if preferred, but `app` router is generally recommended for new projects).
    *   **AC:** Project directory created with basic Next.js structure.
*   **1.2.2. Configure Tailwind CSS:**
    *   Verify `tailwind.config.ts` and `globals.css` are correctly set up for utility-first styling.
    *   **AC:** Tailwind classes are applied correctly in a test component.
*   **1.2.3. Install Radix UI / shadcn/ui:**
    *   Integrate `shadcn/ui` components (or directly use Radix primitives) for accessible, unstyled components.
    *   **AC:** A basic `Button` component from `shadcn/ui` is installed and rendered.
*   **1.2.4. Set up ESLint & Prettier:**
    *   Configure linting rules and code formatting for consistent code style.
    *   **AC:** Codebase adheres to defined linting and formatting rules.
*   **1.2.5. Implement Husky Commit Hooks:**
    *   Configure pre-commit hooks for linting and formatting checks.
    *   **AC:** Commits trigger linting/formatting checks automatically.
*   **1.2.6. Integrate Storybook:**
    *   Set up Storybook for isolated component development and QA.
    *   **AC:** A sample component is rendered in Storybook.
*   **1.2.7. Add Testing Libraries:**
    *   Install Playwright for e2e testing and React Testing Library for unit/integration testing.
    *   **AC:** Basic test files are configured and run successfully.
*   **1.2.8. Define Folder Structure:**
    *   Establish a clear and scalable folder structure (e.g., `src/app`, `src/components`, `src/lib`, `src/hooks`, `src/styles`, `src/types`, `src/api`).
    *   **AC:** Logical separation of concerns within the project directory.
*   **1.2.9. Environment Variables Setup:**
    *   Configure `.env.local` and `.env.production` for API base URLs and other sensitive configurations.
    *   **AC:** Frontend can access backend API URL via environment variables.

### 1.3. Backend Cleanup (Suggested for User)

**Description:** Delete files and modules from the backend that are not strictly required for development or future functionality, to streamline the codebase. This is a suggestion based on the user's prompt and should be performed by the user with their backup.

**Tasks:**
*   **1.3.1. Remove Unused Django Apps:**
    *   Identify and remove any `apps/` directories that are not actively used or planned for the current scope (e.g., if `contacts` or `workflows` are not in the immediate MVP).
    *   **AC:** Unused app directories and their references in `INSTALLED_APPS` are removed.
*   **1.3.2. Prune Management Commands:**
    *   Delete management commands (`apps/*/management/commands/`) that are not essential for the core application or are purely for one-off administrative tasks that won't be automated.
    *   **AC:** Non-essential management command files are removed.
*   **1.3.3. Clean Up Test Files:**
    *   Remove `tests.py` files or `tests/` directories if they are not actively maintained or are for features outside the current development focus.
    *   **AC:** Test files not relevant to current development are removed.
*   **1.3.4. Remove Redundant Models/Fields:**
    *   Based on the deep analysis, identify any models or fields that are clearly deprecated, unused, or redundant for the defined feature set. (Requires careful review and confirmation).
    *   **AC:** Database migrations are prepared to remove identified redundant models/fields.
*   **1.3.5. Streamline Configuration Files:**
    *   Remove commented-out code, unused settings, or redundant configurations from `config/settings/` and `config/urls.py`.
    *   **AC:** Configuration files are clean and concise.

**Considerations:** This step is purely advisory and should be executed by the user with caution, relying on their existing backups.

### 1.4. Frontend Requirements per Backend App

**Objective:** For each backend app, analyze its deep functionality and define the exact pages, components, and interactions the frontend must provide.

#### 1.4.1. `apps/users` (Authentication, Profile, Roles, MFA, Sessions, Audit)

**Backend Functionality:** User registration, login, logout, password management (change, reset, expiry), email verification, profile management, RBAC (roles, permissions), MFA (TOTP, SMS, backup codes), user sessions, audit logs, invitations (send, respond), SSO (SAML, OIDC).

**Frontend Requirements:**

*   **Pages:**
    *   `/login`: Login form (email/password), "Forgot Password" link, "Sign Up" link, SSO discovery input.
    *   `/signup`: Registration form (email, name, password, terms), "Login" link.
    *   `/forgot-password`: Email input for password reset request.
    *   `/reset-password`: Token + new password input.
    *   `/verify-email`: Page to handle email verification token.
    *   `/settings/profile`: User profile details (display name, bio, picture, contact info, company, job title, timezone, language, branding, privacy).
    *   `/settings/security`: Password change, MFA setup/management, session management.
    *   `/settings/roles`: Role and permission viewing (for admins).
    *   `/settings/invitations`: Manage sent invitations (for admins).
    *   `/settings/audit-logs`: View user-specific audit logs.
    *   `/invitation`: Page to accept/decline invitations.
*   **Components:**
    *   `LoginForm`: Handles email/password and initiates SSO flow.
    *   `SignupForm`: Handles user registration.
    *   `ForgotPasswordForm`, `ResetPasswordForm`.
    *   `ProfileForm`: For editing user profile.
    *   `ChangePasswordForm`.
    *   `MFAEnrollmentWizard`: Guided setup for TOTP (QR code, manual key) and SMS (phone input, code verification).
    *   `MFADeviceList`: Displays active MFA devices.
    *   `BackupCodeDisplay`: Shows generated backup codes.
    *   `SessionList`: Displays active user sessions with revoke option.
    *   `InvitationList`: Table to display sent invitations.
    *   `InvitationResponseForm`: For accepting/declining invitations.
    *   `AuditLogTable`: Displays user audit trail.
    *   `RolePermissionViewer`: Displays roles and their associated permissions.
*   **Interactions:**
    *   **Login:**
        *   User enters email, system checks for associated SSO config.
        *   If SSO, prompt for SSO login or "use email instead".
        *   If email/password, authenticate.
        *   Handle 2FA prompt if enabled.
        *   Handle account locked/suspended states.
        *   Handle password expiry/grace period.
        *   **Backend Ref:** `users/views.py:login_view`, `users/serializers.py:LoginSerializer`, `users/models.py:User` (account_status, is_mfa_enabled, password_expires_at), `users/backends.py` (SSO).
        *   **Edge Cases:** Invalid credentials, locked account, unverified email, expired password, MFA required, SSO redirect failures.
    *   **Signup:**
        *   User provides details, account created as `pending_verification`.
        *   Email verification link sent.
        *   **Backend Ref:** `users/views.py:RegisterView`, `users/serializers.py:UserRegistrationSerializer`, `users/tasks.py:send_verification_email`.
        *   **Edge Cases:** Email already exists, invalid input, email sending failure.
    *   **SSO:**
        *   Initiate SSO flow (redirect to IdP).
        *   Handle IdP callback (token exchange, user info retrieval, JIT provisioning/user update).
        *   Create/manage SSO session.
        *   **Backend Ref:** `users/views.py:initiate_sso`, `users/views.py:sso_discovery`, `users/backends.py:CustomSAMLBackend`, `users/backends.py:CustomOIDCBackend`, `users/models.py:SAMLConfiguration`, `users/models.py:OIDCConfiguration`, `users/models.py:SSOSession`.
        *   **Edge Cases:** IdP unreachable, invalid SSO config, user not provisioned, session expiry, IdP-initiated login.
    *   **Profile Update:**
        *   User updates profile details.
        *   **Backend Ref:** `users/views.py:ProfileView`, `users/serializers.py:ProfileUpdateSerializer`.
        *   **Edge Cases:** Invalid input, image upload errors.
    *   **MFA:**
        *   TOTP: Display QR code/secret, verify OTP.
        *   SMS: Send code, verify code.
        *   Backup codes: Generate, verify, consume.
        *   Disable MFA (requires password confirmation).
        *   **Backend Ref:** `users/views.py:setup_mfa`, `users/views.py:verify_mfa_setup`, `users/views.py:disable_mfa`, `users/views.py:regenerate_backup_codes`, `users/tasks.py:send_sms_verification`, `users/models.py:User` (mfa_secret, mfa_backup_codes), `users/models.py:MFADevice`.
        *   **Edge Cases:** Invalid OTP, rate limiting on SMS, lost device, backup code reuse.
    *   **Team Invitations:**
        *   Admin sends invitation (email, role).
        *   Invitee accepts/declines (existing user logs in, new user registers).
        *   **Backend Ref:** `users/views.py:InvitationListCreateView`, `users/views.py:respond_to_invitation`, `users/models.py:Invitation`.
        *   **Edge Cases:** Expired invitation, email already registered, invalid role.
    *   **Session Management:**
        *   Display active sessions (IP, device, last activity).
        *   Revoke individual sessions or all other sessions.
        *   **Backend Ref:** `users/views.py:UserSessionListView`, `users/views.py:revoke_session`, `users/views.py:revoke_all_sessions`, `users/models.py:UserSession`.
        *   **Edge Cases:** Current session revocation attempt, network changes affecting IP.

#### 1.4.2. `apps/events` (Event Types, Bookings, Attendees, Waitlist, Questions)

**Backend Functionality:** Event type definition (duration, attendees, recurrence, location, buffers, scheduling notice, daily limits, custom questions), booking creation, booking management (status, cancellation, rescheduling), attendee management, waitlist functionality, booking audit logs.

**Frontend Requirements:**

*   **Pages:**
    *   `/event-types`: List of all event types for the organizer.
    *   `/event-types/new`: Form to create a new event type.
    *   `/event-types/[slug]/edit`: Form to edit an existing event type.
    *   `/bookings`: List of all bookings for the organizer.
    *   `/bookings/[id]`: Detailed view of a single booking.
    *   `/public/[organizer_slug]`: Public organizer page (list of public event types).
    *   `/public/[organizer_slug]/[event_type_slug]`: Public event type booking page (availability calendar, booking form, custom questions).
    *   `/booking/[access_token]/manage`: Public booking management page (cancel, reschedule).
*   **Components:**
    *   `EventTypeCard/List`: Displays event types with quick actions.
    *   `EventTypeForm`: Multi-step form for event type creation/editing.
    *   `BookingCalendar`: Displays available slots for a given event type.
    *   `BookingForm`: Collects invitee details and custom answers.
    *   `CustomQuestionRenderer`: Dynamically renders custom questions based on type/conditions.
    *   `BookingList/Table`: Displays bookings with filters and search.
    *   `BookingDetails`: Shows all booking information.
    *   `AttendeeList`: For group bookings, manage attendees.
    *   `WaitlistForm`: For full events, allows joining waitlist.
    *   `BookingManagementPanel`: For public booking management (cancel/reschedule buttons).
    *   `BookingAuditLogTable`: Displays audit trail for a specific booking.
*   **Interactions:**
    *   **Event Type Management:**
        *   Create/edit event types with all configurable fields.
        *   Generate unique slugs.
        *   **Backend Ref:** `events/views.py:EventTypeListCreateView`, `events/views.py:EventTypeDetailView`, `events/serializers.py:EventTypeSerializer`, `events/serializers.py:EventTypeCreateSerializer`, `events/models.py:EventType`, `events/models.py:CustomQuestion`.
        *   **Edge Cases:** Invalid duration/buffer combinations, max attendees < 1, slug conflicts.
    *   **Public Booking Flow:**
        *   Display organizer's public event types.
        *   Select event type, view availability calendar.
        *   Select a slot, fill booking form (invitee details, custom questions).
        *   Handle group events (attendee count, waitlist).
        *   **Backend Ref:** `events/views.py:public_organizer_page`, `events/views.py:public_event_type_page`, `events/views.py:create_booking`, `events/views.py:get_available_slots_api`, `events/serializers.py:PublicEventTypeSerializer`, `events/serializers.py:BookingCreateSerializer`, `events/models.py:Booking`, `events/models.py:WaitlistEntry`.
        *   **Edge Cases:** No slots available, slot becomes unavailable during booking, waitlist full, invalid custom answers, rate limiting.
    *   **Booking Management (Organizer):**
        *   View all bookings, filter by status/date.
        *   View booking details, update status (e.g., mark completed).
        *   Add/remove attendees for group bookings.
        *   **Backend Ref:** `events/views.py:BookingListView`, `events/views.py:BookingDetailView`, `events/views.py:add_attendee_to_booking`, `events/views.py:remove_attendee_from_booking`, `events/serializers.py:BookingSerializer`, `events/serializers.py:BookingUpdateSerializer`, `events/models.py:Attendee`.
        *   **Edge Cases:** Attempting to add attendee to full event, removing last attendee from group booking.
    *   **Public Booking Management (Invitee):**
        *   Access booking via unique `access_token`.
        *   View booking details.
        *   Cancel booking (with reason).
        *   Reschedule booking (select new slot).
        *   **Backend Ref:** `events/views.py:booking_management`, `events/serializers.py:BookingManagementSerializer`.
        *   **Edge Cases:** Invalid/expired token, cancellation window passed, no available slots for rescheduling.

#### 1.4.3. `apps/availability` (Rules, Blocked Times, Buffers, Slot Calculation)

**Backend Functionality:** Recurring availability rules (day of week, time range, event type specificity), date override rules (specific date, available/blocked, time range), recurring blocked times (weekly meetings, date range), one-off blocked times (manual, calendar sync), buffer time settings (default before/after, minimum gap, slot interval), core slot calculation logic.

**Frontend Requirements:**

*   **Pages:**
    *   `/settings/availability/rules`: Manage recurring availability rules.
    *   `/settings/availability/overrides`: Manage date override rules.
    *   `/settings/availability/blocked-times`: Manage one-off and recurring blocked times.
    *   `/settings/availability/buffers`: Configure buffer time settings.
*   **Components:**
    *   `AvailabilityRuleForm`: For creating/editing recurring rules.
    *   `DateOverrideForm`: For creating/editing date-specific overrides.
    *   `BlockedTimeForm`: For creating/editing one-off blocked times.
    *   `RecurringBlockedTimeForm`: For creating/editing recurring blocked times.
    *   `BufferTimeSettingsForm`: For global buffer settings.
    *   `AvailabilityCalendarView`: Visual representation of availability, overrides, and blocked times.
*   **Interactions:**
    *   **Availability Rule Management:**
        *   Create/edit recurring rules (day of week, start/end time, event type filter).
        *   **Backend Ref:** `availability/views.py:AvailabilityRuleListCreateView`, `availability/views.py:AvailabilityRuleDetailView`, `availability/serializers.py:AvailabilityRuleSerializer`.
        *   **Edge Cases:** Overlapping rules, invalid time ranges (e.g., end time before start time).
    *   **Date Override Management:**
        *   Create/edit date overrides (specific date, available/blocked, time range, reason).
        *   **Backend Ref:** `availability/views.py:DateOverrideRuleListCreateView`, `availability/views.py:DateOverrideRuleDetailView`, `availability/serializers.py:DateOverrideRuleSerializer`.
        *   **Edge Cases:** Overlapping with existing rules, invalid time ranges.
    *   **Blocked Time Management:**
        *   Create/edit one-off blocked times (datetime range, reason, source).
        *   Create/edit recurring blocked times (day of week, time range, start/end date).
        *   **Backend Ref:** `availability/views.py:BlockedTimeListCreateView`, `availability/views.py:BlockedTimeDetailView`, `availability/views.py:RecurringBlockedTimeListCreateView`, `availability/views.py:RecurringBlockedTimeDetailView`, `availability/serializers.py:BlockedTimeSerializer`, `availability/serializers.py:RecurringBlockedTimeSerializer`.
        *   **Edge Cases:** Overlapping blocks, invalid date ranges for recurring blocks.
    *   **Buffer Time Settings:**
        *   Configure default buffer times and minimum gap.
        *   **Backend Ref:** `availability/views.py:BufferTimeView`, `availability/serializers.py:BufferTimeSerializer`.
        *   **Edge Cases:** Negative buffer times, buffer times exceeding event duration.
    *   **Availability Visualization:**
        *   Display a calendar showing available slots, blocked periods, and overrides.
        *   **Backend Ref:** `availability/views.py:calculated_slots` (for fetching data to display).

#### 1.4.4. `apps/integrations` (Calendar, Video, Webhooks, OAuth, Logs)

**Backend Functionality:** Calendar integrations (Google, Outlook - busy times, event creation/update/delete, token refresh), Video conference integrations (Zoom, Google Meet - meeting creation, token refresh, rate limiting), Webhook integrations (send data on events), OAuth flows (initiate, callback, token exchange), integration activity logs, conflict detection.

**Frontend Requirements:**

*   **Pages:**
    *   `/settings/integrations`: Dashboard of all available integrations.
    *   `/settings/integrations/calendar/[provider]`: Guided setup for calendar integration.
    *   `/settings/integrations/video/[provider]`: Guided setup for video integration.
    *   `/settings/integrations/webhooks`: List and manage webhook integrations.
    *   `/settings/integrations/logs`: View integration activity logs.
*   **Components:**
    *   `IntegrationCard/List`: Displays available integrations with status (connected/disconnected).
    *   `OAuthSetupWizard`: Guides user through OAuth flow (redirect, callback handling).
    *   `IntegrationStatusDashboard`: Shows connection status, last sync, errors, token expiry.
    *   `WebhookForm`: For creating/editing webhook integrations.
    *   `IntegrationLogTable`: Displays detailed integration activity logs.
    *   `CalendarConflictResolver`: UI to visualize and resolve conflicts between manual and synced blocks.
*   **Interactions:**
    *   **Integration Connection:**
        *   Initiate OAuth flow for calendar/video integrations.
        *   Handle redirects to/from provider.
        *   Display success/failure messages.
        *   **Backend Ref:** `integrations/views.py:initiate_oauth`, `integrations/views.py:oauth_callback`, `integrations/models.py:CalendarIntegration`, `integrations/models.py:VideoConferenceIntegration`.
        *   **Edge Cases:** OAuth state mismatch, token exchange failure, provider API errors, network issues.
    *   **Integration Management:**
        *   View connected integrations, their status, and sync errors.
        *   Trigger manual sync/reconnect.
        *   **Backend Ref:** `integrations/views.py:CalendarIntegrationListView`, `integrations/views.py:VideoConferenceIntegrationListView`, `integrations/views.py:integration_health`, `integrations/views.py:force_calendar_sync`, `integrations/views.py:refresh_calendar_sync`.
        *   **Edge Cases:** Token expiry, rate limiting, API errors.
    *   **Webhook Management:**
        *   Create/edit webhooks (URL, events, secret, headers).
        *   Test webhook delivery.
        *   **Backend Ref:** `integrations/views.py:WebhookIntegrationListCreateView`, `integrations/views.py:WebhookIntegrationDetailView`, `integrations/views.py:test_webhook`, `integrations/models.py:WebhookIntegration`.
        *   **Edge Cases:** Invalid URL, network issues, webhook payload errors.
    *   **Integration Logs:**
        *   View a chronological list of integration activities (syncs, meeting creations, errors).
        *   Filter by type, integration, status.
        *   **Backend Ref:** `integrations/views.py:IntegrationLogListView`, `integrations/models.py:IntegrationLog`.
        *   **Edge Cases:** Large log volumes, performance.
    *   **Calendar Conflict Resolution:**
        *   Visualize overlaps between manually blocked times and externally synced events.
        *   Provide options to resolve (e.g., prioritize manual, ignore external).
        *   **Backend Ref:** `integrations/views.py:calendar_conflicts`.
        *   **Edge Cases:** Complex multi-overlap scenarios.

#### 1.4.5. `apps/workflows` (Automation, Actions, Conditions, Templates)

**Backend Functionality:** Workflow definition (name, description, trigger, event type filter, delay), workflow actions (send email/SMS, trigger webhook, update booking), action configuration (recipient, content, URL, data), conditional logic for actions, workflow execution logging, workflow templates, performance tracking.

**Frontend Requirements:**

*   **Pages:**
    *   `/workflows`: List of all workflows.
    *   `/workflows/new`: Workflow creation wizard.
    *   `/workflows/[id]/edit`: Workflow editor.
    *   `/workflows/templates`: Browse and create from workflow templates.
    *   `/workflows/executions`: View workflow execution logs.
*   **Components:**
    *   `WorkflowList`: Displays workflows with status and quick stats.
    *   `WorkflowBuilder`: Drag-and-drop or step-by-step interface for defining workflows.
    *   `WorkflowTriggerSelector`: Selects trigger type.
    *   `WorkflowActionEditor`: Configures individual actions (email, SMS, webhook, update booking).
    *   `ConditionBuilder`: UI for defining complex conditional logic (AND/OR groups, field, operator, value).
    *   `WorkflowTestPanel`: Allows testing workflows with mock or real data.
    *   `WorkflowExecutionLogViewer`: Displays detailed execution steps and results.
    *   `WorkflowTemplateBrowser`: Displays available templates.
*   **Interactions:**
    *   **Workflow Creation/Editing:**
        *   Define workflow name, description, trigger.
        *   Add/remove actions, reorder actions.
        *   Configure each action's type, recipient, content/payload.
        *   Define conditional logic for actions.
        *   **Backend Ref:** `workflows/views.py:WorkflowListCreateView`, `workflows/views.py:WorkflowDetailView`, `workflows/views.py:WorkflowActionListCreateView`, `workflows/views.py:WorkflowActionDetailView`, `workflows/serializers.py:WorkflowSerializer`, `workflows/serializers.py:WorkflowActionSerializer`.
        *   **Edge Cases:** Invalid conditions, missing required fields for action types, circular dependencies (if applicable).
    *   **Workflow Testing:**
        *   Test workflows with mock data (simulated booking).
        *   Test with real booking data (safe mode).
        *   Live test (with caution, real actions).
        *   Display test results (success/failure, logs).
        *   **Backend Ref:** `workflows/views.py:test_workflow`, `workflows/views.py:bulk_test_workflows`, `workflows/serializers.py:WorkflowTestSerializer`.
        *   **Edge Cases:** Test data not matching conditions, external service failures during live test.
    *   **Workflow Validation:**
        *   Run validation checks on workflow configuration.
        *   Display warnings (e.g., no active actions) and errors (e.g., invalid webhook URL).
        *   **Backend Ref:** `workflows/views.py:validate_workflow`, `workflows/serializers.py:WorkflowValidationSerializer`.
        *   **Edge Cases:** Complex validation rules, performance of validation.
    *   **Workflow Execution Monitoring:**
        *   View a list of past workflow executions.
        *   Drill down into individual execution logs (steps, status, errors).
        *   **Backend Ref:** `workflows/views.py:WorkflowExecutionListView`, `workflows/views.py:workflow_execution_summary`, `workflows/serializers.py:WorkflowExecutionSerializer`.
        *   **Edge Cases:** Large number of executions, long-running workflows.
    *   **Workflow Templates:**
        *   Browse pre-built templates.
        *   Create a new workflow from a template (with option to customize).
        *   **Backend Ref:** `workflows/views.py:WorkflowTemplateListView`, `workflows/views.py:create_workflow_from_template`, `workflows/serializers.py:WorkflowTemplateSerializer`, `workflows/serializers.py:WorkflowFromTemplateSerializer`.
        *   **Edge Cases:** Template data inconsistencies.

#### 1.4.6. `apps/notifications` (Templates, Logs, Preferences, Scheduled)

**Backend Functionality:** Notification templates (email, SMS, subject, message, placeholders), notification logs (sent, failed, delivered, opened, clicked), user notification preferences (email/SMS channels, reminder timing, DND, weekend exclusion, daily limits), scheduled notifications (reminders, daily agenda), Twilio integration for SMS.

**Frontend Requirements:**

*   **Pages:**
    *   `/settings/notifications/templates`: Manage notification templates.
    *   `/settings/notifications/preferences`: Configure personal notification preferences.
    *   `/settings/notifications/logs`: View sent notification logs.
    *   `/settings/notifications/scheduled`: View scheduled notifications.
*   **Components:**
    *   `NotificationTemplateEditor`: For creating/editing email/SMS templates (rich text editor for email, plain text for SMS, placeholder hints).
    *   `NotificationPreferencesForm`: For configuring user preferences.
    *   `NotificationLogTable`: Displays sent notifications with status.
    *   `ScheduledNotificationList`: Displays upcoming scheduled notifications.
    *   `TestNotificationSender`: Allows sending test notifications from templates.
*   **Interactions:**
    *   **Template Management:**
        *   Create/edit email and SMS templates.
        *   Define subject and message, use placeholders.
        *   Test template rendering with sample data.
        *   **Backend Ref:** `notifications/views.py:NotificationTemplateListCreateView`, `notifications/views.py:NotificationTemplateDetailView`, `notifications/views.py:test_template`, `notifications/serializers.py:NotificationTemplateSerializer`.
        *   **Edge Cases:** Invalid placeholders, empty content, template rendering errors.
    *   **Preference Configuration:**
        *   Set preferred notification methods (email, SMS, both).
        *   Configure reminder timing, daily agenda time.
        *   Enable/disable DND hours, exclude weekends.
        *   **Backend Ref:** `notifications/views.py:NotificationPreferenceView`, `notifications/serializers.py:NotificationPreferenceSerializer`.
        *   **Edge Cases:** Invalid time inputs, conflicting preferences.
    *   **Notification Logs:**
        *   View a list of all sent notifications (email, SMS).
        *   Filter by type, status, recipient.
        *   View delivery status (sent, delivered, failed, opened, clicked).
        *   Resend failed notifications.
        *   **Backend Ref:** `notifications/views.py:NotificationLogListView`, `notifications/views.py:resend_failed_notification`, `notifications/serializers.py:NotificationLogSerializer`.
        *   **Edge Cases:** Large log volumes, delayed status updates from providers.
    *   **Scheduled Notifications:**
        *   View upcoming scheduled reminders and daily agendas.
        *   Cancel scheduled notifications.
        *   **Backend Ref:** `notifications/views.py:NotificationScheduleListView`, `notifications/views.py:cancel_scheduled_notification`, `notifications/serializers.py:NotificationScheduleSerializer`.
        *   **Edge Cases:** Notifications rescheduled due to DND/weekend rules.

#### 1.4.7. `apps/contacts` (Management, Groups, Interactions, Import/Export)

**Backend Functionality:** Contact creation/editing (name, email, phone, company, notes, tags), contact groups, contact interactions (booking created, email sent, manual entry), contact import (CSV), contact export (CSV), contact merging.

**Frontend Requirements:**

*   **Pages:**
    *   `/contacts`: List of all contacts.
    *   `/contacts/new`: Form to create a new contact.
    *   `/contacts/[id]`: Detailed view of a single contact.
    *   `/contacts/groups`: Manage contact groups.
    *   `/contacts/import`: Contact import wizard.
*   **Components:**
    *   `ContactList/Table`: Displays contacts with search, filter, and sort.
    *   `ContactForm`: For creating/editing contact details.
    *   `ContactDetails`: Displays contact info, interactions, and groups.
    *   `ContactGroupManager`: For creating/editing groups and adding/removing contacts.
    *   `ContactInteractionLog`: Displays chronological interactions with a contact.
    *   `ContactImportWizard`: Guides user through CSV import process.
    *   `ContactMergeTool`: UI for selecting and merging duplicate contacts.
*   **Interactions:**
    *   **Contact Management:**
        *   Create/edit contact details.
        *   View contact interactions.
        *   Add manual interactions.
        *   **Backend Ref:** `contacts/views.py:ContactListCreateView`, `contacts/views.py:ContactDetailView`, `contacts/views.py:ContactInteractionListView`, `contacts/views.py:add_contact_interaction`, `contacts/serializers.py:ContactSerializer`, `contacts/serializers.py:ContactInteractionSerializer`.
        *   **Edge Cases:** Duplicate emails, invalid contact info.
    *   **Contact Group Management:**
        *   Create/edit contact groups.
        *   Add/remove contacts from groups.
        *   **Backend Ref:** `contacts/views.py:ContactGroupListCreateView`, `contacts/views.py:ContactGroupDetailView`, `contacts/views.py:add_contact_to_group`, `contacts/views.py:remove_contact_from_group`, `contacts/serializers.py:ContactGroupSerializer`.
        *   **Edge Cases:** Group name conflicts, adding non-existent contacts.
    *   **Contact Import/Export:**
        *   Upload CSV for import (with options for duplicate handling).
        *   Download contacts as CSV.
        *   **Backend Ref:** `contacts/views.py:import_contacts`, `contacts/views.py:export_contacts`, `contacts/serializers.py:ContactImportSerializer`.
        *   **Edge Cases:** Invalid CSV format, large file sizes, import errors.
    *   **Contact Merging:**
        *   Select primary contact and duplicate contacts.
        *   Initiate merge operation.
        *   **Backend Ref:** `contacts/views.py:merge_contacts`.
        *   **Edge Cases:** Merging non-existent contacts, data conflicts during merge.

---

## Phase 2: Core Authentication & User Management

**Objective:** Implement all authentication flows, user profile management, and basic dashboard functionality.

**Tasks:**
*   **2.1. Login/Logout Implementation:**
    *   Implement email/password login.
    *   Integrate SSO discovery and redirection.
    *   Implement logout.
    *   **AC:** Users can log in/out via email/password and initiate SSO.
*   **2.2. Registration & Email Verification:**
    *   Implement user registration form.
    *   Handle email verification flow.
    *   **AC:** New users can register and verify their email.
*   **2.3. Password Management:**
    *   Implement change password, forgot password, and reset password flows.
    *   Handle password expiry/grace period UI.
    *   **AC:** Users can manage their passwords securely.
*   **2.4. User Profile Management:**
    *   Implement UI for viewing and editing user profile details.
    *   **AC:** Users can update their profile information.
*   **2.5. MFA Setup & Management:**
    *   Implement UI for TOTP and SMS MFA enrollment.
    *   Display/manage MFA devices and backup codes.
    *   Implement MFA disable flow.
    *   **AC:** Users can enable, manage, and disable MFA.
*   **2.6. Session Management UI:**
    *   Display active user sessions.
    *   Allow revoking individual or all other sessions.
    *   **AC:** Users can view and manage their active sessions.
*   **2.7. Basic Dashboard/Home Page:**
    *   Create a landing page post-login with basic user information and navigation.
    *   **AC:** Authenticated users land on a functional dashboard.

---

## Phase 3: Event Management & Scheduling

**Objective:** Implement full event type creation/management, public booking flows, and organizer booking management.

**Tasks:**
*   **3.1. Event Type Creation/Editing:**
    *   Develop multi-step form for event type details, duration, attendees, recurrence, location, buffers, scheduling notice, daily limits.
    *   Integrate custom question builder.
    *   **AC:** Organizers can create and fully configure event types.
*   **3.2. Public Booking Page:**
    *   Implement public organizer page displaying event types.
    *   Implement public event type page with availability calendar.
    *   Integrate slot selection and booking form with custom questions.
    *   Handle group bookings and waitlist functionality.
    *   **AC:** Invitees can browse event types, select slots, and complete bookings.
*   **3.3. Organizer Booking Management:**
    *   Develop UI for listing, filtering, and viewing booking details.
    *   Implement actions for cancelling, rescheduling, and updating booking status.
    *   Manage attendees for group bookings.
    *   **AC:** Organizers can efficiently manage all their bookings.
*   **3.4. Public Booking Management (Invitee):**
    *   Implement UI for invitees to manage their bookings via access token.
    *   Allow cancellation and rescheduling.
    *   **AC:** Invitees can self-manage their bookings.
*   **3.5. Availability Settings UI:**
    *   Implement forms for recurring availability rules, date override rules, one-off blocked times, and recurring blocked times.
    *   Implement form for global buffer time settings.
    *   **AC:** Organizers can precisely control their availability.

---

## Phase 4: Integrations & Workflows

**Objective:** Implement UI for connecting and managing external integrations, and building/managing automated workflows.

**Tasks:**
*   **4.1. Integrations Dashboard:**
    *   Display all available integrations with their connection status.
    *   **AC:** Users can see an overview of all integrations.
*   **4.2. Guided Integration Setup:**
    *   Implement guided setup wizards for calendar (Google, Outlook) and video (Zoom, Google Meet) integrations, handling OAuth redirects.
    *   **AC:** Users can connect new integrations via guided flows.
*   **4.3. Integration Management & Status:**
    *   Display detailed status (last sync, errors, token expiry).
    *   Implement manual sync/reconnect options.
    *   **AC:** Users can monitor and manage connected integrations.
*   **4.4. Webhook Management:**
    *   Implement UI for creating, editing, and testing webhook integrations.
    *   **AC:** Users can configure custom webhooks.
*   **4.5. Workflow Builder:**
    *   Develop an intuitive interface for creating and editing workflows (triggers, actions, conditions).
    *   **AC:** Users can build complex automated workflows.
*   **4.6. Workflow Testing & Validation:**
    *   Implement UI for testing workflows with mock/real data and viewing results.
    *   Display validation warnings and errors for workflow configurations.
    *   **AC:** Users can test and validate their workflows.
*   **4.7. Workflow Execution Monitoring:**
    *   Display a list of workflow executions with status and summary.
    *   Allow drilling down into detailed execution logs.
    *   **AC:** Users can monitor the performance and history of their workflows.

---

## Phase 5: Team & Organization Management

**Objective:** Implement comprehensive UI for multi-tenancy, team management, and advanced administrative features.

**Tasks:**
*   **5.1. Organization Dashboard:**
    *   Create a central dashboard for organization-level settings and overview.
    *   **AC:** Organization administrators have a dedicated management interface.
*   **5.2. Team Member Management:**
    *   Implement UI for inviting new team members (email, role).
    *   Display list of active, invited, and suspended team members.
    *   Allow editing member roles and status.
    *   **AC:** Administrators can manage their team members.
*   **5.3. Granular RBAC UI:**
    *   Implement UI for viewing and assigning roles and permissions (if custom roles are allowed).
    *   Display permission hints inline where applicable.
    *   **AC:** Administrators can configure granular access control.
*   **5.4. Team-Level Settings:**
    *   Implement UI for managing organization-wide settings (e.g., billing, custom domains, shared integrations).
    *   **AC:** Organization-level settings are configurable.
*   **5.5. Audit Trails UI:**
    *   Implement UI for viewing organization-wide audit logs.
    *   **AC:** Administrators can review all system activities.

---

## Phase 6: Notifications & Contacts

**Objective:** Implement UI for managing notification preferences and templates, and a full-featured contact management system.

**Tasks:**
*   **6.1. Notification Preferences:**
    *   Implement UI for users to configure their personal notification preferences (email/SMS channels, reminder timing, DND, weekend exclusion).
    *   **AC:** Users can customize their notification delivery.
*   **6.2. Notification Templates:**
    *   Implement UI for creating and editing email and SMS notification templates, including placeholder support.
    *   Allow sending test notifications.
    *   **AC:** Organizers can customize notification content.
*   **6.3. Notification Logs:**
    *   Implement UI for viewing a comprehensive log of all sent notifications, including delivery status.
    *   Allow resending failed notifications.
    *   **AC:** Users can track the delivery of their notifications.
*   **6.4. Scheduled Notifications:**
    *   Implement UI for viewing and managing upcoming scheduled notifications (reminders, daily agendas).
    *   Allow cancelling scheduled notifications.
    *   **AC:** Users can see and manage their future notifications.
*   **6.5. Contact Management:**
    *   Implement UI for listing, creating, editing, and viewing contact details.
    *   Display contact interactions.
    *   **AC:** Users can manage their individual contacts.
*   **6.6. Contact Groups:**
    *   Implement UI for creating, editing, and managing contact groups.
    *   Allow adding/removing contacts from groups.
    *   **AC:** Users can organize contacts into groups.
*   **6.7. Contact Import/Export:**
    *   Implement a wizard for importing contacts from CSV.
    *   Provide functionality to export contacts to CSV.
    *   **AC:** Users can import and export their contact lists.
*   **6.8. Contact Merging:**
    *   Implement UI for identifying and merging duplicate contacts.
    *   **AC:** Users can clean up their contact data.

---

## Phase 7: Real-time & Advanced Features

**Objective:** Integrate real-time capabilities and implement sophisticated UX flourishes.

**Tasks:**
*   **7.1. WebSocket Integration:**
    *   Set up a centralized WebSocket connection for real-time updates.
    *   Implement event channel model (user, organization, calendar).
    *   **AC:** Frontend establishes and maintains WebSocket connection.
*   **7.2. Real-time Booking Notifications:**
    *   Display instant notifications for new bookings, cancellations, and reschedules.
    *   **AC:** Users receive immediate alerts for booking changes.
*   **7.3. Live Availability Updates:**
    *   Update availability calendar in real-time when external calendars sync or organizer changes availability.
    *   **AC:** Availability display reflects changes instantly.
*   **7.4. Optimistic UI Updates:**
    *   Implement optimistic updates for user actions (e.g., booking, cancelling) to provide instant feedback.
    *   **AC:** UI responds immediately to user actions, with graceful fallback on error.
*   **7.5. Fluid Micro-animations & Transitions:**
    *   Implement subtle, sophisticated animations for UI elements and page transitions.
    *   **AC:** UI feels responsive and delightful with smooth animations.
*   **7.6. Spotlight Command Palette:**
    *   Implement a searchable command palette for quick access to features and settings.
    *   **AC:** Power users can navigate and perform actions rapidly.
*   **7.7. Real-time Inline Validation:**
    *   Implement immediate feedback for form inputs as users type.
    *   **AC:** Forms provide clear and instant validation messages.

---

## Phase 8: Polish, Performance & Deployment

**Objective:** Refine the frontend for optimal performance, accessibility, and visual polish, and prepare for deployment.

**Tasks:**
*   **8.1. Theming & Customization:**
    *   Implement light/neutral/dark mode switcher.
    *   Allow users to select accent color (if applicable).
    *   **AC:** The application theme is customizable.
*   **8.2. Accessibility Audit & Remediation:**
    *   Conduct a thorough accessibility audit (WCAG 2.1 AA).
    *   Implement necessary ARIA attributes, keyboard navigation, and screen reader support.
    *   **AC:** The application is fully accessible to users with disabilities.
*   **8.3. Performance Optimization:**
    *   Implement code splitting, lazy loading, image optimization.
    *   Optimize data fetching with React Query (caching, deduplication, background refetching).
    *   **AC:** Application loads quickly and performs smoothly.
*   **8.4. Cross-Browser & Device Testing:**
    *   Test across major browsers (Chrome, Firefox, Safari, Edge) and various devices/screen sizes using Playwright.
    *   **AC:** Application functions correctly and consistently across all target environments.
*   **8.5. Error Handling & Fallbacks:**
    *   Implement robust error boundaries and user-friendly error messages.
    *   Provide graceful fallbacks for network issues or API failures.
    *   **AC:** Application handles errors gracefully without crashing.
*   **8.6. Documentation & Code Review:**
    *   Document complex components, hooks, and utilities.
    *   Conduct thorough code reviews.
    *   **AC:** Codebase is well-documented and maintainable.
*   **8.7. Deployment Preparation:**
    *   Configure build process for production.
    *   Prepare deployment scripts/instructions.
    *   **AC:** Application is ready for production deployment.

---
