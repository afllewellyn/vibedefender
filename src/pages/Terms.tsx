import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
const Terms = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: July 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              By accessing and using Vibescurity's services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our website security scanning platform and all related services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              Vibescurity provides automated website security scanning services that analyze websites for security vulnerabilities, configuration issues, and compliance with security best practices. Our service includes:
            </p>
            <ul>
              <li>Automated security scans of publicly accessible websites</li>
              <li>Security reporting and recommendations</li>
              <li>Historical scan data and trending analysis</li>
              <li>Dashboard and project management features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h4>Authorized Scanning</h4>
            <p>
              You may only scan websites that you own, control, or have explicit permission to test. You are responsible for ensuring you have proper authorization before submitting any URL for scanning.
            </p>
            
            <h4>Compliance with Laws</h4>
            <p>
              You agree to use our services in compliance with all applicable local, state, national, and international laws and regulations.
            </p>
            
            <h4>Account Security</h4>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>You agree not to use our service to:</p>
            <ul>
              <li>Scan websites without proper authorization</li>
              <li>Attempt to gain unauthorized access to any systems or networks</li>
              <li>Interfere with or disrupt our services or infrastructure</li>
              <li>Use our platform for any illegal or unauthorized purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              While we strive to maintain high service availability, we do not guarantee that our services will be available 100% of the time. We may experience downtime for maintenance, updates, or unforeseen technical issues.
            </p>
            
            <h4>Service Modifications</h4>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our service at any time with or without notice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              Our security scans are provided as-is and for informational purposes only. We make no warranties about the accuracy, completeness, or reliability of our scan results.
            </p>
            
            <h4>No Guarantee of Security</h4>
            <p>
              A clean scan result does not guarantee that your website is completely secure. Our service cannot detect all possible security vulnerabilities or misconfigurations.
            </p>
            
            <h4>Damages</h4>
            <p>
              In no event shall Vibescurity be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, to understand our practices regarding the collection and use of your information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Subscription and Billing</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h4>Free Tier</h4>
            <p>
              We offer limited free scanning services for guest users and registered users with usage restrictions.
            </p>
            
            <h4>Paid Subscriptions</h4>
            <p>
              Paid subscription plans provide additional features and higher usage limits. Billing is processed monthly or annually as selected during subscription.
            </p>
            
            <h4>Cancellation</h4>
            <p>
              You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              All content, features, and functionality of our service are owned by Vibescurity and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including breach of these Terms of Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <ul className="mt-4 space-y-2">
              <li>Email: afllewellyn@gmail.com</li>
              <li>
              </li>
            </ul>
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>;
};
export default Terms;