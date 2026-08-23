/**
 * Runtime switches for the two features that depend on an external provider.
 *
 * Both are on. Set one to `false` and redeploy to take that feature out of
 * service - for a provider outage, a model deprecation, an incident, or any
 * other reason it needs to stop responding for a while.
 *
 * ## Why a constant and not an environment variable
 *
 * An env var is invisible in the repository, so a reviewer reading this code
 * cannot tell that a feature is disabled or why. It also has to be set on the
 * correct environment in the hosting dashboard to take effect, which is easy
 * to get wrong and gives no feedback when you do. A flag in the tree is
 * greppable, appears in the diff, and carries its reason with it.
 *
 * Disabling a feature here does NOT require removing its API key. Keep the
 * key in place: a credential that has been deleted is one nobody can find
 * again when the feature is wanted back.
 *
 * ## What each switch actually controls - the difference matters
 *
 * `assistant` removes the feature completely. The panel is not rendered, its
 * JavaScript is never sent to the browser, and `POST /api/assistant` responds
 * 503. Nobody is shown a chat box that cannot answer, which is the failure
 * mode worth avoiding - a visibly broken widget damages trust more than an
 * absent one.
 *
 * Note that the panel's presence is decided at BUILD time, because the home
 * page is statically prerendered. Changing this flag requires a redeploy to
 * take effect; changing it in isolation does nothing.
 *
 * `leadEmail` suppresses the notification email ONLY. Enquiries continue to
 * be written to the database exactly as before: `sendLeadNotification` runs
 * after the lead has been stored and cannot fail a submission. A visitor who
 * completes the form is still recorded, and is still told the truth.
 *
 * The cost of disabling it is that nobody is told. Enquiries then arrive
 * silently and someone has to read them out of the database. That is an
 * operational risk rather than a technical one, which is exactly why it is
 * easy to forget about.
 *
 * ## `leadEmail: true` is not proof that mail is delivered
 *
 * This flag decides only whether the email provider is called. Whether the
 * message arrives depends on `LEAD_NOTIFY_FROM` being a sender address the
 * provider will accept - which normally means an address on a domain that has
 * been verified with them.
 *
 * The send path logs failures rather than throwing, deliberately, so that a
 * provider problem can never fail an enquiry a visitor has already completed.
 * The side effect is that a rejected notification looks identical to a
 * delivered one from outside the system. After any change to the sender
 * address or the provider configuration, submit one real enquiry and confirm
 * it arrives in the destination inbox. Nothing short of that verifies it.
 */
export const FEATURES = {
  /**
   * OFF SINCE 2026-08-23. Google denied the API project access.
   *
   * Every gemini-3.x model returns 403 "Your project has been denied access"
   * and every gemini-2.x model returns 404 "no longer available to new
   * users", so there is no model this project can reach. A freshly created
   * key on the same project fails identically, which is what rules out a
   * revoked credential: the block is on the PROJECT, and no key issued from
   * it will work.
   *
   * Google's free tier still exists for Flash-class models and still needs no
   * card - the billing prompt in AI Studio is this project being flagged,
   * not the free tier ending. So the two ways back are a new Google Cloud
   * project, or a different provider behind services/ai (which is the only
   * file in the codebase importing a model SDK, so a swap is one file).
   *
   * The code is left in place deliberately - see the note below on keeping
   * credentials. Turning this back to `true` and redeploying is the whole of
   * the work once a working key exists.
   */
  assistant: false,
  /** Lead notification email. See services/email. */
  leadEmail: true,
} as const;

/** Copy for any surface that has to explain that a feature is unavailable. */
export const PAUSED_MESSAGE =
  "This service is temporarily unavailable. Please call or email us instead.";
