import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Present on every page below depth 1, and always paired with BreadcrumbList
 * structured data — the visual trail and the machine-readable one should never
 * be able to drift apart, so they are emitted from the same array.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const t = getDictionary();
  const full: Crumb[] = [{ name: t.nav.home, path: "/" }, ...trail];

  return (
    <>
      <nav aria-label={t.nav.breadcrumb}>
        <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-ink-muted">
          {full.map((crumb, i) => {
            const isLast = i === full.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="font-semibold text-ink">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.path}
                      className="transition-colors hover:text-brand-deep"
                    >
                      {crumb.name}
                    </Link>
                    <ChevronRight
                      size={13}
                      aria-hidden="true"
                      className="text-ink-subtle"
                    />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(full)} />
    </>
  );
}
