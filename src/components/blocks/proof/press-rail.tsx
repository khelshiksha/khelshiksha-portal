import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import type { PressCutting } from "@/services/cms/types";

/**
 * A scrolling band of real newspaper coverage, for the foot of the home page.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS PRESS AND NOT TESTIMONIALS.
 *
 * The brief for this section was a scrolling band of customer feedback. There
 * is none to show: `testimonials` in content/impact.ts is an EMPTY ARRAY, and
 * the note above it explains why - a quote attributed to a named principal is
 * a record about a real person, and writing a plausible one would be
 * fabrication no matter how clearly the code labelled it, because the
 * rendered page reads as a real endorsement to a school deciding whether to
 * buy. That reasoning did not stop being true because a carousel was wanted.
 *
 * So this band does the job with material that IS real: seven scanned
 * cuttings of Gujarati press coverage, already on /impact, already carrying
 * alt text describing what each one reports. A visitor gets the same
 * reassurance - other people have looked at this and written about it - from
 * something that would survive being checked.
 *
 * When three real quotes exist (one principal, one teacher, one parent), a
 * testimonial rail belongs here too, alongside this rather than instead of
 * it. The two prove different things.
 *
 * ---------------------------------------------------------------------------
 * MECHANICS, INHERITED FROM logo-marquee.tsx ON PURPOSE.
 *
 * Same .logo-rail / .logo-rail-inner / .logo-rail-track classes, so the two
 * bands on this page move at one speed and stop together under
 * prefers-reduced-motion. Two rails that drifted at different rates would
 * read as a bug even though each was fine alone.
 *
 * ONE LIST, RENDERED TWICE. The second copy is aria-hidden and exists only so
 * the animation loops seamlessly - translating by -50% puts copy two where
 * copy one started. Without hiding the duplicate a screen reader would read
 * all seven cuttings twice, which is the usual way marquees fail.
 *
 * Nothing here is a carousel: no control hides anything, and every cutting is
 * shown in full on /impact. Continuous horizontal motion is a migraine and
 * vestibular trigger, which is why the reduced-motion stop matters more here
 * than it would on a decorative animation.
 */
export function PressRail({
  cuttings,
  eyebrow,
  title,
}: {
  cuttings: PressCutting[];
  eyebrow: string;
  title: string;
}) {
  /* Same empty-case contract as LogoMarquee and the testimonial section:
     render nothing rather than a titled band with a hole in it. The page is
     complete without this. */
  if (cuttings.length === 0) return null;

  const rail = (hidden: boolean) => (
    <ul className="logo-rail-track" aria-hidden={hidden || undefined}>
      {cuttings.map((cutting) => (
        <li key={`${hidden ? "b" : "a"}-${cutting._id}`} className="shrink-0">
          {/* A FIXED HEIGHT AND AN AUTO WIDTH, unlike the logo rail's
              intrinsic sizing. These are scans at whatever dimensions the
              originals happened to be, so a shared height is what makes the
              band read as a row of cuttings rather than a ragged edge.

              width/height are the box next/image reserves, not a claim about
              the file - object-cover crops to the frame, and h-auto would
              reintroduce the ragged edge the fixed height exists to remove. */}
          <Image
            src={`/press/${cutting.file}`}
            /* Empty on the duplicate, so the same seven reports are not
               announced twice. */
            alt={hidden ? "" : cutting.alt}
            width={280}
            height={200}
            loading="lazy"
            className="border-rule h-40 w-auto rounded-[var(--radius-md)] border object-cover sm:h-48"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Section className="py-8 lg:py-10">
      <Container>
        {/* The panel treatment the logo rail and the stat band share, for the
            same reason they share it: three blocks making the same kind of
            claim within a screen of each other should read as a set. */}
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
