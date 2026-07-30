/**
 * Emits a JSON-LD block.
 *
 * `JSON.stringify` is safe here because every value we pass originates from
 * our own content layer, but `<` is still escaped so a stray character in
 * editor-supplied copy can never close the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
