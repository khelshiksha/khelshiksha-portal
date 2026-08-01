import Link from "next/link";

/**
 * Turns the site paths in an answer into readable links.
 *
 * A sentence ending "...book a school demo with our team at
 * /contact?type=school-demo" reads like developer output. The link now
 * carries the page's name instead, so it reads as prose.
 *
 * Two shapes are handled, because the model produces both:
 *
 *   "read more about Aryabhata (/products/aryabhata)"  ->  the parenthetical
 *      is dropped and "Aryabhata" becomes the link, which is the form the
 *      system prompt asks for and the one that reads best;
 *
 *   "explore /products/aryabhata"  ->  the path is replaced by its known
 *      name. Prompt instructions are probabilistic, so the bare form has to
 *      keep working.
 *
 * Deliberately a strict allow-list of known route prefixes rather than a
 * general URL matcher. The text being scanned is model output, and model
 * output is not trusted input: a general matcher would happily turn a
 * hallucinated or injected `https://…` into a live link out of the site. This
 * can only ever produce a same-origin link to a path shape the site actually
 * uses, so the worst case is a link to a 404 we control.
 */

const ROUTE_PREFIXES =
  "products|approach|schools|teachers|parents|government|impact|about|contact|privacy|terms";

/* The lookbehind is load-bearing, not tidiness. Without it, a path buried
   inside an external URL matched: "https://evil.example.com/products/free"
   had its "/products/free" tail lifted out and rendered as an internal link
   sitting immediately after the domain, which reads as though part of a
   third-party URL belongs to this site. Requiring the match to start at a
   token boundary means a path is only linked when it stands alone. */
const PATH = `(?<![\\w:/.?=&#-])\\/(?:${ROUTE_PREFIXES})(?:\\/[a-z0-9-]+)*(?:\\?[a-z0-9=&-]+)?`;

/**
 * "Aryabhata (/products/aryabhata)" — the parenthetical form.
 *
 * Only the parenthetical is matched, not the words before it. Capturing the
 * label with a regex looked obvious and was wrong: even lazily quantified, the
 * engine takes the earliest start position, so "Read more about Aryabhata
 * (/products/aryabhata)" yielded the label "Read more about Aryabhata". The
 * preceding text is instead checked against the page's KNOWN name, which we
 * already have and which cannot be over-captured.
 */
const PARENTHETICAL_PATTERN = new RegExp(`\\s*\\((${PATH})\\)`, "gi");

const BARE_PATTERN = new RegExp(PATH, "gi");

/* Trailing punctuation belongs to the sentence, not the URL: "see /contact."
   should link /contact and leave the full stop outside. */
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

function anchor(href: string, label: string, key: number) {
  return (
    <Link
      key={`link-${key}`}
      href={href}
      className="text-accent font-semibold underline underline-offset-2"
    >
      {label}
    </Link>
  );
}

export function linkifyPaths(
  text: string,
  labels: Record<string, string> = {},
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let key = 0;

  /* Pass 1 collapses "Name (/path)" first, so pass 2 never sees those paths
     and cannot double-link them. */
  const collapsed: Array<string | { href: string; label: string }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(PARENTHETICAL_PATTERN)) {
    const index = match.index ?? 0;
    const href = match[1];
    const known = labels[href];
    let before = text.slice(lastIndex, index);

    /* If the sentence already ends with the page's name, link THAT and drop
       the parenthetical — "read more about Aryabhata (/products/aryabhata)"
       becomes "read more about Aryabhata" with the name linked. */
    if (known && before.toLowerCase().trimEnd().endsWith(known.toLowerCase())) {
      const cut = before.trimEnd().length - known.length;
      collapsed.push(before.slice(0, cut));
      collapsed.push({ href, label: before.trimEnd().slice(cut) });
    } else {
      /* The model referred to the page in its own words — "reach out on our
         contact page (/contact)". Appending the canonical label produced
         "our contact page contact us", which is how this read in production.
         Link the trailing phrase it actually wrote instead.
         Capped at three words and lowercase-only: that covers "our contact
         page" and "the five pillars" while refusing to swallow a sentence,
         which is exactly what over-capturing did the first time. */
      const trailing = before.match(/(?:^|\s)((?:[a-z]+\s){0,2}[a-z]+)\s*$/);
      if (trailing) {
        const phrase = trailing[1];
        const cut = before.length - phrase.length;
        collapsed.push(before.slice(0, cut));
        collapsed.push({ href, label: phrase });
      } else {
        /* Nothing sensible to attach it to — put the link where the
           parenthetical was so the destination is never silently dropped. */
        collapsed.push(before);
        collapsed.push({ href, label: known ?? href });
      }
    }
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) collapsed.push(text.slice(lastIndex));

  for (const piece of collapsed) {
    if (typeof piece !== "string") {
      nodes.push(anchor(piece.href, piece.label, key++));
      continue;
    }

    let cursor = 0;
    for (const match of piece.matchAll(BARE_PATTERN)) {
      const raw = match[0];
      const index = match.index ?? 0;

      const trailing = raw.match(TRAILING_PUNCTUATION)?.[0] ?? "";
      const href = trailing ? raw.slice(0, -trailing.length) : raw;

      if (index > cursor) nodes.push(piece.slice(cursor, index));
      /* Falls back to the path when we have no name for it — a visible URL is
         worse than a word, but far better than losing the destination. */
      nodes.push(anchor(href, labels[href] ?? href, key++));
      if (trailing) nodes.push(trailing);
      cursor = index + raw.length;
    }
    if (cursor < piece.length) nodes.push(piece.slice(cursor));
  }

  return nodes;
}
