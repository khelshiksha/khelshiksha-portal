# Section figure prompts

Generation prompts for the hub photography in `assets/source/sections/`.

`schools-cart.jpg` was the first of these and sets the house style. Everything
below is written to sit beside it without looking like a different stock
library: same camera, same light, same country, same brand.

## Non-negotiables for every image

These are the things that break the set if they drift, so they are repeated
verbatim in each prompt rather than assumed:

- **Portrait 4:5, and actually 4:5.** `scripts/build-section-images.mjs`
  asserts the ratio to within 2% and exits non-zero otherwise, because
  `ui/section-figure.tsx` lays these out against a fixed aspect box where a
  wrong ratio would silently letterbox. Generate at 1152×1440 or larger.
- **Photographic, not illustrated.** These are framed photographs. The mascot
  is the cut-out register and they must not converge — see the note at the top
  of `build-section-images.mjs`.
- **Khel Shiksha blue (#1B4DB1-ish royal blue) and white** on any branded
  surface, with the logo and the `Build • Play • Learn` tagline.
- **India, specifically.** Gujarati signage, real school and home
  architecture, authentic uniforms. Generic "international classroom" imagery
  is the main failure mode.
- **Natural daylight, candid documentary framing.** Nobody looking at camera,
  nobody posed in a semicircle.
- **No text the viewer must read to understand the picture.** Signage is
  texture; the headline carries the message.

---

## 1. `parents-home.jpg` — For Parents

Hub tint is peach. The brief is "Meaningful Screen-Free Bonding", so the
picture has to carry *home* and *no screen* in one frame, and it must not read
as a classroom that happens to have a parent in it.

> A warm, photorealistic portrait-orientation photograph of an Indian family
> playing a colourful educational board game together on the floor of a
> middle-class Indian home living room. A mother and father sit cross-legged
> on a woven mat with two children aged about six and nine, all four leaning
> over a bright board game with wooden tokens and picture cards spread between
> them. The younger child is mid-laugh, reaching to move a token; the father
> is watching her hand rather than the camera. Late-afternoon golden sunlight
> comes through a window with sheer curtains on the left. In the background,
> softly out of focus, a low wooden shelf holds a small stack of blue and
> white Khel Shiksha game boxes. Absolutely no phones, tablets, televisions or
> screens anywhere in the frame. Candid documentary photography, natural
> light, shallow depth of field, warm domestic colour palette. Portrait
> orientation, 4:5 aspect ratio.

## 2. `government-scale.jpg` — For Government & NGOs

Hub tint is lavender. This one sells *capacity*, and the temptation is a
ribbon-cutting photograph. Avoid it: the page's claim is 12,000 kits
manufactured, delivered and installed, so the picture should show volume and
logistics, not a handover ceremony.

> A photorealistic portrait-orientation documentary photograph inside a large,
> bright Indian school hall or distribution centre, with dozens of identical
> royal blue and white Khel Shiksha educational kit boxes stacked in neat
> columns on the floor and on trestle tables, receding into the background to
> suggest large scale. Two Indian adults in simple formal clothing — a
> government education official with a clipboard and a school headmaster —
> stand mid-conversation beside the nearest stack, one gesturing toward the
> boxes. A few schoolchildren in blue and white checked uniforms carry a box
> between them in the middle distance. Institutional daylight from high
> windows, faded pale green painted walls, a Gujarati-script noticeboard on
> the back wall. Serious, competent, organised atmosphere — logistics and
> delivery rather than a ceremony. No ribbon-cutting, no posed group photo, no
> garlands. Candid documentary photography, natural light. Portrait
> orientation, 4:5 aspect ratio.

## 3. `corporate-inclusive.jpg` — For Corporate & CSR

Hub tint is mint. Two claims from the brief have to be visible: **inclusive
design (CWSN)** and **something a funder can actually check**. Inclusion has
to be shown as ordinary participation, not as a child being helped — the
latter reads as charity photography and undercuts the page.

> A photorealistic portrait-orientation photograph of a bright, modern Indian
> classroom activity room where a small mixed group of children aged six to
> ten play an educational tile-matching game together at a low round table.
> One child uses a wheelchair and is at the table as an equal participant,
> mid-turn, placing a tile while the others watch her hand. The children wear
> blue and white checked school uniforms. A young Indian woman teacher crouches
> at the edge of the frame observing rather than intervening. Royal blue and
> white Khel Shiksha branded shelving with organised kit boxes stands against
> the wall behind them. Large windows, clean natural daylight, pale walls,
> potted plant in the corner. The mood is ordinary competent participation —
> the child in the wheelchair is leading the turn, not being assisted. No
> charity or pity framing, nobody looking at the camera. Candid documentary
> photography, natural light, fresh green and blue colour palette. Portrait
> orientation, 4:5 aspect ratio.

## 4. `about-workshop.jpg` — About Us

Optional, and only worth generating if `/about` gets a figure. The vision line
is "transforming classrooms into vibrant hubs of discovery", and the honest
subject for an About page is the people who make the things rather than the
children using them.

> A photorealistic portrait-orientation photograph inside a small, bright
> Indian design workshop where three adults develop educational board games. A
> woman in her thirties sits at a large wooden worktable arranging brightly
> coloured printed game cards into a grid; a man beside her holds a wooden
> prototype tile up to the light; a third person sketches a game board layout
> in a notebook. The table is covered with colour proofs, wooden tokens, dice
> and a cutting mat. Pinned to a corkboard on the wall behind them are game
> board drafts and a Gujarati-script curriculum chart. A finished royal blue
> and white Khel Shiksha kit box sits at the edge of the table. Warm daylight
> from a large window on the right. Focused, unglamorous, craft-oriented
> atmosphere. Candid documentary photography, natural light, shallow depth of
> field. Portrait orientation, 4:5 aspect ratio.

---

## After generating

1. Save each as `assets/source/sections/<name>.jpg` at full resolution.
2. Add the name to `SOURCES` in `scripts/build-section-images.mjs`.
3. Run `node scripts/build-section-images.mjs` from the repo root. It will
   refuse a source that is not 4:5 rather than silently producing a file that
   crops wrong.
4. Add the `image: { src, alt }` block to the hub in `src/content/audiences.ts`
   and pass `figure` on the hub's `HeroAudience`.

The `alt` text is not decoration. Write what the headline does not already
say — the setting, the age group and the product — per the note in
`src/components/ui/section-figure.tsx`.
