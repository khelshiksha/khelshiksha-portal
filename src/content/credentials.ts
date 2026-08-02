import type { CredentialGroup } from "@/services/cms/types";

/**
 * Institutional marks, in two groups that make DIFFERENT claims.
 *
 * This separation is the whole point of the file and must not be collapsed
 * into one "Our Partners" strip:
 *
 *   ALIGNMENT — national frameworks and missions the programme is built
 *   against. Showing these claims nothing about the organisation behind them.
 *   It is the same claim the brochure makes under "Strategic Alignment with
 *   National Missions", and it is verifiable by reading the kits.
 *
 *   WORKED WITH — organisations Khel Shiksha has actually delivered something
 *   for. This claims a working relationship, so every entry needs to be one
 *   the company can evidence if a government officer asks.
 *
 * A logo in the wrong group turns a factual statement into an implied
 * endorsement, which is the one failure mode that matters here.
 *
 * UNICEF IS THE ONE TO WATCH. Its brand guidelines prohibit third-party use
 * that implies endorsement, and "developed learning modules for UNICEF" is a
 * statement about work done, not a partnership. It is listed with an explicit
 * relationship line for that reason. If written permission is not on file,
 * delete the entry — that is a one-line change and nothing else breaks.
 */
export const credentialGroups: CredentialGroup[] = [
  {
    _id: "cred-alignment",
    key: "alignment",
    heading: "Built against national frameworks",
    /* Says what the logos mean, so the row cannot be read as endorsement. */
    note: "Our kits and teacher training are designed to these published frameworks and missions.",
    /* w/h are the files' real pixel dimensions — see CredentialItem. */
    items: [
      { name: "NCF 2023", file: "ncf-2023.png", w: 313, h: 200 },
      /* Supplied named .svg but actually a WebP payload, so the browser tried
         to parse binary as XML and rendered a broken image. Converted to PNG
         rather than just renamed, so the file and its extension agree. */
      { name: "Ministry of Education, Government of India", file: "ministry-of-education.png", w: 430, h: 200 },
      { name: "PM SHRI", file: "pm-shri.png", w: 266, h: 200 },
      { name: "Fit India Movement", file: "fit-india.png", w: 213, h: 200 },
      { name: "Eat Right India", file: "eat-right-india.png", w: 545, h: 200 },
      { name: "Mission LiFE", file: "mission-life.png", w: 268, h: 200 },
    ],
  },
  {
    _id: "cred-worked-with",
    key: "worked-with",
    heading: "Institutions we have delivered for",
    note: "Kits, modules and training programmes built with or for these organisations.",
    items: [
      /* SVGs: dimensions read off the viewBox, rounded. */
      { name: "UNICEF", file: "unicef.svg", w: 170, h: 47, relationship: "Learning modules developed for UNICEF" },
      { name: "GUJCOST", file: "gujcost.png", w: 200, h: 200, relationship: "Gujarat Council on Science & Technology" },
      { name: "GEDA", file: "geda.png", w: 200, h: 200, relationship: "Gujarat Energy Development Agency" },
      { name: "Children's University", file: "childrens-university.png", w: 200, h: 200 },
      { name: "World Yogasana", file: "world-yogasana.png", w: 197, h: 200, relationship: "Veer's Yogasana Game Kit, 1st World Yogasana Sports Championship" },
      { name: "Yogasana Bharat", file: "yogasana-bharat.png", w: 200, h: 200 },
      { name: "BAPS", file: "baps.svg", w: 279, h: 357 },
      { name: "Ahmedabad Municipal Corporation", file: "ahmedabad-municipal-corporation.png", w: 300, h: 200 },
      { name: "GoBananas", file: "gobananas.png", w: 544, h: 200 },
    ],
  },
];
