
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  honey?: string; // honeypot
};

const sanitize = (str: string, max = 2000) =>
  String(str ?? "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, max);

serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactPayload = await req.json();
    const name = sanitize(body?.name || "", 120);
    const email = String(body?.email || "").trim().slice(0, 200);
    const message = sanitize(body?.message || "", 3000);
    const honey = String(body?.honey || "");

    // Simple validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (honey) {
      // Likely bot, pretend success
      console.log("[contact-submit] Honeypot triggered, ignoring submission.");
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (name.length < 2 || name.length > 120) {
      return new Response(JSON.stringify({ error: "Invalid name length." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (message.length < 10 || message.length > 3000) {
      return new Response(JSON.stringify({ error: "Message length out of bounds." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const CONTACT_TO_EMAIL = Deno.env.get("CONTACT_TO_EMAIL");

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
      console.error("[contact-submit] Missing RESEND_API_KEY or CONTACT_TO_EMAIL secret.");
      return new Response(JSON.stringify({ error: "Email service not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const resend = new Resend(RESEND_API_KEY);

    const html = `
      <div>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${message}</pre>
        <hr />
        <small>Submitted via Vibe Defender contact form.</small>
      </div>
    `;

    console.log("[contact-submit] Sending email to support inbox.");

    const emailResponse = await resend.emails.send({
      from: "Vibe Defender <onboarding@resend.dev>",
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: "New contact form submission",
      html,
    });

    console.log("[contact-submit] Email sent:", emailResponse?.id || "no-id");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("[contact-submit] Error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
