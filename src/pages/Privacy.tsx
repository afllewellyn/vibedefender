import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h4>Website URLs</h4>
            <p>When you use our scanning service, we collect and temporarily process the URLs you submit for security analysis.</p>
            
            <h4>Account Information</h4>
            <p>If you create an account, we collect your email address and encrypted password. We may also collect optional profile information you choose to provide.</p>
            
            <h4>Scan Results</h4>
            <p>We store the results of security scans to provide you with historical data and trending analysis. This includes security findings, scores, and timestamps.</p>
            
            <h4>Usage Data</h4>
            <p>We collect information about how you interact with our service, including pages visited, features used, and scan frequency.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <ul>
              <li>To provide and improve our security scanning services</li>
              <li>To maintain and analyze your scan history</li>
              <li>To send you important service updates and security notifications</li>
              <li>To provide customer support and respond to your inquiries</li>
              <li>To detect and prevent fraud and abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            
            <h4>Service Providers</h4>
            <p>We may share data with trusted third-party service providers who assist us in operating our platform, conducting business, or serving users, as long as they agree to keep this information confidential.</p>
            
            <h4>Legal Requirements</h4>
            <p>We may disclose your information when required by law, legal process, litigation, or requests from public and government authorities.</p>
            
            <h4>Business Transfers</h4>
            <p>If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
            
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure data centers and infrastructure</li>
              <li>Regular employee training on data protection</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. Specifically:</p>
            
            <ul>
              <li>Account information: Until you delete your account</li>
              <li>Scan results: Up to 2 years from the scan date</li>
              <li>Usage logs: Up to 1 year for operational purposes</li>
              <li>Guest scan data: 30 days from scan completion</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            
            <ul>
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </ul>
            
            <p>To exercise these rights, please contact us at privacy@vibescurity.com.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p>We use cookies and similar technologies to enhance your experience on our platform. These include:</p>
            
            <ul>
              <li><strong>Essential cookies:</strong> Required for basic platform functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand how you use our service</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
            </ul>
            
            <p>You can control cookie settings through your browser preferences.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
export default Privacy;