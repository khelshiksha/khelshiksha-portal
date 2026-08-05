import "server-only";
import { Resend } from "resend";
import { SITE } from "@/lib/constants";
import { FEATURES } from "@/lib/features";
import type { LeadInput } from "@/features/leads/schema";

/**
 * Lead notification - tells the team that an enquiry has arrived.
 *
 * FIRE-AND-FORGET BY DESIGN, and this is the most important thing to preserve
 * about the file. The enquiry is already written to the store by the time
 * this runs, so nothing here may throw: an email provider outage must never
 * turn a submission the visitor has already completed into an error they see.
 * Every failure path below logs and returns.
 *
 * The consequence to understand is that a FAILED send is indistinguishable
 * from a successful one anywhere outside these logs. That is the correct
 * trade - losing a notification is recoverable, telling a school their
 * enquiry failed when it did not is not - but it means the logs are the only
 * place the truth appears, and it means the delivery path must be verified by
 * sending a real enquiry rather than by reading code.
 *
 * Requires RESEND_API_KEY and LEAD_NOTIFY_TO. With either absent it logs what
 * it would have sent, so the wiring is visible in development instead of
 * silently doing nothing.
 */

const SEND_TIMEOUT_MS = 10_000;

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
 * FEATURES.leadEmail is checked FIRST and wins over a present API key. It is
 * a manual switch (see lib/features) for taking notification out of service
 * without removing the credential, so that restoring it is one boolean rather
 * than a hunt for a lost key.
 *
 * Turning it off cannot lose an enquiry: the lead is stored before this
 * function is ever called and no path here throws. It can only stop anyone
 * being TOLD about one - which is the whole risk, and an operational one
 * rather than a technical one.
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
  const subject = `${label}, ${lead.name}${lead.organisation ? ` (${lead.organisation})` : ""}`;

  if (!isEmailConfigured()) {
    /* Two different situations, two different log levels, because they need
       different responses.

       A deliberate switch is a warning: a real person has enquired, the
       record is safe, and nobody has been told - so someone has to go and
       read the store. Saying where the enquiry IS is the useful half of the
       message.

       A missing key is merely information, because that is the normal state
       of a development machine and logging it loudly would train people to
       ignore the line. */
    if (!FEATURES.leadEmail) {
      console.warn(
        `[email] DISABLED (FEATURES.leadEmail=false), lead ${leadId} IS STORED ` +
          `and nobody has been notified. Subject would have been: "${subject}"`,
      );
    } else {
      console.info(
        `[email] not configured, would have sent "${subject}" for lead ${leadId}`,
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

  const from =
    process.env.LEAD_NOTIFY_FROM ?? `enquiries@${new URL(SITE.url).hostname}`;
  const to = (process.env.LEAD_NOTIFY_TO ?? "").split(",").map((s) => s.trim());

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    /* Bounded, because this is now awaited by the server action: without a
       ceiling, a provider that accepts the connection and then stalls would
       hold a visitor's form open for as long as the platform allows. Ten
       seconds is far above the normal round trip and far below anything a
       person would sit through. Losing the notification is recoverable;
       leaving someone staring at a spinner is not. */
    const send = resend.emails.send({
      from,
      to,
      /* So hitting reply in the inbox goes straight to the enquirer. */
      replyTo: lead.email || undefined,
      subject,
      text,
    });

    const result = await Promise.race([
      send,
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), SEND_TIMEOUT_MS),
      ),
    ]);

    if (result === null) {
      console.error(
        `[email] TIMED OUT after ${SEND_TIMEOUT_MS}ms for lead ${leadId}. ` +
          `The lead IS STORED. Nobody has been notified.`,
      );
      return;
    }

    if (result.error) {
      console.error(
        `[email] send failed for lead ${leadId}:`,
        result.error.message,
        `(from ${from} to ${to.join(", ")})`,
        "- the lead IS STORED, nobody has been notified",
      );
      return;
    }

    /* ACCEPTED IS NOT DELIVERED, and the gap between the two is where this
       last went wrong. The provider returns an id the moment it takes the
       request; whether the message then reaches a mailbox depends on sender
       verification, the recipient's filters and the recipient's server, none
       of which report back here.

       So log the id and both addresses. Without the id there is nothing to
       look up in the provider's own delivery log, and "the code says it sent
       it" is not evidence that anyone received it. Without the addresses,
       sending to the wrong mailbox is indistinguishable from not sending. */
    console.info(
      `[email] accepted by provider for lead ${leadId}: id ${result.data?.id ?? "unknown"}, ` +
        `from ${from}, to ${to.join(", ")}. Accepted is not delivered - ` +
        `check the provider's delivery log for this id if it does not arrive.`,
    );
  } catch (error) {
    console.error(
      `[email] send threw for lead ${leadId}:`,
      error,
      "- the lead IS STORED, nobody has been notified",
    );
  }
}
