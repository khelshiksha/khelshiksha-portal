/**
 * Kill switches for the two services that cost money.
 *
 * BOTH LIVE AGAIN as of 2026-08-04, billing resolved. They were paused on
 * 2026-08-02; the switches stay because the next billing gap, model
 * deprecation or provider outage will want them, and because a feature that
 * can be turned off in one line is a feature that never has to be ripped out
 * in a hurry.
 *
 * Set either back to `false` and redeploy to pause it again. No API key ever
 * has to be deleted to do that — which is the point, since a deleted key is
 * one nobody can find later.
 *
 * These are constants rather than environment variables on purpose. An env
 * var would be invisible in the repo, would need the right environment
 * selected in the Vercel dashboard to take effect, and would give no clue in
 * review why a feature is missing. A flag in the tree is greppable, shows up
 * in the diff, and carries the reason with it.
 *
 * WHAT EACH ONE ACTUALLY DOES — the difference matters:
 *
 *   assistant  Turns the whole feature off. The panel is not rendered and its
 *              JavaScript is never sent, and /api/assistant refuses. Nobody
 *              sees a chat box that cannot answer.
 *
 *   leadEmail  Suppresses the NOTIFICATION only. Enquiries are still written
 *              to the database exactly as before — sendLeadNotification has
 *              always run after the lead is stored, and it has never been
 *              able to fail a submission. A visitor who fills in the form is
 *              still recorded and is still told the truth.
 *
 *              THE COST OF PAUSING IT IS THAT NOBODY IS TOLD. While it is
 *              false, new enquiries arrive silently and someone has to look
 *              in the database to find them. That is a business risk, not a
 *              technical one, which is exactly why it is easy to miss.
 *
 * TURNING leadEmail BACK ON IS NOT PROOF THAT MAIL ARRIVES. This flag only
 * decides whether Resend is called. Whether the message lands depends on
 * LEAD_NOTIFY_FROM being a sender Resend will accept: while it is set to
 * `onboarding@resend.dev` — the shared address used because khelshiksha.com
 * is not a verified domain — Resend delivers ONLY to the Resend account
 * owner's own address and silently drops everything else. And the send path
 * logs rather than throws, by design, so a rejected notification looks
 * exactly like a successful one from the outside. Send one real test enquiry
 * after any change here and confirm it lands in the inbox.
 */
export const FEATURES = {
  /** Google Gemini — see services/ai. */
  assistant: true,
  /** Resend — see services/email. */
  leadEmail: true,
} as const;

/** Shown wherever a paused service has to explain itself. */
export const PAUSED_MESSAGE =
  "This service is temporarily unavailable. Please call or email us instead.";
