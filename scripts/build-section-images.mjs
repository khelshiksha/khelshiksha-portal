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
 * Each source is normally the full extent of the artwork that exists, so
 * `withoutEnlargement` is on by default: a smaller-than-expected source
 * produces a smaller file rather than a soft one. next/image handles the
 * responsive candidates from the master below.
 *
 * A GROUP CAN OPT OUT with `upscale: true`, and exactly one does. The product
 * box shots are cut out of a 150 DPI brochure page and are ~205px wide at
 * source; serving them at that size would mean the browser upscaling them
 * anyway, on every view, with no control over the kernel. Doing it once here
 * with lanczos3 is the better of two imperfect options - and the group's
 * comment says plainly that the real fix is the original photography.
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

/* A tolerance rather than an equality, because a generator asked for 4:5
   returns 928x1152 (0.8055) and that is close enough to crop invisibly. */
const TOLERANCE = 0.02;

/* TWO GROUPS, TWO SHAPES, ONE SCRIPT.
   The section figures are portrait 4:5 and share a row with a headline. The
   founder portraits are SQUARE, because the card in
   blocks/content/founder-grid.tsx sets them in a size-24/size-28 box and a
   4:5 source would crop a face off-centre in it. Keeping both here rather
   than in two scripts means one command after any artwork lands, and one
   place where a wrong ratio is caught. */
const GROUPS = [
  {
    dest: "public/images/sections",
    /* Portrait 4:5, width / height. */
    ratio: 0.8,
    /* Wide enough for the lg:w-96 panel at 2x. */
    width: 1120,
    /* Sources are whatever the artwork arrived as - the extension is not
       load bearing, sharp sniffs the format. The KEY is what matters: it
       becomes the served filename, and content/audiences.ts references it. */
    sources: {
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
    },
  },
  {
    dest: "public/images/founders",
    /* Square. See the note on GROUPS above. */
    ratio: 1,
    /* 448 is the size-28 card box (112px) at 4x, which covers a retina
       display without shipping a 1024px file for a 112px slot. */
    width: 448,
    sources: {
      "milan-sarvaiya": "assets/source/founders/milan-sarvaiya.jpeg",
      "kishan-hasani": "assets/source/founders/kishan-hasani.jpeg",
      /* CROPPED HERE RATHER THAN BEFORE COMMITTING, so the decision is
         reproducible and arguable instead of baked into a file nobody can
         regenerate. The supplied photograph is a full-length shot of him
         sitting in a chair: square, so it passes the ratio assertion, but
         set in a 112px card it would be a small figure in a room beside two
         face-filling headshots. These numbers frame head and shoulders. */
      "ankit-padshala": {
        src: "assets/source/founders/ankit-padshala.jpeg",
        crop: { left: 614, top: 130, width: 880, height: 880 },
      },
    },
  },

  /* ---------------------------------------------------------------------
     PRODUCT BOX SHOTS, CUT OUT OF THE PRINTED BROCHURE.

     TEMPORARY, until the graphic designer delivers artwork - but no longer
     soft. The first version of this group cut them out of the PDF, which is
     a flattened 150 DPI print file: one JPEG per page, each box about 205px
     across, and everything served was an upscale of that. They shipped
     visibly blurred.

     THE PNG EXPORT OF THE SAME SPREAD IS 3600x5400 - three times the linear
     resolution, nine times the pixels, and it was sitting beside the PDF the
     whole time. Each box is now ~690px of real detail rather than 205px of
     upscale: the ministry line, the "WHAT'S INSIDE" component labels and the
     kit strapline all resolve, where before they were grey smudges.

     Cropped here rather than committed pre-cut, same as everywhere else in
     this file. The coordinates are the PDF-era ones multiplied by 5400/1754,
     because the spread is the same artwork at a different scale.

     quality 88 rather than the file default of 82, and a light unsharp mask:
     these are the only images on the site that have been through a print
     screen, and they are the ones a school looks at longest. */
  {
    dest: "public/images/products",
    ratio: 4 / 3,
    /* ~1.7x the 690px native crop. Past that the upscale adds bytes and no
       detail; below it the product page's own hero is being downscaled. */
    width: 1200,
    upscale: true,
    sharpen: true,
    quality: 88,
    sources: Object.fromEntries(
      [
        ["road-safety", 44],
        ["aryabhata", 232],
        ["aahar", 414],
        ["yoga-safari", 588],
        ["brainy-bee", 758],
        ["naturebola", 932],
      ].map(([name, top]) => {
        /* The spread is 3.079x the page the original coordinates were read
           off, so the whole rectangle scales rather than being re-measured -
           re-measuring six boxes by eye would drift them apart. */
        const S = 5400 / 1754;
        return [
          name,
          {
            src: "assets/source/products/brochure-spread-hires.jpg",
            crop: {
              left: Math.round(1192 * S),
              top: Math.round(top * S),
              width: Math.round(224 * S),
              height: Math.round(168 * S),
            },
          },
        ];
      }),
    ),
  },

  /* ---------------------------------------------------------------------
     THE HERO SHOWCASE PRODUCTS.

     Eleven photographs of the activity kits, on white, supplied as WhatsApp
     exports. They drive the rotating stage in the home hero - see
     blocks/heroes/product-stage.tsx - and are NOT the product catalogue:
     content/products.ts is a separate, smaller set with its own pages.

     `square: true` is doing real work here. These arrived as a mix of
     portrait and landscape with generous, unequal white margins, so the
     group trims each to its subject and letterboxes the result into one
     square canvas. Without that the stage would show eleven products at
     eleven apparent sizes, which is what makes a rotating showcase look
     broken rather than varied.

     880 because the stage is a 440px panel at its largest and these are the
     only images in the hero, so they are worth serving at 2x. */
  {
    dest: "public/images/hero-products",
    ratio: 1,
    width: 880,
    square: true,
    sources: Object.fromEntries(
      [
        "abc-explorer-english",
        "abc-explorer-gujarati",
        "animal-match-up",
        "color-carnival",
        "flashlight-magic",
        "hungry-bunny",
        "know-your-shapes",
        "speed-cups",
        "string-in-sequence",
        "sweet-secrets",
        "wheel-of-emotions",
      ].map((n) => [n, `assets/source/hero-products/${n}.jpeg`]),
    ),
  },
];

for (const {
  dest,
  ratio: expected,
  width: outWidth,
  sources,
  upscale,
  square,
  sharpen,
  quality,
} of GROUPS) {
  await mkdir(dest, { recursive: true });

  for (const [name, entry] of Object.entries(sources)) {
    /* A source is either a path, or a path plus a crop. See ankit-padshala
       above for why the second form exists. */
    const { src, crop } = typeof entry === "string" ? { src: entry } : entry;

    /* Measured on the CROP where there is one, because the crop is what gets
       served - a square source cropped to a rectangle would sail past an
       assertion that only looked at the original. */
    const { width, height } = crop ?? (await sharp(src).metadata());
    const ratio = width / height;

    /* A SQUARING GROUP HAS NOTHING TO ASSERT. It trims its own margins and
       then letterboxes whatever is left into a square canvas, so the source
       ratio is an input to that process rather than a contract - the eleven
       hero products arrived as a mix of portrait and landscape and all of
       them are correct. The assertion still guards every other group, where
       the source ratio IS the contract. */
    if (!square && Math.abs(ratio - expected) > TOLERANCE) {
      console.error(
        `${src}: expected a ${expected} ratio, got ${ratio.toFixed(3)} ` +
          `(${width}x${height}).\n` +
          `Re-crop the source, or update the ratio for this group here and ` +
          `the aspect box in the component that renders it - ` +
          `ui/section-figure.tsx for sections, ` +
          `blocks/content/founder-grid.tsx for founders.`,
      );
      process.exit(1);
    }

    const out = `${dest}/${name}.webp`;
    const pipeline = sharp(src);
    if (crop) pipeline.extract(crop);

    if (square) {
      /* TRIM FIRST, THEN LETTERBOX. The photographs arrive with generous and
         UNEQUAL white margins, so resizing them as they came would render
         eleven products at eleven apparent sizes - the one failure that makes
         a rotating showcase look broken rather than varied. Trimming to the
         subject and then fitting every subject into the same square is what
         makes them read as one set.

         The threshold is high because the ground is 252-254, not 255; too low
         and it eats the white game cards that several of these products are
         made of.

         PADDED WITH WHITE, NOT MADE TRANSPARENT. Keying the ground out would
         punch holes straight through those same white cards - the background
         and the product are the same colour, and no threshold separates them.
         The stage renders these on a white panel, where the padding is
         invisible. */
      pipeline
        .trim({ background: "#ffffff", threshold: 12 })
        .resize(outWidth, outWidth, {
          fit: "contain",
          background: "#ffffff",
          kernel: "lanczos3",
        });
    } else {
      pipeline.resize({
        width: outWidth,
        withoutEnlargement: !upscale,
        /* Only matters when enlarging; lanczos3 is sharp's best-quality
           kernel and the default anyway, stated here so the choice is
           visible next to the flag that makes it relevant. */
        kernel: "lanczos3",
      });
    }

    /* SHARPEN ONLY WHERE A GROUP ASKS FOR IT. Every resample softens, and a
       crop lifted out of a printed page has been through a press screen and a
       JPEG before it ever reaches here. A light unsharp mask puts back the
       edge the resample took and nothing more - enough that box lettering
       resolves, short of the halo that makes an image look processed. */
    if (sharpen) pipeline.sharpen({ sigma: 0.8, m1: 0.6, m2: 0.9 });

    await pipeline.webp({ quality: quality ?? 82, effort: 6 }).toFile(out);

    const { size } = await stat(out);
    /* Reported from the WRITTEN file, not from the source or crop. Those
       differ the moment a group upscales, and a log that says 224x168 for a
       1024px file is worse than no log - it is a wrong answer to the exact
       question someone runs this to check. */
    const written = await sharp(out).metadata();
    console.log(
      `${out}  ${written.width}x${written.height}  ${Math.round(size / 1024)}KB`,
    );
  }
}
