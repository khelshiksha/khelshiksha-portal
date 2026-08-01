import Link from "next/link";

/**
 * Turns the site paths in an answer into real links.
 *
 * The system prompt tells the model to write paths bare "so the interface can
 * link them" — and then the interface didn't, so a parent reading
 * "/contact?type=school-demo" had to retype it. The instruction was always
 * half a feature.
 *
 * Deliberately a strict allow-list of known route prefixes rather than a
 * general URL matcher. The text being scanned is model output, and model
 * output is not trusted input: a general matcher would happily turn a
 * hallucinated or injected `https://…` into a live link out of the site. This
 * can only ever produce a same-origin link to a path shape the site actually
 * uses, so the worst case is a link to a 404 we control.
 */
/* The lookbehind is load-bearing, not tidiness. Without it, a path buried
   inside an external URL matched: "https://evil.example.com/products/free"
   had its "/products/free" tail lifted out and rendered as an internal link
   sitting immediately after the domain, which reads as though part of a
   third-party URL belongs to this site. Requiring the match to start at a
   token boundary means a path is only linked when it stands alone. */
const PATH_PATTERN =
  /(?<![\w:/.?=&#-])\/(?:products|approach|schools|teachers|parents|government|impact|about|contact|privacy|terms)(?:\/[a-z0-9-]+)*(?:\?[a-z0-9=&-]+)?/gi;

/* Trailing punctuation belongs to the sentence, not the URL: "see /contact."
   should link /contact and leave the full stop outside. */
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

export function linkifyPaths(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(PATH_PATTERN)) {
    const raw = match[0];
    const index = match.index ?? 0;

    const trailing = raw.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const href = trailing ? raw.slice(0, -trailing.length) : raw;

    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));

    nodes.push(
      <Link
        key={`link-${key++}`}
        href={href}
        className="text-accent font-semibold underline underline-offset-2"
      >
        {href}
      </Link>,
    );

    if (trailing) nodes.push(trailing);
    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
