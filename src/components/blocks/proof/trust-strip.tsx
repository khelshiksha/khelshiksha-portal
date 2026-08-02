import { Check } from "lucide-react";

/**
 * A row of short, checkable claims — the reassurance a principal needs before
 * they will spend attention on anything else.
 *
 * Sits directly under the hero's call to action, because that is the moment
 * the question "is this a real programme?" occurs and the moment it is
 * cheapest to answer. Below the fold it would be answering a question nobody
 * is still asking.
 *
 * CLAIMS, NOT COUNTS. Every item here is something that is either true of the
 * programme or not — alignment with a published framework, what is included.
 * No "12,000 schools", no "50,000 children", until those numbers can be
 * sourced and attributed. An unverifiable number in a trust component does
 * the opposite of its job the first time someone checks it.
 *
 * Deliberately a plain list of strings rather than a schema with icons and
 * colours per item. The strip is reused wherever the same reassurance is
 * needed, and a caller that has to pick an icon will eventually pick a
 * different one somewhere and the pattern stops reading as one thing.
 */
export function TrustStrip({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className ?? ""}`}
    >
      {items.map((item) => (
        <li
          key={item}
          className="text-body-sm text-ink-muted flex items-center gap-2 font-semibold"
        >
          {/* Decorative: the text already says it. A screen reader announcing
              "check mark" before each item would just add noise to a list. */}
          <Check
            aria-hidden="true"
            className="text-success size-4 shrink-0"
            strokeWidth={3}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
