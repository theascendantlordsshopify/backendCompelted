import { ForcePasswordChangeForm } from '@/components/auth/ForcePasswordChangeForm';

export default function ForcePasswordChangePage() {
  return (
    <div className="min-h-screen bg-enterprise-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ForcePasswordChangeForm />
      </div>
    </div>
  );
}