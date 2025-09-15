import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
const Privacy = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: September 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h4>Website URLs</h4>
            <p>When you use our scanning service, we collect and temporarily process the URLs you submit for security analysis. We do not access or store any private content from the scanned websites beyond standard HTTP headers and publicly available security configurations.</p>
            
            <h4>Account Information</h4>
            <p>If you create an account, we collect your email address and encrypted password. We may also collect optional profile information you choose to provide, such as your name and organization details.</p>
            
            <h4>Scan Results and Recommendations</h4>
            <p>We store the results of security scans to provide you with historical data and trending analysis. This includes security findings, CVSS scores, recommendations for improvement, and timestamps of when scans were performed.</p>
            
            <h4>Usage Data</h4>
            <p>We collect information about how you interact with our service, including pages visited, features used, scan frequency, IP addresses (for security and rate limiting), browser information, and device characteristics.</p>
            
            <h4>Legal Compliance Data</h4>
            <p>For legal and security purposes, we may collect and retain logs of user activities, IP addresses, and other technical information necessary for preventing abuse, investigating security incidents, and complying with legal obligations.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To provide and improve our security scanning services</li>
              <li>To maintain and analyze your scan history and provide trending data</li>
              <li>To send you important service updates and security notifications</li>
              <li>To provide customer support and respond to your inquiries</li>
              <li>To detect and prevent fraud, abuse, and security threats</li>
              <li>To comply with legal obligations and respond to lawful requests</li>
              <li>To monitor for unauthorized scanning and ensure service authorization</li>
              <li>To improve our platform's security and performance</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal Compliance and Data Processing</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              <strong>User Responsibility for Authorization:</strong> By using our service, you represent that you have proper authorization to scan the submitted websites. We are not responsible for determining the legality of your scanning activities.
            </p>
            
            <p>
              <strong>Data Processing for Legal Requests:</strong> We may process and retain your data to comply with legal processes, government requests, and law enforcement investigations when required by applicable law.
            </p>
            
            <p>
              <strong>Security Monitoring:</strong> We monitor usage patterns to detect potential misuse, unauthorized scanning, and security threats to our platform and users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            
            <h4>Service Providers</h4>
            <p>We may share data with trusted third-party service providers who assist us in operating our platform, conducting business, or serving users, as long as they agree to keep this information confidential and use it only for the purposes for which we disclosed it.</p>
            
            <h4>Legal Enforcement and Requirements</h4>
            <p>We may disclose your information when required by law, legal process, litigation, or requests from public and government authorities. This includes cooperation with law enforcement investigations and compliance with court orders, subpoenas, and regulatory requirements.</p>
            
            <h4>Business Transfers</h4>
            <p>If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction. We will provide notice before your personal information is transferred and becomes subject to a different privacy policy.</p>
            
            <h4>Emergency Situations</h4>
            <p>We may share information if we believe it's necessary to protect the safety of users, investigate fraud, respond to a government request, or protect our rights and property.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We implement comprehensive technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
            
            <h4>Technical Safeguards</h4>
            <ul>
              <li>Encryption of data in transit using TLS/SSL protocols</li>
              <li>Encryption of sensitive data at rest using industry-standard algorithms</li>
              <li>Secure data centers with physical access controls and monitoring</li>
              <li>Network security measures including firewalls and intrusion detection</li>
              <li>Regular security assessments, vulnerability testing, and updates</li>
            </ul>
            
            <h4>Administrative Safeguards</h4>
            <ul>
              <li>Access controls and authentication requirements for our systems</li>
              <li>Regular employee training on data protection and security practices</li>
              <li>Incident response procedures for security breaches</li>
              <li>Vendor security assessments and contractual data protection requirements</li>
              <li>Regular auditing and monitoring of access to personal information</li>
            </ul>
            
            <p>
              <strong>Important:</strong> While we implement strong security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your information using industry best practices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your country. When we transfer your personal information internationally, we implement appropriate safeguards to protect your data, including:
            </p>
            
            <ul>
              <li>Standard contractual clauses approved by relevant authorities</li>
              <li>Adequacy decisions by applicable data protection authorities</li>
              <li>Your explicit consent when required by law</li>
              <li>Other lawful transfer mechanisms as available</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We retain your personal information for as long as necessary to provide our services, fulfill the purposes outlined in this privacy policy, and comply with legal obligations. Specific retention periods include:</p>
            
            <ul>
              <li><strong>Account information:</strong> Until you delete your account or request deletion</li>
              <li><strong>Scan results and findings:</strong> Up to 2 years from the scan date for trend analysis</li>
              <li><strong>Usage and access logs:</strong> Up to 1 year for operational and security purposes</li>
              <li><strong>Guest scan data:</strong> 30 days from scan completion for non-registered users</li>
              <li><strong>Legal compliance data:</strong> As required by applicable laws and regulations</li>
              <li><strong>Security incident data:</strong> Up to 3 years or as required for legal proceedings</li>
              <li><strong>Payment and billing information:</strong> As required by tax laws and accounting standards</li>
            </ul>
            
            <p>
              When determining retention periods, we consider the purpose for which we collected the information, legal requirements, and legitimate business interests. Data is securely deleted or anonymized when no longer needed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>Depending on your location and applicable data protection laws (such as GDPR, CCPA, or other regional regulations), you may have the following rights regarding your personal information:</p>
            
            <ul>
              <li><strong>Access:</strong> Request access to your personal information and details about how we process it</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal and legitimate business requirements)</li>
              <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              <li><strong>Lodge Complaints:</strong> File complaints with supervisory authorities in your jurisdiction</li>
            </ul>
            
            <h4>Exercising Your Rights</h4>
            <p>
              To exercise these rights, please contact us using our <Link to="/contact" className="underline">Contact</Link> page. We will respond to your request within the timeframe required by applicable law, typically within 30 days.
            </p>
            
            <h4>Limitations</h4>
            <p>
              Some rights may be limited by applicable law or our legitimate interests (such as fraud prevention, security, and legal compliance). We will explain any limitations when responding to your requests.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We use cookies and similar technologies to enhance your experience on our platform, provide functionality, and analyze usage. Types of cookies and tracking technologies we use include:</p>
            
            <h4>Essential Cookies</h4>
            <p>Required for basic platform functionality, including authentication, security, and core website operations. These cannot be disabled without affecting site functionality.</p>
            
            <h4>Analytics Cookies</h4>
            <p>Help us understand how users interact with our service, which pages are most popular, and how we can improve the user experience. We use this data in aggregate form only.</p>
            
            <h4>Preference Cookies</h4>
            <p>Remember your settings, preferences, and choices to provide a more personalized experience across sessions.</p>
            
            <h4>Managing Cookies</h4>
            <p>
              You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of our service. Most browsers allow you to:
            </p>
            <ul>
              <li>View and delete cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block third-party cookies</li>
              <li>Clear cookies when closing the browser</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              Our service is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information promptly.
            </p>
            
            <p>
              If you are a parent or guardian and believe that your child has provided us with personal information, please contact us via our <Link to="/contact" className="underline">Contact</Link> page so we can take appropriate action.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. We will notify you of any material changes by:
            </p>
            
            <ul>
              <li>Posting the updated policy on our website with a new "Last updated" date</li>
              <li>Sending email notifications for significant changes (if you have an account)</li>
              <li>Displaying prominent notices on our platform</li>
            </ul>
            
            <p>
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of our services after any changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If you have any questions about this Privacy Policy, need to exercise your data rights, or have concerns about how we handle your personal information, please contact us via our <Link to="/contact" className="underline">Contact</Link> page.</p>
            
            <p>
              We are committed to addressing your privacy concerns and will respond to your inquiries in a timely manner in accordance with applicable law.
            </p>
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>;
};
export default Privacy;