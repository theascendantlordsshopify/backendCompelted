import { InvitationResponseForm } from '@/components/invitations/InvitationResponseForm';

export default function InvitationPage() {
  return (
    <div className="min-h-screen bg-enterprise-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <InvitationResponseForm />
      </div>
    </div>
  );
}