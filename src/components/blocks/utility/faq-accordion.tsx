import { Plus } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd } from "@/lib/seo";
import type { FaqItem } from "@/services/cms/types";

/**
 * Native <details>/<summary>.
 *
 * No JavaScript, no ARIA to get wrong, correct keyboard behaviour for free,
 * and it works before hydration and with JS disabled. A hand-rolled accordion
 * here would be strictly worse in every dimension except the animation, and
 * the animation is not worth it.
 */
export function FaqAccordion({
  items,
  eyebrow = "Questions",
  title = "The things principals actually",
  accent = "ask us first.",
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  accent?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Section labelledBy="faq-heading">
      <Container className="flex max-w-3xl flex-col gap-10">
        <SectionTitle
          id="faq-heading"
          eyebrow={eyebrow}
          title={title}
          accent={accent}
        />

        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item._id} className="border-b border-rule">
              <details className="group">
                <summary className="flex cursor-pointer items-start justify-between gap-5 py-5 text-left list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[1.0625rem] font-bold text-ink">
                    {item.question}
                  </h3>
                  <Plus
                    size={19}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="pb-6 text-body text-ink-muted">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </Container>

      <JsonLd data={faqJsonLd(items)} />
    </Section>
  );
}
