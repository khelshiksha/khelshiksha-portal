import { Panel } from "@/components/ui/container";
import { isAssistantConfigured } from "@/services/ai";
import { getPageLabels } from "../lib/page-labels";
import { AssistantPanel } from "./assistant-panel";

/**
 * Renders nothing when GOOGLE_API_KEY is absent.
 *
 * A chat box that returns an error on every question is worse than no chat
 * box - it reads as a broken site to the one visitor type we most need to
 * take us seriously. The check is server-side, so an unconfigured deploy
 * never ships the panel's JavaScript to anyone either.
 *
 * IMPORTANT - this is a BUILD-TIME decision, not a request-time one. The home
 * page is statically prerendered, so whether the panel exists is baked into
 * the HTML by whatever the environment looked like during `next build`.
 * Adding the key to Vercel and NOT redeploying leaves the panel absent, which
 * looks like the feature silently failing. Adding the key must be followed by
 * a redeploy.
 *
 * The alternative - reading the key per request - would make the whole home
 * page dynamic and give up the static generation that holds LCP under a
 * second on 4G. Not worth it to save one redeploy.
 */
export async function AssistantSection() {
  if (!isAssistantConfigured()) return null;

  /* Resolved on the server so the client never pulls the catalogue over the
     wire just to caption a link. */
  const pageLabels = await getPageLabels();

  return (
    <Panel tone="dark" labelledBy="assistant-heading">
      <AssistantPanel pageLabels={pageLabels} />
    </Panel>
  );
}
