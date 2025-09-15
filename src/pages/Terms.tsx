import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: September 2025</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing and using Vibe Defender ("we," "us," or "our") website security scanning services, you ("User" or "you") accept and agree to be bound by the terms and provisions of this Terms of Service agreement ("Agreement"). These Terms govern your use of our website security scanning platform and all related services provided through our platform.
              </p>
              <p>
                If you do not agree to these Terms, you must not access or use our services. By continuing to use our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Vibe Defender provides automated website security scanning services that analyze publicly accessible websites for security vulnerabilities, configuration issues, and compliance with security best practices. Our service performs non-invasive security assessments by analyzing HTTP headers, SSL/TLS configurations, and other publicly available security indicators.
              </p>
              
              <h4>Service Features</h4>
              <ul>
                <li>Automated security scans of publicly accessible websites</li>
                <li>Security reporting based on OWASP guidelines and CVSS scoring</li>
                <li>Historical scan data and trending analysis</li>
                <li>Dashboard and project management features</li>
                <li>Recommendations for security improvements</li>
              </ul>

              <h4>Service Limitations</h4>
              <p>
                Our scanning service is limited to publicly accessible information and does not involve:
              </p>
              <ul>
                <li>Penetration testing or invasive security assessments</li>
                <li>Access to private or authenticated areas of websites</li>
                <li>Modification of website content or functionality</li>
                <li>Real-time monitoring or continuous surveillance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Authorization and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Mandatory Authorization</h4>
              <p>
                <strong>You may ONLY scan websites that you own, control, or have explicit written permission to test.</strong> By submitting a URL for scanning, you represent and warrant that you have the legal right and authority to request security testing of that website.
              </p>
              
              <h4>Legal Warning</h4>
              <p>
                Unauthorized security scanning of websites may violate local, state, federal, or international laws. You are solely responsible for ensuring compliance with all applicable laws and regulations before using our service.
              </p>
              
              <h4>Account Security</h4>
              <p>
                You are responsible for:
              </p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Using strong, unique passwords for your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3.5 Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                You agree to defend, indemnify, and hold harmless Vibe Defender, its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from:
              </p>
              <ul>
                <li>Your use of our services in violation of these Terms</li>
                <li>Your scanning of websites without proper authorization</li>
                <li>Any violation of applicable laws or regulations in connection with your use of our services</li>
                <li>Any claims by third parties regarding unauthorized scanning of their websites</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>You agree not to use our service to:</p>
              <ul>
                <li>Scan websites without proper authorization from the website owner</li>
                <li>Attempt to gain unauthorized access to any systems or networks</li>
                <li>Interfere with or disrupt our services or infrastructure</li>
                <li>Use our platform for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Circumvent rate limiting or security measures</li>
                <li>Use automated tools to abuse our service</li>
                <li>Resell or redistribute our services without permission</li>
              </ul>
              
              <h4>Consequences of Violations</h4>
              <p>
                Violations of these prohibited uses may result in immediate termination of your account, legal action, and cooperation with law enforcement authorities as required by law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Service Availability and Modifications</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                While we strive to maintain high service availability, we do not guarantee that our services will be available 100% of the time. We may experience downtime for maintenance, updates, or unforeseen technical issues.
              </p>
              
              <h4>Service Modifications</h4>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of our service at any time with or without notice. We may also impose limits on certain features or restrict access to parts of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Service Limitations and Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Service "As-Is"</h4>
              <p>
                Our security scanning services are provided "as-is" and for informational purposes only. We make no warranties about the accuracy, completeness, reliability, or timeliness of our scan results.
              </p>
              
              <h4>No Guarantee of Security</h4>
              <p>
                <strong>IMPORTANT:</strong> A clean scan result does not guarantee that your website is completely secure. Our service cannot detect all possible security vulnerabilities, misconfigurations, or threats. Security is an ongoing process that requires comprehensive approaches beyond automated scanning.
              </p>
              
              <h4>Limitation of Damages</h4>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL VIBE DEFENDER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OUR SERVICES.
              </p>
              
              <h4>Damages Cap</h4>
              <p>
                Our total liability for any claims arising from your use of our services shall not exceed the amount paid by you for our services in the twelve (12) months preceding the claim, or $100, whichever is greater.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6.5 User Legal Responsibility</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                <strong>YOU ACKNOWLEDGE AND AGREE THAT:</strong>
              </p>
              <ul>
                <li>You are solely responsible for compliance with all applicable laws and regulations</li>
                <li>You should consult with qualified legal counsel regarding the legality of security scanning in your jurisdiction</li>
                <li>Different countries, states, and organizations may have varying laws regarding authorized security testing</li>
                <li>You assume all legal risks associated with your use of our scanning services</li>
                <li>Vibe Defender provides no legal advice and cannot determine what constitutes "authorized" scanning in your specific situation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your privacy is important to us. Please review our <Link to="/privacy" className="underline">Privacy Policy</Link>, which also governs your use of our services, to understand our practices regarding the collection, use, and protection of your information.
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
                We offer limited free scanning services for guest users and registered users with usage restrictions as defined in our current pricing structure.
              </p>
              
              <h4>Paid Subscriptions</h4>
              <p>
                Paid subscription plans provide additional features and higher usage limits. Billing is processed monthly or annually as selected during subscription signup. All fees are non-refundable except as required by law.
              </p>
              
              <h4>Billing and Payment</h4>
              <ul>
                <li>Subscription fees are charged in advance</li>
                <li>You authorize us to charge your payment method for all fees</li>
                <li>You are responsible for keeping your payment information current</li>
                <li>We may suspend services for non-payment</li>
              </ul>
              
              <h4>Cancellation</h4>
              <p>
                You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing period. No refunds are provided for partial billing periods.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                All content, features, functionality, software, and technology of our service are owned by Vibe Defender and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms of Service. Upon termination, your right to use our services will cease immediately.
              </p>
              
              <h4>Effect of Termination</h4>
              <ul>
                <li>You will lose access to your account and scan history</li>
                <li>We may delete your data in accordance with our data retention policies</li>
                <li>All provisions that should survive termination will remain in effect</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Governing Law and Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of South Carolina, USA, without regard to its conflict of law principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in South Carolina, USA.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We reserve the right to modify these terms at any time in our sole discretion. We will notify users of any material changes via email or through prominent notice on our platform. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>
              
              <h4>Notification Process</h4>
              <ul>
                <li>Material changes will be announced 30 days before taking effect</li>
                <li>Minor updates may be implemented immediately</li>
                <li>You should review these terms periodically</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you have any questions about these Terms of Service, please reach out via our <Link to="/contact" className="underline">Contact</Link> page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Terms;