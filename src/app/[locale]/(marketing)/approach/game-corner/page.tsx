import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { GameCornerBand } from "@/components/blocks/content/game-corner-band";
import { CTABand } from "@/components/blocks/content/cta-band";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import { SHELF_KEYS, SHELF_LABEL } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "The Game Corner",
  description:
    "A branded shelf unit that gives learning kits a home in the classroom, organised by theme so a teacher can find the right one in seconds.",
  path: "/approach/game-corner",
});

const NOTES: Record<string, string> = {
  "wellbeing-values": "Mindfulness, movement and emotional regulation.",
  "nutrition-health": "Food groups, balanced plates and everyday habits.",
  "nature-discovery": "Local species, weather and observation.",
  "math-thinking": "Number sense, logic and early literacy.",
  "teamwork-citizenship": "Road safety, turn-taking and civic responsibility.",
  "environment-sustainability": "Water, waste and climate-conscious choices.",
};

export default function GameCornerPage() {
  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          trail={[
            { name: "Learning Through Play", path: "/approach" },
            { name: "The Game Corner", path: "/approach/game-corner" },
          ]}
        />
      </Container>

      <Section className="pt-10 sm:pt-12">
        <Container className="flex flex-col gap-12">
          <SectionTitle
            level={1}
            eyebrow="Experiential Learning Zone"
            title="Joyful, experiential and"
            accent="future-ready education."
            lede="The Game Corner is the physical home for the kits inside your school: a shelf unit organised by theme, so choosing an activity takes seconds rather than a planning period."
          />

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHELF_KEYS.map((key, i) => (
              <Reveal as="li" key={key} delay={staggerDelay(i)}>
                <Card className="flex h-full flex-col gap-2 p-6">
                  <h2 className="text-h3 text-ink font-bold">
                    {SHELF_LABEL[key]}
                  </h2>
                  <p className="text-body-sm text-ink-muted">{NOTES[key]}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <GameCornerBand />

      <CTABand
        title="Put one in"
        accent="your school."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
      />
    </>
  );
}
