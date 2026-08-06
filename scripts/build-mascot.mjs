import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

/**
 * Cuts the shippable mascot crops from the supplied render.
 *
 * Run by hand from the repo root when new artwork lands:
 *
 *   node scripts/build-mascot.mjs
 *
 * DELIBERATELY NOT part of `npm run build`. Wiring it in would make every
 * deploy depend on assets/source being present and on sharp resolving on the
 * build machine, to regenerate two files that change roughly never.
 *
 * ---------------------------------------------------------------------------
 * THE NUMBERS BELOW WERE MEASURED, NOT EYEBALLED.
 *
 * The supplied render is 3028x2528 with the character sitting in one corner
 * and the rest of the canvas empty. Scanning the alpha channel puts the whole
 * of the artwork in a 792x1634 box at (500,461) - stable across alpha
 * thresholds from 1 to 60, so the cutout is clean and carries no stray specks.
 *
 * That 792 is the hard ceiling on quality: it is every pixel of mascot that
 * exists. Nothing here upscales, and no placement should ask for more than
 * ~256 CSS px, which is 768px at a 3x device pixel ratio and still inside the
 * master. Past that the image optimiser upsamples and returns a file that is
 * both bigger and softer.
 *
 * TWO PROPERTIES OF THE ARTWORK THAT SURPRISE PEOPLE:
 *
 * 1. THERE IS NO CONTACT SHADOW. The render appears to have one, but it lives
 *    only in the RGB channels - the alpha beneath the feet is 0, so it never
 *    paints. The mascot is a clean cut-out and will float unless a placement
 *    grounds it. Do not try to fix this by re-exporting with a baked shadow: a
 *    baked shadow cannot follow the theme, and the site has both a light and a
 *    dark ground. Ground it with layout instead - sit the feet on the bottom
 *    edge of a tinted panel, which is what every current placement does.
 *
 * 2. THE T-SHIRT READS "Play". The figure can never be mirrored. scaleX(-1)
 *    turns the wordmark into gibberish, so a right-facing mascot is a new
 *    render, not a CSS transform. See the same note in ui/mascot.tsx.
 *
 * ---------------------------------------------------------------------------
 * WHY WEBP AND NOT PNG. The subject is smooth 3D gradient, which is the one
 * thing PNG cannot pack: the straight RGBA PNG of the trimmed subject is
 * 2.0MB, larger than every other file in public/ put together. Quantising to a
 * 256-colour palette gets 290KB but risks banding across exactly the skin and
 * fabric gradients that make up most of the figure. WebP at q92 is 96KB and,
 * checked side by side at display size against the 2.0MB original, is
 * indistinguishable.
 *
 * The full-fidelity original is not lost - it is committed at
 * assets/source/mascot/standing.png, which is never served.
 *
 * ONE CAVEAT ON WEBP. next/og (satori + resvg), which renders the social share
 * cards in app/opengraph-image.tsx, does not reliably decode WebP. If the
 * mascot is ever put on a share card, add a PNG derivative here for that use
 * rather than pointing the card at one of these files.
 *
 * ---------------------------------------------------------------------------
 * SHARP APPLIES ONLY ONE RESIZE PER PIPELINE. Chaining two silently keeps the
 * last one and discards the first, with no warning - a trap this repo has
 * already fallen into once, producing "16px previews" that were really clean
 * 192px renders. Nothing below chains, and if that ever changes, each output
 * gets its own fresh pipeline rather than a shared intermediate.
 */

const SRC = "assets/source/mascot/standing.png";
const DEST = "public/brand";

/* The measured subject box. Asserted below rather than trusted: a re-export
   that shifts this changes the aspect ratio every placement is laid out
   against, and a silent 10px drift is far worse than a failed script. */
const SUBJECT = { left: 500, top: 461, width: 792, height: 1634 };

const CROPS = {
  /* The whole figure, as trimmed. */
  "mascot-standing": { left: 0, top: 0, width: 792, height: 1634 },

  /* Head and folded arms. Below roughly 96px the die head stops reading as a
     die and the whole figure collapses into a beige smudge, so anything small
     takes this crop rather than scaling the full body into illegibility. The
     1000 line sits just under the elbows; 20/772 trims shoulder margin so the
     head sits centred in the box. */
  "mascot-bust": { left: 20, top: 0, width: 752, height: 1000 },
};

const trim = await sharp(SRC).trim({ threshold: 10 }).toBuffer({
  resolveWithObject: true,
});

const drift =
  Math.abs(trim.info.width - SUBJECT.width) > 2 ||
  Math.abs(trim.info.height - SUBJECT.height) > 2;

if (drift) {
  console.error(
    `Subject box moved: expected ~${SUBJECT.width}x${SUBJECT.height}, ` +
      `got ${trim.info.width}x${trim.info.height}.\n` +
      `New artwork has a different shape. Re-measure, update SUBJECT and the ` +
      `ratios in src/components/ui/mascot.tsx, then re-run.`,
  );
  process.exit(1);
}

await mkdir(DEST, { recursive: true });

const master = await sharp(SRC).extract(SUBJECT).png().toBuffer();

for (const [name, crop] of Object.entries(CROPS)) {
  const out = `${DEST}/${name}.webp`;
  await sharp(master)
    .extract(crop)
    .webp({ quality: 92, effort: 6 })
    .toFile(out);

  const { size } = await stat(out);
  console.log(
    `${out}  ${crop.width}x${crop.height}  ${Math.round(size / 1024)}KB`,
  );
}
