
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name.').max(120),
  email: z.string().email('Please enter a valid email.').max(200),
  message: z.string().min(10, 'Please provide a bit more detail.').max(3000),
  honey: z.string().optional(),
});

type ContactValues = z.infer<typeof ContactSchema>;

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact | Vibe Defender';
  }, []);

  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      honey: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: ContactValues) => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('contact-submit', {
        body: values,
      });

      if (error) {
        console.error('[Contact] submit error', error);
        toast({
          title: 'Something went wrong',
          description: 'We could not send your message. Please try again shortly.',
          variant: 'destructive',
        });
        return;
      }

      console.log('[Contact] submit ok', data);
      toast({
        title: 'Message sent',
        description: 'Thanks for reaching out — we’ll get back to you soon.',
      });
      form.reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Contact</h1>
            <p className="text-muted-foreground">
              Have a question or feedback? Use this form to reach us. We don’t expose email addresses to reduce spam and protect privacy.
            </p>
            <p className="text-sm text-muted-foreground">
              For security issues, describe the problem and include a URL if possible. Do not include sensitive credentials.
            </p>
            <aside className="text-xs text-muted-foreground">
              Automated security scanning for publicly accessible endpoints only. Respectful scanning practices – max 1 request per 100ms. No attempts to exploit or damage target systems.
            </aside>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                aria-hidden="true"
                tabIndex={-1}
                className="hidden"
                {...form.register('honey')}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormDescription>We’ll only use this to reply to your message.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="How can we help?" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? 'Sending…' : 'Send message'}
                </Button>
              </div>
            </form>
          </Form>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
