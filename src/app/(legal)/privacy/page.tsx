import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Khel Shiksha collects, uses and protects personal information submitted through this website.",
  path: "/privacy",
});

/**
 * DRAFT — written to reflect what this site actually does technically, so it
 * is accurate rather than boilerplate. It has NOT been reviewed by a lawyer
 * and should be before launch, particularly on DPDP Act 2023 obligations.
 */
export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-h1">Privacy Policy</h1>
      <p className="text-body-sm text-ink-subtle">
        Last updated {new Date().getFullYear()}. This policy describes how{" "}
        {SITE.name} handles information submitted through this website.
      </p>

      <h2>What we collect</h2>
      <p>
        We collect only what you type into an enquiry form: your name, mobile
        number, and optionally your email address, school or organisation,
        district, role and message.
      </p>

      <h2>What we never collect</h2>
      <p>
        <strong>We do not collect information about children.</strong> Our
        forms ask about a child&rsquo;s age band and interests only — never a
        name, school, photograph or any other identifying detail. This is a
        deliberate product constraint, not only a policy statement.
      </p>
      <p>
        We also do not store your IP address. Where we need to limit repeated
        submissions, we store a one-way cryptographic hash of it, which cannot
        be reversed to identify you.
      </p>

      <h2>Why we collect it</h2>
      <p>
        To respond to your enquiry. If you tick the consent box, we may also
        send occasional updates about classroom resources. That box is never
        pre-ticked, and you can unsubscribe from any message we send.
      </p>

      <h2>Who we share it with</h2>
      <p>
        Nobody. We do not sell, rent or trade personal information. We use
        service providers for hosting and email delivery, who process data only
        on our instructions.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Enquiries are kept until they are no longer needed for the conversation
        you started. Technical logs are deleted after 180 days.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us what we hold about you, ask us to correct it, or ask us
        to delete it. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
        and we will respond within 30 days.
      </p>

      <h2>Contact</h2>
      <p>
        {SITE.name} — <a href={`mailto:${SITE.email}`}>{SITE.email}</a>,{" "}
        {SITE.phones[0]}.
      </p>
    </>
  );
}
