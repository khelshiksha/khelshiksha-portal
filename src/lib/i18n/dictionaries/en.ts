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
    forSchools: "For Schools",
    forTeachers: "For Teachers",
    forParents: "For Parents",
    government: "Government & NGOs",
    whatWeDo: "What We Do",
    impact: "Impact",
    resources: "Resources",
    about: "About",
    contact: "Contact",
    careers: "Careers",
  },
  cta: {
    bookDemo: "Book a Demo",
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
    /* Portfolio, not catalogue — decision D7. No price, no cart, anywhere. */
    noPricingNote:
      "Kits are supplied as part of a school programme. Tell us about your school and we'll share options and pricing.",
  },
  filters: {
    heading: "Filter kits",
    clearAll: "Clear all",
    apply: "Show results",
    resultCount: (n: number) =>
      n === 1 ? "1 kit matches" : `${n} kits match`,
    emptyTitle: "No kits match those filters",
    emptyBody: "Try removing a filter — here are some close alternatives.",
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
    successTitle: "Thank you — we've got it.",
    successBody: "Someone from our team will call you within two working days.",
    errorGeneric: "Something went wrong on our side. Please try again.",
    /* Errors say how to fix, never just "invalid" — a11y checklist §3 */
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
  common: {
    loading: "Loading",
    opensInNewTab: "opens in a new tab",
    downloadsFile: "downloads a file",
    backToTop: "Back to top",
  },
} as const;

export type Dictionary = typeof en;
