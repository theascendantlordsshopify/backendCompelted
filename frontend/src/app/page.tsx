import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-enterprise-50 to-enterprise-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-display-2xl text-enterprise-900">
              Enterprise Scheduling Platform
            </h1>
            <p className="text-xl text-enterprise-600 max-w-2xl mx-auto">
              Professional scheduling and calendar management for enterprise teams. 
              Streamline your meetings with advanced automation and integrations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="enterprise">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="lg" variant="enterprise-outline">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="enterprise-shadow">
            <CardHeader>
              <CardTitle className="text-enterprise-800">Smart Scheduling</CardTitle>
              <CardDescription>
                Intelligent availability management with calendar sync and conflict resolution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-enterprise-600">
                <li>• Multi-calendar integration</li>
                <li>• Timezone intelligence</li>
                <li>• Buffer time management</li>
                <li>• Recurring availability rules</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="enterprise-shadow">
            <CardHeader>
              <CardTitle className="text-enterprise-800">Enterprise Security</CardTitle>
              <CardDescription>
                Advanced security features including SSO, MFA, and comprehensive audit trails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-enterprise-600">
                <li>• SAML & OIDC SSO</li>
                <li>• Multi-factor authentication</li>
                <li>• Role-based access control</li>
                <li>• Complete audit logging</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="enterprise-shadow">
            <CardHeader>
              <CardTitle className="text-enterprise-800">Workflow Automation</CardTitle>
              <CardDescription>
                Powerful automation engine for notifications, follow-ups, and custom workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-enterprise-600">
                <li>• Custom workflow builder</li>
                <li>• Email & SMS automation</li>
                <li>• Webhook integrations</li>
                <li>• Conditional logic</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}