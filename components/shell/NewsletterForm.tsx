"use client";
import { useState } from "react";

/**
 * Footer newsletter signup (same look as the live ElementsKit/Mailchimp form).
 * Posts to the Mailchimp embed endpoint when NEXT_PUBLIC_MAILCHIMP_ACTION is set
 * (Mailchimp → Audience → Signup forms → Embedded form → the form "action" URL).
 * Until then it falls back to an email to help@canxglobal.com so no signup is lost.
 */
export default function NewsletterForm() {
  const action = process.env.NEXT_PUBLIC_MAILCHIMP_ACTION;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (action) {
    return (
      <form className="cxf-news" action={action} method="post" target="_blank" noValidate>
        <label className="sr-only" htmlFor="cxf-email">Email address</label>
        <input id="cxf-email" type="email" name="EMAIL" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Subscribe</button>
      </form>
    );
  }
  return (
    <form
      className="cxf-news"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        window.location.href = `mailto:help@canxglobal.com?subject=${encodeURIComponent("Newsletter subscription")}&body=${encodeURIComponent(`Please subscribe ${email} to the Can X Global newsletter.`)}`;
        setDone(true);
      }}
    >
      <label className="sr-only" htmlFor="cxf-email">Email address</label>
      <input id="cxf-email" type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">{done ? "Thank you!" : "Subscribe"}</button>
    </form>
  );
}
