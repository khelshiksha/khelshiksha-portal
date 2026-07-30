# 10. User Journeys

Five personas, each with the question they actually arrive with, the friction that loses them,
and the instrumentation that proves it worked.

---

## J1 — Meera, Principal (PM SHRI school, Mehsana district)

**Arrives from:** a WhatsApp forward from another principal, or a Google search for
*"NEP 2020 activity based learning kits Gujarat"*. On a desktop, between periods, ~4 minutes.

**Her real question:** *"Is this legitimate, has the government already approved it, and how
much of my staff's time will it cost me?"*

| Step | Page | What must be true |
|---|---|---|
| 1 | `/` | Within one viewport she sees **12,000+ kits · PM SHRI · UNICEF · NCF 2023**. Credibility before pitch. |
| 2 | `/schools` | The rollout is shown as a **timeline, not a brochure** — Week 0 audit → Week 2 install → Week 3 training → ongoing. Removes the "how much work is this" fear. |
| 3 | `/schools/teacher-training` | Explicit hours, format, and who delivers it. Her staff's time is the real currency. |
| 4 | `/impact/case-studies/[slug]` | One school like hers, with a before/after outcome she recognises. |
| 5 | `/schools` → Book a Demo | Form is **5 fields max**: name, school, district, phone, preferred time. Nothing else. |

**Friction that loses her:** a product grid before an outcomes statement; a form asking for
student count and budget before she has decided to talk to anyone; any page that implies this
is a retail purchase rather than a programme.

**Success:** `Lead(type=SCHOOL_DEMO)` with `source=/schools`.
**Instrument:** scroll-depth on `/schools/implementation`, time-on-page for case studies,
demo-form field-drop-off.

---

## J2 — Rakesh, Grade 4 Teacher (municipal school, Ahmedabad)

**Arrives from:** organic search for *"grade 4 maths activity worksheet free"* — a long-tail
resource query, on Android, on 4G, between classes. He has never heard of Khel Shiksha.

**His real question:** *"Can I get something I can use tomorrow morning, free, in under two
minutes?"*

| Step | Page | What must be true |
|---|---|---|
| 1 | `/blog/[slug]` or `/teachers/lesson-plans` | Lands deep. The page must stand alone — he did not come through the homepage. |
| 2 | resource card | Preview visible **before** any email gate. Show him the value first. |
| 3 | email gate | One field. Email only. Grade/subject optional and clearly skippable. |
| 4 | download + thank-you | Immediate PDF. Then, and only then, a soft cross-sell: *"This activity is from the Aryabhata kit — see how it works in a full classroom set."* |
| 5 | `/products/aryabhata` | Now he is a warm lead who has already used our material. |

**Friction that loses him:** a gate before the preview; a multi-field form; a 3MB hero image
on a lesson-plan page; a PDF that opens in a broken mobile viewer.

**Why he matters strategically:** teachers do not buy, but they *recommend*. Rakesh telling
Meera the kits are good is worth more than any ad. The resource library is the top of that funnel.

**Success:** `ResourceDownload` row + newsletter opt-in.
**Instrument:** gate conversion rate, download→product-page click-through, return-visit rate.

---

## J3 — Priya, Parent (two children, ages 6 and 9, Surat)

**Arrives from:** Instagram (`@khelshiksha`) or a search for *"screen free learning games for
6 year old"*. Mobile, evening, browsing mood.

**Her real question:** *"Will my child actually enjoy this, or will it sit in a cupboard?"*

| Step | Page | What must be true |
|---|---|---|
| 1 | `/parents` | Warm, video-first. A real child playing, not a rendered illustration. |
| 2 | `/parents/choosing-a-kit` | A short guided finder: age → interest → time available. Three questions, not a nine-facet filter. |
| 3 | results | 2–3 recommendations with **learning outcomes in parent language** — "builds number confidence", not "strengthens numeracy competencies per FLN framework". |
| 4 | `/products/[slug]` | Video of gameplay above the fold. Age, duration, players, what's in the box. |
| 5 | enquiry / buy | Depends on open question D5. If no public pricing, this is "Enquire" and must say why (bulk/school pricing). |

**Friction that loses her:** institutional language; NEP/NCF jargon on parent pages (it belongs
on `/schools` and `/government`, not here); a nine-facet filter bar; no video.

**Success:** `Lead(type=PARENT_ENQUIRY)` or a guided-finder completion.
**Instrument:** finder start→complete rate, video play rate, mobile bounce on `/parents`.

---

## J4 — Mr. Desai, District Education Officer (Government of Gujarat)

**Arrives from:** a direct link in an email, or a vendor search. Desktop, evaluating against
a procurement checklist, likely printing the page.

**His real question:** *"Can this vendor deliver at district scale, and does it map to the
schemes I am already accountable for?"*

| Step | Page | What must be true |
|---|---|---|
| 1 | `/government` | Scheme alignment stated in the first screen: **NEP 2020 · NCF 2023 · Fit India · Mission LiFE · Eat Right India**. Named, not implied. |
| 2 | `/government/pm-shri` | The 12,000-kit deployment as a full case study — timeline, districts, logistics, outcomes. This single page is the strongest asset on the site. |
| 3 | `/government/scale` | Manufacturing capacity, delivery logistics, training-the-trainer model. |
| 4 | `/impact` | Third-party validation: UNICEF, GUJCOST, press coverage. |
| 5 | Request a proposal | Longer form is acceptable here — he expects it. Capture department, district, scale, timeline. |

**Friction that loses him:** vague claims without numbers; no downloadable PDF (he needs to
forward it); a page that prints badly.

**Non-obvious requirement:** `/government` and `/government/pm-shri` need a **clean print
stylesheet**. This audience prints and circulates. It is a half-day of CSS that meaningfully
affects a high-value journey.

**Success:** `Lead(type=GOVT_PROPOSAL)` or an impact-deck download.
**Instrument:** PDF downloads, print events, form completion on long-form.

---

## J5 — Anjali, Programme Manager (education NGO, 40 partner schools)

**Arrives from:** referral or a search for *"experiential learning partner NGO India"*.

**Her real question:** *"Can I run this across 40 schools with my existing field team, and can
I report outcomes to my funder?"*

She follows a hybrid of J1 and J4 — the rollout mechanics of a principal, the scale and
evidence requirements of a government buyer. She is served by `/government` (which covers
NGOs) plus `/schools/outcomes`.

**Her unique need — and the one thing no competitor does well:** *funder-grade measurement*.
`/schools/outcomes` must show what is measured, how, and what a report looks like. A sample
outcome report as a downloadable PDF is the single highest-leverage asset for this persona.

**Success:** `Lead(type=NGO_PARTNERSHIP)`.

---

## Cross-cutting journey rules

1. **Every deep page stands alone.** J2 and J4 both land below the homepage. Each page needs
   its own context, breadcrumb, and CTA — never assume a homepage visit happened.
2. **Language shifts by audience, content does not.** The same Aryabhata kit is described as
   "strengthens arithmetic fluency and logical reasoning" on `/schools` and "builds number
   confidence through play" on `/parents`. Sanity holds both strings; the audience hub picks one.
3. **No dead ends.** Every leaf ends with a CTA block matched to the likely arriving audience.
4. **Forms are audience-scaled.** Parent: 3 fields. Teacher: 1. School: 5. Government: 8+ is
   fine. Asking a parent for their annual budget is how you lose a parent.
5. **The AI Advisor (phase 3) accelerates J3 and J5, and never gates them.** It is an
   alternative path to the guided finder, not a replacement. Everything works with JS disabled
   and with the AI service down.
