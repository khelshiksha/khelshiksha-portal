import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

/**
 * Cuts the shippable section photography from the supplied renders.
 *
 * Run by hand from the repo root when new artwork lands:
 *
 *   node scripts/build-section-images.mjs
 *
 * DELIBERATELY NOT part of `npm run build`, for the same reason
 * build-mascot.mjs is not: a deploy should not depend on assets/source being
 * present or on sharp resolving on the build machine, to regenerate files
 * that change roughly never.
 *
 * ---------------------------------------------------------------------------
 * WHAT THESE ARE, AND HOW THEY DIFFER FROM THE MASCOT.
 *
 * The mascot is a cut-out on a transparent ground: it has no frame, no
 * contact shadow, and every placement grounds it by standing its feet on a
 * panel edge. These are PHOTOGRAPHS - full-bleed rectangles with their own
 * background - so they are framed rather than grounded, and they sit inside a
 * rounded panel in ui/section-figure.tsx rather than hanging off an edge.
 *
 * That difference is why they do not go through ui/mascot.tsx's size map. A
 * cut-out's intrinsic dimensions ARE its layout; a photograph's are a crop
 * decision, and the layout decides how much room it gets.
 *
 * ---------------------------------------------------------------------------
 * WHY NO UPSCALE, AND WHY THE RATIO IS ASSERTED.
 *
 * Each source is the full extent of the artwork that exists. Nothing here
 * enlarges: `withoutEnlargement` is on, so a smaller-than-expected source
 * produces a smaller file rather than a soft one. next/image handles the
 * responsive candidates from the master below.
 *
 * The ratio is asserted because section-figure.tsx lays these out against a
 * fixed aspect box. A re-export at a different shape would letterbox or crop
 * inside that box with no error, which is exactly the kind of silent drift
 * the mascot script's SUBJECT assertion exists to catch.
 *
 * ---------------------------------------------------------------------------
 * WHY WEBP AT q82, NOT q92. The mascot is smooth 3D gradient, where q92 buys
 * real freedom from banding. These are photographs with grain and detail,
 * where q82 is the usual point past which WebP spends bytes on noise. Checked
 * side by side at display size, q82 and q92 are indistinguishable here and
 * q82 is roughly half the file.
 *
 * The full-fidelity originals are committed under assets/source/sections and
 * are never served.
 */

const DEST = "public/images/sections";

/* Expected aspect ratio, width / height. Portrait 4:5. */
const RATIO = 0.8;
const TOLERANCE = 0.02;

/* Sources are whatever the artwork arrived as - the extension is not load
   bearing, sharp sniffs the format. The KEY is what matters: it becomes the
   served filename, and content/audiences.ts references it. */
const SOURCES = {
  /* The Khel Shiksha cart outside a Gujarat school, children choosing kits
     off the shelf. This is the Schools hub's figure: it shows the product,
     the setting and the age group in one frame, which is what the mascot
     could only gesture at. */
  "schools-cart": "assets/source/sections/schools-cart.jpg",

  /* A family on the floor with a board game, no screen anywhere in frame.
     The Parents hub's whole claim is "screen-free bonding", and an absence
     is the one thing a photograph can prove. */
  "parents-home": "assets/source/sections/parents-home.png",

  /* Kits stacked in a distribution hall, an officer with a clipboard. This
     is deliberately NOT a handover ceremony: the government hub's claim is
     12,000 kits manufactured and delivered, and volume is what has to be
     visible. A ribbon-cutting would illustrate the opposite. */
  "government-scale": "assets/source/sections/government-scale.png",

  /* A child in a wheelchair taking her turn at the table, not being helped
     at it. The Corporate hub sells inclusive design, and inclusion shown as
     assistance reads as charity photography - which undercuts the claim it
     is meant to support. */
  "corporate-inclusive": "assets/source/sections/corporate-inclusive.png",

  /* The people who make the games, at the bench. The About page's honest
     subject is the company rather than the classroom. */
  "about-workshop": "assets/source/sections/about-workshop.png",
};

await mkdir(DEST, { recursive: true });

for (const [name, src] of Object.entries(SOURCES)) {
  const { width, height } = await sharp(src).metadata();
  const ratio = width / height;

  if (Math.abs(ratio - RATIO) > TOLERANCE) {
    console.error(
      `${src}: expected a ${RATIO} (4:5) ratio, got ${ratio.toFixed(3)} ` +
        `(${width}x${height}).\n` +
        `Re-crop the source, or update RATIO here and the aspect box in ` +
        `src/components/ui/section-figure.tsx together.`,
    );
    process.exit(1);
  }

  const out = `${DEST}/${name}.webp`;
  await sharp(src)
    .resize({ width: 1120, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(out);

  const { size } = await stat(out);
  console.log(`${out}  ${width}x${height}  ${Math.round(size / 1024)}KB`);
}
