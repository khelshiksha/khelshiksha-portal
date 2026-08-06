import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Mascot } from "@/components/ui/mascot";
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
 * rendered Next's raw error document - no lang attribute, no navigation, no
 * way back. See the note in (marketing)/not-found.tsx.
 *
 * A 404 on this site is most often a stale link from a printed brochure or a
 * kit that has been renamed, so it offers the destinations people were
 * probably reaching for rather than a dead end and an apology.
 *
 * That same fact is why the mascot earns its place here and on few other
 * pages: the person reading this is, statistically, holding the brochure the
 * mascot is drawn in the style of. A dead end is also the one surface on the
 * site with nothing to look at - a left-aligned column of text and a column of
 * dead air beside it - so warming it costs nothing that was doing work.
 */
export function NotFoundContent() {
  return (
    <Container className="flex flex-col gap-6 py-24 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:py-32">
      <div className="flex flex-col items-start gap-6">
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
      </div>

      {/* Desktop only. On a phone the 404 is already a full screen of text and
          buttons with nothing spare, and a figure below the fold of an error
          page is weight nobody asked for. The dead air this fills only exists
          once there are two columns to have air between. */}
      <div className="hidden shrink-0 lg:block">
        <Mascot crop="standing" size="lg" />
      </div>
    </Container>
  );
}
