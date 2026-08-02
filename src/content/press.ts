import type { PressCutting } from "@/services/cms/types";

/**
 * Gujarati press coverage, scanned from the originals.
 *
 * `publication` and `date` are NULLABLE and mostly null, and the component
 * renders a caption only where they exist. That is deliberate: a cutting
 * captioned with a guessed masthead or an invented date is worse than an
 * uncaptioned one, because the guess is the part a journalist or a government
 * officer would check first. Filling these in is a two-field edit per entry.
 *
 * The alt text describes what each cutting IS, in English, because a screen
 * reader user cannot see a Gujarati headline in an image and the alt is the
 * only thing standing between them and "image".
 */
export const pressCuttings: PressCutting[] = [
  {
    _id: "press-1",
    file: "cutting-1.jpg",
    alt: "Gujarati newspaper report on climate-change science awareness game training for primary school teachers in Bharuch, run with the Directorate of Primary Education and covering 30 government primary schools.",
    publication: "Headline",
    date: null,
  },
  {
    _id: "press-2",
    file: "cutting-2.jpg",
    alt: "Gujarati newspaper report: the District Lok Vigyan Kendra, Bharuch runs a climate-change science awareness game training programme for primary school teachers, part of a 1-31 August 2024 programme across all 33 districts of Gujarat.",
    publication: null,
    date: null,
  },
  {
    _id: "press-3",
    file: "cutting-3.jpg",
    alt: "Gujarati newspaper report on the Bharuch district climate-change science awareness board game training for teachers of 30 government primary schools.",
    publication: null,
    date: null,
  },
  {
    _id: "press-4",
    file: "cutting-4.jpg",
    alt: "Gujarati newspaper coverage of a Khel Shiksha school programme.",
    publication: null,
    date: null,
  },
  {
    _id: "press-5",
    file: "cutting-5.jpg",
    alt: "Gujarati newspaper report: teachers from 28 schools in Vidyanagar trained in 12 games on reducing the effects of climate change.",
    publication: null,
    date: null,
  },
  {
    _id: "press-6",
    file: "cutting-6.jpg",
    alt: "Gujarati newspaper report: 60 teachers from Navsari and Valsad districts given climate science board game training.",
    publication: null,
    date: null,
  },
  {
    _id: "press-7",
    file: "cutting-7.jpg",
    alt: "Gujarati newspaper coverage of a Khel Shiksha school programme.",
    publication: null,
    date: null,
  },
];
