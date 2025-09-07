// Authentication and user-related types
export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ForcedPasswordChangeData {
  new_password: string;
  new_password_confirm: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  new_password_confirm: string;
}

export interface EmailVerification {
  token: string;
}

export interface SSOInitiation {
  sso_type: 'saml' | 'oidc';
  organization_domain: string;
  redirect_url?: string;
}

export interface MFASetup {
  device_type: 'totp' | 'sms' | 'backup';
  device_name: string;
  phone_number?: string;
}

export interface MFAVerification {
  otp_code: string;
  device_id?: string;
}

export interface InvitationData {
  invited_email: string;
  role: string;
  message?: string;
}

export interface InvitationResponse {
  token: string;
  action: 'accept' | 'decline';
  first_name?: string;
  last_name?: string;
  password?: string;
  password_confirm?: string;
}

// Auth context types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (data: PasswordResetConfirm) => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  forcePasswordChange: (data: ForcedPasswordChangeData) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  initiateSso: (data: SSOInitiation) => Promise<string>;
  ssoDiscovery: (domain: string) => Promise<any>;
}

// MFA types
export interface TOTPSetupResponse {
  secret: string;
  qr_code: string;
  manual_entry_key: string;
  message: string;
}

export interface SMSSetupResponse {
  message: string;
  phone_number: string;
}

export interface BackupCodesResponse {
  message: string;
  backup_codes: string[];
}

// Session types
export interface SessionRevocation {
  session_id?: string;
  revoke_all?: boolean;
}

// SSO types
export interface SSOProvider {
  type: 'saml' | 'oidc';
  organization: string;
  domain: string;
}

export interface SSODiscoveryResponse {
  domain: string;
  providers: SSOProvider[];
}

export interface SSOInitiationResponse {
  auth_url: string;
  sso_type: string;
  organization: string;
}