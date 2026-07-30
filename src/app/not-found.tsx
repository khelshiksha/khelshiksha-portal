import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SiteHeader } from "@/components/blocks/navigation/site-header";
import { SiteFooter } from "@/components/blocks/navigation/site-footer";
import { ROUTES } from "@/lib/constants";

/* Returns a real 404 status, not a soft 200. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center">
        <Container className="flex flex-col items-start gap-6 py-24 lg:py-32">
          <p className="text-label font-bold tracking-[0.16em] text-ink-subtle uppercase">
            404
          </p>
          <h1 className="max-w-[16ch] text-display-2 text-ink">
            That page has{" "}
            <em className="accent-phrase">wandered off.</em>
          </h1>
          <p className="measure text-body-lg text-ink-muted">
            The link may be out of date, or the page may have moved. Here are
            the places people usually want.
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
                  className="text-body-sm font-semibold text-brand-deep underline underline-offset-4"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
