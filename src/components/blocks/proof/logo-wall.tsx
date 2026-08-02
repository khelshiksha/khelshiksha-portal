import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import type { CredentialGroup } from "@/services/cms/types";

/**
 * Institutional marks, grouped by what they actually claim.
 *
 * The heading and the note above each row are not decoration — they are the
 * difference between a factual statement and an implied endorsement. A single
 * undifferentiated "Our Partners" wall would say that UNICEF and the Ministry
 * of Education endorse a commercial product, which is not what happened and
 * not a claim anyone here can support. See content/credentials.ts.
 *
 * `relationship`, where present, is rendered as visible text under the logo
 * rather than hidden in a tooltip, because the qualifier is the point. "Kit
 * developed for the 1st World Yogasana Sports Championship" is a much better
 * story than an unexplained logo, and it is one that survives being checked.
 *
 * Marks are greyed back at rest and come to full colour on hover — and are
 * INVERTED rather than merely greyed in dark mode, because these files are
 * dark ink drawn for white paper. See .logo-mark in globals.css; the rule is
 * shared with the home page rail so the two can never drift apart.
 */
export function LogoWall({
  groups,
  tone = "plain",
}: {
  groups: CredentialGroup[];
  tone?: "plain" | "sunken";
}) {
  if (groups.length === 0) return null;

  return (
    <Section className={tone === "sunken" ? "bg-sunken" : undefined}>
      <Container className="flex flex-col gap-12">
        {groups.map((group) => (
          <div key={group._id} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-h3 text-ink">{group.heading}</h2>
              <p className="measure text-body-sm text-ink-muted">{group.note}</p>
            </div>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {group.items.map((item) => (
                <li key={item.name} className="flex flex-col items-center gap-2 text-center">
                  {/* The row is a fixed 4rem tall and each mark keeps its own
                      ratio inside it — declared per file rather than as one
                      shared 160x64, which letterboxed every logo into a box
                      of the wrong shape. */}
                  <div className="flex h-16 items-center justify-center">
                    <Image
                      src={`/logos/${item.file}`}
                      alt={item.name}
                      width={item.w}
                      height={item.h}
                      /* Below the fold on every page that uses this. */
                      loading="lazy"
                      className="logo-mark logo-mark-interactive max-h-16 w-auto"
                    />
                  </div>
                  {item.relationship !== undefined && (
                    <p className="text-body-xs text-ink-subtle max-w-[22ch] leading-snug">
                      {item.relationship}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </Section>
  );
}
