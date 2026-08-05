import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import type { CredentialGroup } from "@/services/cms/types";

/**
 * A slow, continuous rail of institutional marks for the home page.
 *
 * The full wall on /impact says who each one is and what the relationship
 * actually was. This is the short version: it exists to make a visitor who
 * has never heard of Khel Shiksha pause for a second, on their way down a
 * page that is going to ask them for a demo.
 *
 * IT LINKS NOWHERE, on purpose. There was a "See what we built for each of
 * them" link under the rail; it went because Impact is already in the header,
 * in the mobile menu and in the footer, and a fourth invitation to the same
 * page turns a moment of reassurance into another thing to decide about. The
 * rail is a fact, stated once and then dropped.
 *
 * IT IS ONE LIST, RENDERED TWICE. The second copy is aria-hidden and exists
 * only so the animation can loop seamlessly - translating by exactly -50%
 * puts copy two where copy one started. Without hiding the duplicate a screen
 * reader would read all fifteen organisations twice, which is the usual way
 * marquees fail accessibility.
 *
 * The rail is not a carousel: nothing is hidden behind a control, there is no
 * autoplaying content anyone has to catch, and the same names are listed in
 * full on /impact. Under prefers-reduced-motion it simply stops and wraps -
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
          {/* The mark's OWN dimensions, not a shared 150x56 box. A crest and a
              wordmark are not the same shape, and forcing both into one ratio
              letterboxed each of them differently - which is what made the
              rail look like a row of boxes rather than a row of logos. No
              object-contain needed once the ratio is right. */}
          <Image
            src={`/logos/${item.file}`}
            alt={hidden ? "" : item.name}
            width={item.w}
            height={item.h}
            loading="lazy"
            /* .logo-mark is shared with the wall on /impact. No hover
               treatment here: the rail is moving, so a mark that lit under
               the pointer would light and then slide away from it. */
            className="logo-mark h-12 w-auto sm:h-14"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Section className="py-8 lg:py-10">
      <Container>
        {/* THE SAME PANEL AS THE 12,000+ KITS BAR - identical radius, border,
            ground and padding, deliberately. The two blocks make the same
            kind of claim ("here is the proof") and sit within one screen of
            each other, so reading as a matched pair is the point rather than
            a coincidence. It also gives the rail a defined edge to fade
            against, which a strip running off the viewport never had.

            overflow-hidden belongs on the PANEL, not just on the rail, or the
            logos ride out over the rounded corners. */}
        <div className="border-rule bg-sunken flex flex-col gap-6 overflow-hidden rounded-[var(--radius-2xl)] border py-9 sm:py-10">
          <div className="flex flex-col gap-2 px-6 text-center sm:px-10">
            <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
              {eyebrow}
            </p>
            <h2 className="text-h3 text-ink">{title}</h2>
          </div>

          <div className="logo-rail">
            <div className="logo-rail-inner">
              {rail(false)}
              {rail(true)}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
