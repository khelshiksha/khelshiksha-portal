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
    items: [
      { name: "NCF 2023", file: "ncf-2023.png" },
      /* Supplied named .svg but actually a WebP payload, so the browser tried
         to parse binary as XML and rendered a broken image. Converted to PNG
         rather than just renamed, so the file and its extension agree. */
      { name: "Ministry of Education, Government of India", file: "ministry-of-education.png" },
      { name: "PM SHRI", file: "pm-shri.png" },
      { name: "Fit India Movement", file: "fit-india.png" },
      { name: "Eat Right India", file: "eat-right-india.png" },
      { name: "Mission LiFE", file: "mission-life.png" },
    ],
  },
  {
    _id: "cred-worked-with",
    key: "worked-with",
    heading: "Institutions we have delivered for",
    note: "Kits, modules and training programmes built with or for these organisations.",
    items: [
      { name: "UNICEF", file: "unicef.svg", relationship: "Learning modules developed for UNICEF" },
      { name: "GUJCOST", file: "gujcost.png", relationship: "Gujarat Council on Science & Technology" },
      { name: "GEDA", file: "geda.png", relationship: "Gujarat Energy Development Agency" },
      { name: "Children's University", file: "childrens-university.png" },
      { name: "World Yogasana", file: "world-yogasana.png", relationship: "Veer's Yogasana Game Kit, 1st World Yogasana Sports Championship" },
      { name: "Yogasana Bharat", file: "yogasana-bharat.png" },
      { name: "BAPS", file: "baps.svg" },
      { name: "Ahmedabad Municipal Corporation", file: "ahmedabad-municipal-corporation.png" },
      { name: "GoBananas", file: "gobananas.png" },
    ],
  },
];
