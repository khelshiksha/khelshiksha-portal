import { cn } from "@/lib/utils";

/**
 * Owns the signature typographic pattern from the brochure: a bold sans
 * heading with ONE italic Fraunces phrase inside it.
 *
 * `accent` is the phrase to italicise, appended to `title`. At most one per
 * section — overuse turns a signature into a tic.
 */
export function SectionTitle({
  eyebrow,
  title,
  accent,
  lede,
  align = "left",
  level = 2,
  id,
  className,
  tone = "default",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  lede?: string;
  align?: "left" | "center";
  level?: 1 | 2 | 3;
  id?: string;
  className?: string;
  tone?: "default" | "on-brand";
}) {
  const Heading = `h${level}` as "h1" | "h2" | "h3";
  const sizeClass =
    level === 1 ? "text-display-2" : level === 2 ? "text-h2" : "text-h3";

  const onBrand = tone === "on-brand";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-label font-bold tracking-[0.16em] uppercase",
            onBrand ? "text-on-brand/75" : "text-ink-subtle",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Heading
        id={id}
        className={cn(
          sizeClass,
          "max-w-[22ch]",
          align === "center" && "mx-auto",
          onBrand && "text-on-brand",
        )}
      >
        {title}
        {accent ? (
          <>
            {" "}
            <em className={cn("accent-phrase", onBrand && "text-accent")}>
              {accent}
            </em>
          </>
        ) : null}
      </Heading>

      {lede ? (
        <p
          className={cn(
            "text-body-lg measure",
            onBrand ? "text-on-brand/85" : "text-ink-muted",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
