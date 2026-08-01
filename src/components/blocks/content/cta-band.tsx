import { Panel } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

/**
 * The closing band. Every page ends in one — no dead ends, per the IA rules.
 * Rendered as an inset rounded panel; the `on-brand` class that scopes the
 * focus-ring override travels with the `brand` tone in Panel, so the ring
 * still survives against the blue ground.
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
    <Panel
      tone="brand"
      innerClassName="flex flex-col items-center gap-7 text-center"
    >
      <h2 className="text-h1 text-on-band-brand max-w-[20ch]">
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
            className="border-on-band-brand/45 text-on-band-brand hover:bg-on-band-brand/10 border bg-transparent"
          >
            {secondary.label}
          </ButtonLink>
        ) : null}
      </div>
    </Panel>
  );
}
