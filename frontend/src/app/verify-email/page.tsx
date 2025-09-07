import { EmailVerificationPage } from '@/components/auth/EmailVerificationPage';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-enterprise-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <EmailVerificationPage />
      </div>
    </div>
  );
}