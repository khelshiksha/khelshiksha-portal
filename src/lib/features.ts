/**
 * Kill switches for the two services that cost money.
 *
 * PAUSED 2026-08-02 at the owner's instruction, pending billing. Set either
 * flag back to `true` and redeploy to restore it — nothing else needs to
 * change, and no API key had to be deleted from Vercel to switch them off,
 * so nothing has to be found again later.
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
 *              THE COST IS THAT NOBODY IS TOLD. While this is false, new
 *              enquiries arrive silently and someone has to look in the
 *              database to find them. That is the whole risk of this flag and
 *              it is a business risk, not a technical one.
 */
export const FEATURES = {
  /** Google Gemini — see services/ai. */
  assistant: false,
  /** Resend — see services/email. */
  leadEmail: false,
} as const;

/** Shown wherever a paused service has to explain itself. */
export const PAUSED_MESSAGE =
  "This service is temporarily unavailable. Please call or email us instead.";
