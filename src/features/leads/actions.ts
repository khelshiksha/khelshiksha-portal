"use server";

import { headers } from "next/headers";
import { SITE } from "@/lib/constants";
import { hashIp, rateLimit } from "@/lib/rate-limit";
import {
  getLeadRepository,
  LeadStorageUnavailableError,
} from "@/services/db/lead-repository";
import { sendLeadNotification } from "@/services/email";
import { leadSchema, schoolDemoSchema, type ActionResult } from "./schema";

/**
 * Every lead action follows the same five steps:
 *   honeypot → validate → rate limit → persist → notify.
 *
 * Returns a discriminated union rather than throwing: a validation failure is
 * an expected outcome, not an exception.
 */
export async function submitLead(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  /* 1. Honeypot. A bot fills every field it can see; a human never sees this
        one. Return success so the bot has no signal to adapt to. */
  if (formData.get("company_website")) {
    return { ok: true, message: "Thank you — we've got it." };
  }

  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  const type = String(raw.type ?? "general");

  /* 2. Validate. The client already checked; this is the check that counts. */
  const schema = type === "school-demo" ? schoolDemoSchema : leadSchema;
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const headerList = await headers();
  const ipHash = hashIp(headerList.get("x-forwarded-for"));

  /* 3. Rate limit on the hashed IP.

     When the client cannot be identified (no x-forwarded-for — direct origin
     access, a misconfigured proxy, some corporate egress), an "unknown"
     bucket would put EVERY anonymous visitor on one shared 5/hour limit and
     lock out legitimate enquiries site-wide. Caught by the E2E suite, where
     the sixth submission of the run started failing.

     So: per-client limit when we can identify them, a generous global ceiling
     when we cannot. A burst is still contained; normal traffic is not. */
  const allowed = ipHash
    ? await rateLimit(`lead:${ipHash}`, { limit: 5, windowSec: 3600 })
    : await rateLimit("lead:unidentified", { limit: 200, windowSec: 3600 });

  if (!allowed) {
    return {
      ok: false,
      error: `You've sent a few enquiries already. Please call us on ${SITE.phones[0]} and we'll help right away.`,
    };
  }

  /* 4. Persist. */
  let leadId: string;
  try {
    const lead = await getLeadRepository().create(parsed.data, {
      ipHash,
      userAgent: headerList.get("user-agent"),
    });
    leadId = lead.id;
  } catch (error) {
    if (error instanceof LeadStorageUnavailableError) {
      /* Never report a false success — the enquiry would vanish. Give the
         person a route that definitely works instead. */
      console.error("[lead] storage unavailable — enquiry not persisted");
      return {
        ok: false,
        error: `We couldn't submit that just now. Please call us on ${SITE.phones[0]} or email ${SITE.email} and we'll pick it up straight away.`,
      };
    }

    console.error("[lead] unexpected failure", error);
    return {
      ok: false,
      error: `Something went wrong on our side. Please try again, or call us on ${SITE.phones[0]}.`,
    };
  }

  /* 5. Notify. Deliberately fire-and-forget: the enquiry is already stored,
        so an email provider outage must never fail a submission the visitor
        has completed. sendLeadNotification never throws, but the catch is
        kept so a future change to it cannot turn a success into an error. */
  void sendLeadNotification(parsed.data, leadId).catch((error) => {
    console.error("[lead] notification failed", error);
  });

  return {
    ok: true,
    message: "Thank you — someone from our team will call you within two working days.",
  };
}
