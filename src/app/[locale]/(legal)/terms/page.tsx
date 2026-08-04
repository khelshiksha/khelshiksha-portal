import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: "The terms that apply to your use of the Khel Shiksha website.",
  path: "/terms",
});

/**
 * DRAFT — accurate to what this site does, but NOT legally reviewed. Have a
 * lawyer check this before launch.
 */
export default function TermsPage() {
  return (
    <>
      <h1 className="text-h1">Terms of Use</h1>
      <p className="text-body-sm text-ink-subtle">
        Last updated {new Date().getFullYear()}.
      </p>

      <h2>About this site</h2>
      <p>
        This website is operated by {SITE.name}. It describes our learning kits,
        teacher training and school programmes, and lets you send us an enquiry.
      </p>

      <h2>No online sales</h2>
      <p>
        Nothing on this site is an offer to sell. Kits are supplied as part of a
        school programme, and any pricing, quantities and terms are agreed
        separately in writing. Product pages are descriptive, not a price list.
      </p>

      <h2>Accuracy</h2>
      <p>
        We work to keep descriptions, outcomes and curriculum mappings accurate,
        and we correct errors when we find them. Specifications may change as
        kits are revised.
      </p>

      <h2>Your enquiries</h2>
      <p>
        Please send us accurate contact details, and do not submit information
        about other people — particularly children — without their consent. We
        may decline or remove submissions that are abusive or automated.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The {SITE.name} name, logo, kit names and the content of this site
        belong to us. Third-party names and marks referenced on this site belong
        to their respective owners and are used to describe work we have done
        with them.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </>
  );
}
