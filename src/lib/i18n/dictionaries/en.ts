/**
 * UI chrome strings. Page *content* lives in the content layer
 * (src/content) because it is CMS-bound; this file is the furniture:
 * navigation, controls, form labels, accessible names.
 */
export const en = {
  nav: {
    skipToContent: "Skip to main content",
    primary: "Primary",
    mobileMenu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    sections: "Sections",
    breadcrumb: "Breadcrumb",
    home: "Home",
    /* THE HEADER BAR IS A FIXED WIDTH BUDGET, AND THIS IS HOW IT IS SPENT.

       Every label here competes with the others for one row shared with the
       logo, a dropdown, two toggles and the CTA. Overspend it and the links
       do not truncate, they WRAP - and because they shrink together, one
       long label puts every item onto two lines, "For Parents" included.

       The merged hub is named in full because that is the point of having
       merged it: a teacher scanning the bar has to see themselves in it.
       That costs 11 characters over "For Schools", and About Us costs a
       whole item, so the budget is balanced elsewhere rather than by
       shaving the one label that carries meaning:

         - Government drops "& NGOs". The hub's own eyebrow, the mega-menu
           and the footer all still say "Government & NGOs"; the bar is an
           index, not a title.
         - Impact leaves the bar entirely. It is one click away in the What
           We Do menu, under Company, where About Us used to be the only
           entry - so the two effectively swapped places rather than one
           being added.

       If a future item needs a slot, the honest move is a "For You"
       dropdown holding the four audiences, not another round of shaving. */
    forSchools: "For Schools & Teachers",
    /* Was `forTeachers`, pointing at a hub that no longer exists. Renamed
       rather than deleted-and-added so that any dictionary key missing from
       gu.ts is a type error rather than an English string leaking onto the
       Gujarati site. See AUDIENCE_KEYS in lib/constants.ts. */
    forCorporate: "For Corporate",
    forParents: "For Parents",
    /* "& CSR", not "& NGOs" and not bare "Government". CSR is the word the
       people this hub is for use about their own budgets, and dropping it
       lost the half of the audience that arrives with money to place rather
       than a department to run.

       It does mean CSR appears twice in the bar, here and in For Corporate.
       That is not a duplication to tidy away: a district officer and a
       company's CSR lead are different readers arriving at different pages,
       and the shared word is the one they each recognise themselves by.

       menu.governmentNgos still says "Government & NGOs" in the mega-menu
       and the footer, where NGOs are genuinely part of the audience and
       there is room to name all three. */
    government: "Government & CSR",
    whatWeDo: "What We Do",
    impact: "Impact",
    resources: "Resources",
    about: "About Us",
    contact: "Contact",
    careers: "Careers",
  },
  cta: {
    bookDemo: "Book a Demo",
    /* The header CTA below sm. "Book a Demo" plus the logo and the menu
       button overflows a 320px header; this is the same action, short enough
       to fit. Not used anywhere the longer label has room. */
    demo: "Demo",
    enquire: "Enquire about this kit",
    exploreApproach: "Explore the approach",
    seeAllKits: "See all learning kits",
    downloadBrochure: "Download the brochure",
    requestProposal: "Request a proposal",
    findAKit: "Find the right kit",
    readMore: "Read more",
    learnMore: "Learn more",
  },
  product: {
    ageLabel: "Age",
    playersLabel: "Players",
    durationLabel: "Time",
    settingLabel: "Setting",
    outcomes: "What children take away",
    skills: "Skills developed",
    curriculum: "Curriculum alignment",
    howToPlay: "How to play",
    inTheBox: "What's in the box",
    related: "Kits that pair well with this",
    /* Portfolio, not catalogue - decision D7. No price, no cart, anywhere. */
    noPricingNote:
      "Kits are supplied as part of a school programme. Tell us about your school and we'll share options and pricing.",
  },
  filters: {
    heading: "Filter kits",
    clearAll: "Clear all",
    apply: "Show results",
    resultCount: (n: number) => (n === 1 ? "1 kit matches" : `${n} kits match`),
    emptyTitle: "No kits match those filters",
    emptyBody: "Try removing a filter. Here are some close alternatives.",
    age: "Age",
    subject: "Subject",
    skill: "Skill",
    pillar: "Learning goal",
    duration: "Duration",
    setting: "Indoor / outdoor",
    groupSize: "Group size",
    grade: "Grade",
  },
  form: {
    name: "Your name",
    email: "Email address",
    phone: "Mobile number",
    school: "School name",
    organisation: "Organisation",
    district: "District",
    role: "Your role",
    message: "Anything you'd like us to know",
    preferredTime: "Best time to call",
    optional: "optional",
    required: "required",
    submit: "Send enquiry",
    submitting: "Sending…",
    successTitle: "Thank you, we've got it.",
    successBody: "Someone from our team will call you within two working days.",
    errorGeneric: "Something went wrong on our side. Please try again.",
    /* Errors say how to fix, never just "invalid" - a11y checklist §3 */
    errorName: "Please enter your name",
    errorEmail: "Enter an email address like name@school.edu.in",
    errorPhone: "Enter a 10-digit mobile number",
    errorSchool: "Please enter your school's name",
    consent:
      "I'd like to receive occasional updates about classroom resources.",
  },
  theme: {
    toggle: "Switch theme",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  /* Menu labels. These used to live as English literals in lib/navigation,
     which quietly broke the "no hardcoded user-facing string" rule that makes
     a second language possible at all. */
  menu: {
    theApproach: "The Approach",
    learningThroughPlay: "Learning Through Play",
    learningThroughPlayDesc: "The philosophy behind every kit",
    whyExperiential: "Why Experiential?",
    whyExperientialDesc: "Five things that change in a classroom",
    gameCorner: "The Game Corner",
    gameCornerDesc: "A learning zone inside your school",
    fivePillars: "The 5 Pillars",
    learningKits: "Learning Kits",
    allKits: "All learning kits",
    explore: "Explore",
    forYou: "For you",
    company: "Company",
    ourImpact: "Our Impact",
    aboutUs: "About us",
    /* Descriptions, because this pair sits in the mega-menu alongside The
       Approach, whose links carry them. A column of bare labels next to two
       columns of annotated ones reads as unfinished. */
    aboutUsDesc: "Who we are and why we build these",
    ourImpactDesc: "Kits delivered, and what came of them",
    privacy: "Privacy",
    terms: "Terms",
    schools: "Schools & Teachers",
    corporate: "Corporate & CSR",
    parents: "Parents",
    governmentNgos: "Government & NGOs",
  },
  /* Pillar names appear in the menu, the footer and the hero world, so they
     live here rather than being read from the content layer three times. */
  pillars: {
    "foundational-learning": "Foundational Learning",
    "health-nutrition": "Health & Nutrition",
    "climate-education": "Climate Education",
    "future-readiness": "Future Readiness",
    "life-skills": "Life Skills",
  },
  locale: {
    label: "Language",
    /* Named in the target language on purpose: someone who cannot read the
       current language still has to be able to find the way out. */
    switchTo: "ગુજરાતીમાં જુઓ",
  },
  /* Trust signals sit directly under the hero CTAs. Claims only - alignment
     with a published framework, and what is included in the programme. No
     counts of schools or children until those numbers can be sourced. */
  trust: {
    nep: "NEP 2020 aligned",
    ncf: "NCF 2023 compliant",
    training: "Teacher training included",
  },
  common: {
    loading: "Loading",
    opensInNewTab: "opens in a new tab",
    downloadsFile: "downloads a file",
    backToTop: "Back to top",
  },
} as const;

/**
 * Widen literal types to their base types.
 *
 * `en` is `as const`, which is what stops a stray reassignment and keeps the
 * object readable as data. But it also means `typeof en` types every value as
 * the exact English string - `skipToContent: "Skip to main content"` - so no
 * other language can satisfy it. Deriving Dictionary straight from `typeof en`
 * made the type a description of English rather than of a dictionary, and the
 * Gujarati file failed to compile on its first line.
 *
 * This maps every leaf to `string` while preserving the shape and the one
 * function signature, so `gu` must supply exactly the same keys with exactly
 * the same kinds of value - which is the guarantee actually wanted.
 */
type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : { -readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
