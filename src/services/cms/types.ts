import type {
  AudienceKey,
  Framework,
  GradeBand,
  PillarKey,
  PillarTint,
  Setting,
  ShelfKey,
  Skill,
  Subject,
} from "@/lib/constants";

/**
 * Domain types. These mirror the Sanity schema in
 * docs/architecture/07-cms-schema.md field-for-field, so the local content
 * adapter and a future Sanity client satisfy the same contract.
 */

export interface ImageRef {
  /** Path under /public today; a Sanity asset ref later. */
  src: string;
  /** Required unless `decorative` - enforced in the CMS schema too. */
  alt: string;
  decorative?: boolean;
  caption?: string;
  width?: number;
  height?: number;
}

export interface Pillar {
  _id: string;
  key: PillarKey;
  slug: string;
  title: string;
  /** One line, used in the pillar grid. */
  shortDescription: string;
  /** Two or three sentences, used on the pillar page hero. */
  description: string;
  /** Maps to a design-system tint. An enum, never a colour picker. */
  tint: PillarTint;
  icon: string;
  order: number;
}

export interface CurriculumLink {
  framework: Framework;
  reference: string;
}

export interface HowToPlayStep {
  step: string;
  detail?: string;
}

export interface Product {
  _id: string;
  slug: string;
  title: string;
  /** Max 90 chars. */
  tagline: string;

  /**
   * Two voices for the same kit - journey rule 2. The audience hub picks one;
   * a principal and a parent do not read the same sentence.
   */
  descriptionInstitutional: string;
  descriptionParent: string;

  pillars: PillarKey[];
  ageMin: number;
  ageMax: number;
  grades: GradeBand[];
  subjects: Subject[];
  skills: Skill[];
  durationMinutes: number;
  setting: Setting;
  groupSizeMin: number;
  groupSizeMax: number;
  shelf: ShelfKey;

  /** Observable, not aspirational. 2–8 items. */
  learningOutcomes: string[];
  curriculumMapping: CurriculumLink[];
  howToPlay: HowToPlayStep[];
  boxContents: string[];

  heroImage: ImageRef;
  gallery?: ImageRef[];

  relatedSlugs: string[];
  featured: boolean;
  order: number;
}

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role: string;
  organisation: string;
  audience: AudienceKey;
  featured: boolean;
}

export interface Partner {
  _id: string;
  name: string;
  /**
   * OPTIONAL, AND USUALLY ABSENT ON PURPOSE.
   *
   * A partner renders as a typographic wordmark unless a logo is supplied.
   * Supply one only when a licensed vector asset exists and permission for
   * this use is on file - reproducing an organisation's mark is a trade mark
   * use, whereas setting its name in type is a statement of fact. See
   * content/impact.ts.
   */
  logo?: ImageRef;
  partnerType: "govt" | "ngo" | "institution" | "media";
  showOnHomepage: boolean;
  order: number;
}

export interface ImpactStat {
  _id: string;
  value: number;
  /** Rendered after the number: "+", "%", etc. */
  suffix?: string;
  label: string;
  detail?: string;
}

export interface Benefit {
  _id: string;
  title: string;
  description: string;
  order: number;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  audience: AudienceKey | "general";
  order: number;
}

export interface TimelineStep {
  _id: string;
  label: string;
  title: string;
  description: string;
  order: number;
}

/**
 * A titled block of prose plus a short list, rendered between the rollout
 * timeline and the alignment strip on an audience hub.
 *
 * ONE SHAPE, FOUR USES, and that is the reason it exists rather than four
 * bespoke sections: "Transform Your Campus" and "Teacher Capacity Building"
 * on Schools, "Why Partner With Us" on Corporate, and "Our Proven Impact &
 * Credibility" on Government are the same thing - a claim, a paragraph
 * supporting it, and three to five specifics. Four components would have
 * drifted apart within a term.
 *
 * `points` carries a title AND a description because a bare list of phrases
 * reads as a brochure bullet. The title is the claim; the description is what
 * makes it checkable.
 */
export interface HubFeature {
  eyebrow: string;
  title: string;
  /** The italic Fraunces phrase inside the title. Exactly one per section. */
  titleAccent?: string;
  body?: string;
  points: { title: string; description: string }[];
}

export interface AudienceHub {
  key: AudienceKey;
  slug: string;
  eyebrow: string;
  title: string;
  /** The italic Fraunces phrase inside the title. Exactly one per section. */
  titleAccent?: string;
  lede: string;
  /**
   * The photograph beside the hub's headline.
   *
   * OPTIONAL, AND USUALLY ABSENT SO FAR. A hub without one falls back to the
   * standing mascot, which is what all four hubs showed before section
   * photography existed. Supplying one is the whole change - see
   * ui/section-figure.tsx for why a cut-out and a photograph cannot share a
   * layout, and scripts/build-section-images.mjs for how the file is built.
   *
   * `src` is a path under public/images/sections. The 4:5 ratio is asserted
   * by that build script, because the layout crops rather than letterboxes.
   */
  image?: ImageRef;
  tint: PillarTint;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  problem: { heading: string; items: string[] };
  outcome: { heading: string; items: string[] };
  timeline?: TimelineStep[];
  included?: { title: string; description: string }[];
  /** Rendered in order, after `included`. See HubFeature. */
  features?: HubFeature[];
}

/* --- Credibility -------------------------------------------------------- */

export interface CredentialItem {
  name: string;
  /** File under public/logos. */
  file: string;
  /**
   * The file's TRUE pixel dimensions. Required, not optional.
   *
   * Every logo used to be declared as 150x56 and rendered `h-12 w-auto
   * object-contain`, so each one was letterboxed inside a box of the wrong
   * shape - a tall crest got wide empty margins, a wide wordmark got squeezed
   * - and next/image logged an aspect-ratio warning for all fifteen. With the
   * real numbers each mark keeps its own shape and the row reads as a set of
   * logos rather than a row of boxes.
   *
   * Measured with `sips -g pixelWidth -g pixelHeight`, or read off the SVG's
   * viewBox. If a file is replaced, re-measure it.
   */
  w: number;
  h: number;
  /** What the relationship actually is, where a logo alone would overclaim. */
  relationship?: string;
}

export interface CredentialGroup {
  _id: string;
  key: string;
  heading: string;
  /** One line saying what this group of marks means. */
  note: string;
  items: CredentialItem[];
}

export interface PressCutting {
  _id: string;
  /** File under public/press. */
  file: string;
  alt: string;
  /** Null until verified - see the note in content/press.ts. */
  publication: string | null;
  date: string | null;
}

/**
 * A founder, for the About page.
 *
 * `image` is OPTIONAL, unlike the ImageRef on an audience hub. Photographs of
 * real people arrive later than their names do, and a founders section that
 * cannot render until everyone has been photographed is a section that does
 * not ship. The card lays out with initials in place of a portrait.
 *
 * The array backing this is empty by default - see the note in
 * content/founders.ts on why that is deliberate rather than unfinished.
 */
export interface Founder {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image?: ImageRef;
}
