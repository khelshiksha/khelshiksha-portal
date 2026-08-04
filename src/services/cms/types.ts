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
  /** Required unless `decorative` — enforced in the CMS schema too. */
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
   * Two voices for the same kit — journey rule 2. The audience hub picks one;
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
   * this use is on file — reproducing an organisation's mark is a trade mark
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

export interface AudienceHub {
  key: AudienceKey;
  slug: string;
  eyebrow: string;
  title: string;
  /** The italic Fraunces phrase inside the title. Exactly one per section. */
  titleAccent?: string;
  lede: string;
  tint: PillarTint;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  problem: { heading: string; items: string[] };
  outcome: { heading: string; items: string[] };
  timeline?: TimelineStep[];
  included?: { title: string; description: string }[];
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
   * shape — a tall crest got wide empty margins, a wide wordmark got squeezed
   * — and next/image logged an aspect-ratio warning for all fifteen. With the
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
  /** Null until verified — see the note in content/press.ts. */
  publication: string | null;
  date: string | null;
}
