import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact | Vibe Defender';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-muted-foreground">
            Have a question or feedback? Please use this page to reach us. We do not expose email addresses to reduce spam and protect privacy.
          </p>
          <p className="text-sm text-muted-foreground">
            For security issues, describe the problem and include a URL if possible. Do not include sensitive credentials.
          </p>
          <aside className="text-xs text-muted-foreground">
            Automated security scanning for publicly accessible endpoints only. Respectful scanning practices – max 1 request per 100ms. No attempts to exploit or damage target systems.
          </aside>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
