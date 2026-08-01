import type { Metadata } from "next";
import { AudiencePage } from "@/features/audiences/audience-page";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "For Government & NGOs",
  description:
    "Over 12,000 kits delivered to PM SHRI schools across Gujarat. Experiential learning at district scale, aligned to NEP 2020 and NCF 2023.",
  path: "/government",
});

export default function Page() {
  return <AudiencePage audienceKey="government" />;
}
