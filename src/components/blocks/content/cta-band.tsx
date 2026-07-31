import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

/**
 * The closing band. Every page ends in one — no dead ends, per the IA rules.
 * `on-brand` scopes the focus-ring override so the blue ring does not vanish
 * against the blue ground.
 */
export function CTABand({
  title,
  accent,
  lede,
  primary,
  secondary,
}: {
  title: string;
  accent?: string;
  lede?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="on-brand bg-band-brand">
      <Container className="flex flex-col items-center gap-7 py-20 text-center lg:py-28">
        <h2 className="max-w-[20ch] text-h1 text-on-band-brand">
          {title}
          {accent ? (
            <>
              {" "}
              <em className="accent-phrase text-accent">{accent}</em>
            </>
          ) : null}
        </h2>

        {lede ? (
          <p className="measure text-body-lg text-on-band-brand/85">{lede}</p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={primary.href}
            size="lg"
            className="bg-on-band-brand text-band-brand hover:bg-accent hover:text-on-accent"
          >
            {primary.label}
          </ButtonLink>
          {secondary ? (
            <ButtonLink
              href={secondary.href}
              size="lg"
              className="border border-on-band-brand/45 bg-transparent text-on-band-brand hover:bg-on-band-brand/10"
            >
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
