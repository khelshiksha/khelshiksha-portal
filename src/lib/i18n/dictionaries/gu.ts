import type { Dictionary } from "./en";

/**
 * Gujarati UI chrome.
 *
 * Typed as `Dictionary`, so this file cannot drift from English: add a key to
 * en.ts and TypeScript fails the build here until it is translated. That is
 * the whole reason the dictionary is a typed object rather than a JSON blob -
 * a half-translated interface is worse than an untranslated one, because the
 * gaps land unpredictably in the middle of a form.
 *
 * REGISTER. Gujarati has a familiar and a respectful second person. Everything
 * here uses the respectful form (તમે / તમારું), because the reader is a
 * principal, a teacher or a parent, and the familiar form would read as
 * talking down to them. This is not a detail a translation tool gets right by
 * default and it is the single most likely thing to make the page feel wrong
 * to a native reader.
 *
 * LOANWORDS. Terms that Gujarati-speaking schools genuinely use in English -
 * ડેમો, કીટ, ઈમેલ, થીમ - are transliterated rather than replaced with Sanskritic
 * coinages nobody says out loud. Translating "kit" to a pure Gujarati
 * compound would be more correct and less understood.
 */
export const gu: Dictionary = {
  nav: {
    skipToContent: "મુખ્ય સામગ્રી પર જાઓ",
    primary: "મુખ્ય",
    mobileMenu: "મેનુ",
    openMenu: "મેનુ ખોલો",
    closeMenu: "મેનુ બંધ કરો",
    sections: "વિભાગો",
    breadcrumb: "તમે ક્યાં છો",
    home: "મુખ્ય પૃષ્ઠ",
    /* forCorporate IS ENGLISH ON PURPOSE, and it is the only nav label that
       is. "Corporate" has no settled Gujarati rendering in this context - it
       is the English word everywhere a CSR officer actually meets it - and a
       transliteration nobody uses would be worse than the term itself.

       forSchools went back to Gujarati once the header bar forced the short
       form: "શાળાઓ માટે" is the original attested string, not something
       invented to pair with the label beside it.

       If a native speaker settles on wording for Corporate, it belongs back
       in the language. */
    forSchools: "શાળાઓ અને શિક્ષકો માટે",
    forCorporate: "For Corporate",
    forParents: "વાલીઓ માટે",
    /* Bar label. "CSR" stays English for the reason forCorporate does - it
       is the acronym the reader uses about their own budget. menu.governmentNgos
       keeps the full "સરકાર અને સંસ્થાઓ" for the mega-menu and footer. */
    government: "સરકાર અને CSR",
    whatWeDo: "અમે શું કરીએ છીએ",
    impact: "પ્રભાવ",
    resources: "સંસાધનો",
    about: "અમારા વિશે",
    contact: "સંપર્ક",
    careers: "કારકિર્દી",
  },
  cta: {
    bookDemo: "ડેમો બુક કરો",
    demo: "ડેમો",
    enquire: "આ કીટ વિશે પૂછપરછ કરો",
    exploreApproach: "અમારો અભિગમ જુઓ",
    seeAllKits: "બધી લર્નિંગ કીટ જુઓ",
    downloadBrochure: "બ્રોશર ડાઉનલોડ કરો",
    requestProposal: "દરખાસ્ત મંગાવો",
    findAKit: "યોગ્ય કીટ શોધો",
    readMore: "વધુ વાંચો",
    learnMore: "વધુ જાણો",
  },
  product: {
    ageLabel: "ઉંમર",
    playersLabel: "ખેલાડીઓ",
    durationLabel: "સમય",
    settingLabel: "સ્થળ",
    outcomes: "બાળકો શું શીખીને જાય છે",
    skills: "વિકસતી કુશળતાઓ",
    curriculum: "અભ્યાસક્રમ સાથે સુસંગતતા",
    howToPlay: "કેવી રીતે રમવું",
    inTheBox: "બોક્સમાં શું છે",
    related: "આ સાથે સારી રીતે જોડાતી કીટ",
    /* Portfolio, not catalogue - decision D7. No price, no cart, anywhere. */
    noPricingNote:
      "કીટ શાળા કાર્યક્રમના ભાગરૂપે પૂરી પાડવામાં આવે છે. તમારી શાળા વિશે અમને જણાવો, અમે વિકલ્પો અને કિંમતની વિગત મોકલીશું.",
  },
  filters: {
    heading: "કીટ ફિલ્ટર કરો",
    clearAll: "બધું સાફ કરો",
    apply: "પરિણામો બતાવો",
    /* Gujarati has no separate plural verb form here, so one phrasing covers
       both counts - but the singular still drops the numeral, as English does. */
    resultCount: (n: number) => (n === 1 ? "1 કીટ મળી" : `${n} કીટ મળી`),
    emptyTitle: "આ ફિલ્ટર સાથે કોઈ કીટ મળી નથી",
    emptyBody: "એકાદ ફિલ્ટર દૂર કરી જુઓ. અહીં કેટલાક નજીકના વિકલ્પો છે.",
    age: "ઉંમર",
    subject: "વિષય",
    skill: "કુશળતા",
    pillar: "શીખવાનું લક્ષ્ય",
    duration: "સમયગાળો",
    setting: "ઘરની અંદર / બહાર",
    groupSize: "જૂથનું કદ",
    grade: "ધોરણ",
  },
  form: {
    name: "તમારું નામ",
    email: "ઈમેલ સરનામું",
    phone: "મોબાઈલ નંબર",
    school: "શાળાનું નામ",
    organisation: "સંસ્થા",
    district: "જિલ્લો",
    role: "તમારી ભૂમિકા",
    message: "તમે અમને શું જણાવવા માંગો છો",
    preferredTime: "ફોન કરવા માટે યોગ્ય સમય",
    optional: "વૈકલ્પિક",
    required: "જરૂરી",
    submit: "પૂછપરછ મોકલો",
    submitting: "મોકલી રહ્યા છીએ…",
    successTitle: "આભાર, અમને મળી ગયું.",
    successBody: "અમારી ટીમમાંથી કોઈ બે કાર્યકારી દિવસમાં તમને ફોન કરશે.",
    errorGeneric: "અમારી બાજુએ કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.",
    /* Errors say how to fix, never just "invalid" - a11y checklist §3 */
    errorName: "કૃપા કરીને તમારું નામ લખો",
    errorEmail: "name@school.edu.in જેવું ઈમેલ સરનામું લખો",
    errorPhone: "10 અંકનો મોબાઈલ નંબર લખો",
    errorSchool: "કૃપા કરીને તમારી શાળાનું નામ લખો",
    consent: "મને વર્ગખંડનાં સંસાધનો વિશે પ્રસંગોપાત અપડેટ મળે તે ગમશે.",
  },
  theme: {
    toggle: "થીમ બદલો",
    toLight: "લાઇટ થીમ પર જાઓ",
    toDark: "ડાર્ક થીમ પર જાઓ",
  },
  menu: {
    theApproach: "અમારો અભિગમ",
    learningThroughPlay: "રમતથી શિક્ષણ",
    learningThroughPlayDesc: "દરેક કીટ પાછળનું ચિંતન",
    whyExperiential: "અનુભવથી શિક્ષણ શા માટે?",
    whyExperientialDesc: "વર્ગખંડમાં બદલાતી પાંચ બાબતો",
    gameCorner: "ગેમ કોર્નર",
    gameCornerDesc: "તમારી શાળામાં શીખવાનો ખૂણો",
    fivePillars: "પાંચ સ્તંભ",
    learningKits: "લર્નિંગ કીટ",
    allKits: "બધી લર્નિંગ કીટ",
    explore: "શોધો",
    forYou: "તમારા માટે",
    company: "કંપની",
    ourImpact: "અમારો પ્રભાવ",
    aboutUs: "અમારા વિશે",
    /* NEEDS A NATIVE SPEAKER. Written to match the register of the
       neighbouring *Desc strings in this file, but unattested - unlike the
       labels above, which were already here. */
    aboutUsDesc: "અમે કોણ છીએ અને શા માટે આ બનાવીએ છીએ",
    ourImpactDesc: "કેટલી કિટ પહોંચી, અને તેનું શું પરિણામ આવ્યું",
    privacy: "ગોપનીયતા",
    terms: "શરતો",
    /* English, for the reason on nav.forSchools above. */
    schools: "Schools & Teachers",
    corporate: "Corporate & CSR",
    parents: "વાલીઓ",
    governmentNgos: "સરકાર અને સંસ્થાઓ",
  },
  pillars: {
    "foundational-learning": "પાયાનું શિક્ષણ",
    "health-nutrition": "આરોગ્ય અને પોષણ",
    "climate-education": "પર્યાવરણ શિક્ષણ",
    "future-readiness": "ભવિષ્યની તૈયારી",
    "life-skills": "જીવન કૌશલ્ય",
  },
  locale: {
    label: "ભાષા",
    switchTo: "View in English",
  },
  trust: {
    nep: "NEP 2020 અનુરૂપ",
    ncf: "NCF 2023 સુસંગત",
    training: "શિક્ષક તાલીમ સામેલ",
  },
  common: {
    loading: "લોડ થઈ રહ્યું છે",
    opensInNewTab: "નવી ટેબમાં ખૂલે છે",
    downloadsFile: "ફાઇલ ડાઉનલોડ થાય છે",
    backToTop: "ઉપર જાઓ",
  },
};
