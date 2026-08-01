import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

/**
 * The body of a 404, without any page chrome.
 *
 * Shared by two boundaries that need the same words but different wrappers:
 *
 *   app/[locale]/not-found.tsx            supplies its own header and footer
 *   app/[locale]/(marketing)/not-found.tsx  gets them from the group layout
 *
 * The second one exists because Next resolves a not-found boundary by walking
 * UP from the segment that called notFound(), and a boundary sitting outside
 * the route group is not found on that walk. Without it, an unknown kit slug
 * rendered Next's raw error document — no lang attribute, no navigation, no
 * way back. See the note in (marketing)/not-found.tsx.
 *
 * A 404 on this site is most often a stale link from a printed brochure or a
 * kit that has been renamed, so it offers the destinations people were
 * probably reaching for rather than a dead end and an apology.
 */
export function NotFoundContent() {
  return (
    <Container className="flex flex-col items-start gap-6 py-24 lg:py-32">
      <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
        404
      </p>
      <h1 className="text-display-2 text-ink max-w-[16ch]">
        That page has <em className="accent-phrase">wandered off.</em>
      </h1>
      <p className="measure text-body-lg text-ink-muted">
        The link may be out of date, or the page may have moved. Here are the
        places people usually want.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={ROUTES.home} size="lg">
          Back to home
        </ButtonLink>
        <ButtonLink href={ROUTES.products} variant="secondary" size="lg">
          Browse the kits
        </ButtonLink>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {[
          ["For Schools", ROUTES.schools],
          ["For Teachers", ROUTES.teachers],
          ["For Parents", ROUTES.parents],
          ["Government & NGOs", ROUTES.government],
          ["Contact", ROUTES.contact],
        ].map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-body-sm text-brand-deep font-semibold underline underline-offset-4"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
