import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { ROUTES } from "@/lib/constants";
import type { CredentialGroup } from "@/services/cms/types";

/**
 * A slow, continuous rail of institutional marks for the home page.
 *
 * The full wall on /impact says who each one is and what the relationship
 * actually was. This is the short version: it exists to make a visitor who
 * has never heard of Khel Shiksha pause for a second, and then hand them the
 * page that explains it. So the whole rail is wrapped in ONE link to /impact
 * rather than pretending each logo is individually meaningful here.
 *
 * IT IS ONE LIST, RENDERED TWICE. The second copy is aria-hidden and exists
 * only so the animation can loop seamlessly — translating by exactly -50%
 * puts copy two where copy one started. Without hiding the duplicate a screen
 * reader would read all fifteen organisations twice, which is the usual way
 * marquees fail accessibility.
 *
 * The rail is not a carousel: nothing is hidden behind a control, there is no
 * autoplaying content anyone has to catch, and the same names are listed in
 * full on /impact. Under prefers-reduced-motion it simply stops and wraps —
 * see .logo-rail in globals.css. That matters more than usual here, because
 * continuous horizontal motion is a common migraine and vestibular trigger.
 */
export function LogoMarquee({
  groups,
  eyebrow,
  title,
}: {
  groups: CredentialGroup[];
  eyebrow: string;
  title: string;
}) {
  const marks = groups.flatMap((group) => group.items);
  if (marks.length === 0) return null;

  const rail = (hidden: boolean) => (
    <ul className="logo-rail-track" aria-hidden={hidden || undefined}>
      {marks.map((item) => (
        <li key={`${hidden ? "b" : "a"}-${item.name}`} className="shrink-0">
          <Image
            src={`/logos/${item.file}`}
            alt={hidden ? "" : item.name}
            width={150}
            height={56}
            loading="lazy"
            className="h-12 w-auto object-contain opacity-65 grayscale sm:h-14"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Section className="bg-sunken py-12 lg:py-16">
      <Container className="flex flex-col gap-2">
        <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
          {eyebrow}
        </p>
        <h2 className="text-h3 text-ink">{title}</h2>
      </Container>

      {/* Full-bleed: the rail should run off both edges so it reads as
          continuing rather than as a box of logos. */}
      <div className="logo-rail mt-8">
        <div className="logo-rail-inner">
          {rail(false)}
          {rail(true)}
        </div>
      </div>

      <Container className="mt-8">
        <Link
          href={ROUTES.impact}
          className="text-body-sm text-brand-deep font-semibold underline underline-offset-4"
        >
          See what we built for each of them
        </Link>
      </Container>
    </Section>
  );
}
