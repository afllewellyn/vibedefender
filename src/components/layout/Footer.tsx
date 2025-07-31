import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
const Footer = () => {
  return <footer className="border-t bg-blue-950">
      <div className="container mx-auto px-4 py-8 bg-blue-950">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4 bg-blue-950">
            <div className="flex items-center gap-2 text-slate-50">
              <Shield className="h-6 w-6" />
              <span className="font-bold text-lg">Vibescurity</span>
            </div>
            <p className="text-sm text-muted-foreground">Let AI provide website security reports for your vibe-coded web apps.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/methodology" className="text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Free Scan
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-foreground">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:afllewellyn@gmail.com" className="text-muted-foreground hover:text-foreground">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="mailto:afllewellyn@gmail.com" className="text-muted-foreground hover:text-foreground">
                  Report Security Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Vibescurity. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;