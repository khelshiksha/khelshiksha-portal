import "server-only";
import { Resend } from "resend";
import { SITE } from "@/lib/constants";
import { FEATURES } from "@/lib/features";
import type { LeadInput } from "@/features/leads/schema";

/**
 * Lead notification.
 *
 * Fire-and-forget by design: the enquiry is already safely stored by the time
 * this runs, so an email provider outage must never fail a submission the
 * visitor has completed. Every failure path here logs and returns; none of
 * them throw.
 *
 * Activates on RESEND_API_KEY. Until then it logs what it would have sent,
 * so the wiring is visible in development rather than silently absent.
 */

const LEAD_LABEL: Record<LeadInput["type"], string> = {
  "school-demo": "Demo request",
  "school-enquiry": "School enquiry",
  teacher: "Teacher question",
  parent: "Parent enquiry",
  government: "Government / proposal request",
  ngo: "NGO partnership",
  "product-enquiry": "Kit enquiry",
  general: "General enquiry",
};

/**
 * FEATURES.leadEmail is checked first and has to win over a present API key:
 * it is a manual pause for billing, and the key stays in Vercel so restoring
 * the notification is one boolean rather than a hunt for a credential.
 *
 * Everything downstream of this already treats "not configured" as normal —
 * the lead is stored before this function is ever called, and no path here
 * throws. So pausing notification cannot lose an enquiry. It can only stop
 * anyone being told about one, which is the risk documented in lib/features.
 */
export function isEmailConfigured(): boolean {
  if (!FEATURES.leadEmail) return false;
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO);
}

export async function sendLeadNotification(
  lead: LeadInput,
  leadId: string,
): Promise<void> {
  const label = LEAD_LABEL[lead.type];
  const subject = `${label} — ${lead.name}${lead.organisation ? ` (${lead.organisation})` : ""}`;

  if (!isEmailConfigured()) {
    /* Loud, and it says where the enquiry actually is. Whoever reads these
       logs while notification is paused needs one thing from this line: that
       a real person is waiting and the record is in the database. */
    if (!FEATURES.leadEmail) {
      console.warn(
        `[email] PAUSED (FEATURES.leadEmail=false) — lead ${leadId} IS STORED ` +
          `and nobody has been notified. Subject would have been: "${subject}"`,
      );
    } else {
      console.info(
        `[email] not configured — would have sent "${subject}" for lead ${leadId}`,
      );
    }
    return;
  }

  const rows: [string, string | null | undefined][] = [
    ["Type", label],
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Organisation", lead.organisation],
    ["District", lead.district],
    ["Preferred time", lead.preferredSlot],
    ["Kit of interest", lead.productId],
    ["Came from", lead.sourcePath],
    ["Marketing consent", lead.consentMarketing ? "Yes" : "No"],
  ];

  const text = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .concat(lead.message ? ["", "Message:", lead.message] : [])
    .concat(["", `Lead id: ${leadId}`])
    .join("\n");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.LEAD_NOTIFY_FROM ?? `enquiries@${new URL(SITE.url).hostname}`,
      to: (process.env.LEAD_NOTIFY_TO ?? "").split(",").map((s) => s.trim()),
      /* So hitting reply in the inbox goes straight to the enquirer. */
      replyTo: lead.email || undefined,
      subject,
      text,
    });

    if (error) {
      console.error(`[email] send failed for lead ${leadId}:`, error.message);
    }
  } catch (error) {
    console.error(`[email] send threw for lead ${leadId}:`, error);
  }
}
